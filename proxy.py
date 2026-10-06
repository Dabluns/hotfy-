"""
Proxy local para streaming de áudio/vídeo do Google Drive sem CORS.

Uso:
    pip install flask google-auth google-auth-httplib2 google-api-python-client
    python proxy.py

Frontend aponta para: http://localhost:8765/stream?id=FILE_ID
"""

import re
import subprocess
from flask import Flask, request, Response, stream_with_context
from google.oauth2 import service_account
from google.auth.transport.requests import AuthorizedSession

SERVICE_ACCOUNT_FILE = r"C:\Users\Usuario\Downloads\hotfy-conteudos-27013afd48a8.json"
SCOPES               = ["https://www.googleapis.com/auth/drive.readonly"]
PORT                 = 8765

app = Flask(__name__)

creds   = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
session = AuthorizedSession(creds)


@app.after_request
def cors(response):
    response.headers["Access-Control-Allow-Origin"]   = "*"
    response.headers["Access-Control-Allow-Methods"]  = "GET, OPTIONS"
    response.headers["Access-Control-Allow-Headers"]  = "Range"
    response.headers["Access-Control-Expose-Headers"] = (
        "Content-Type, Content-Length, Content-Range, Accept-Ranges"
    )
    return response


@app.route("/stream")
def stream_file():
    file_id = request.args.get("id", "").strip()
    if not file_id:
        return "Missing id", 400

    url     = f"https://www.googleapis.com/drive/v3/files/{file_id}?alt=media"
    headers = {}

    # Repassa Range para suporte a seek no player
    if "Range" in request.headers:
        headers["Range"] = request.headers["Range"]

    upstream = session.get(url, headers=headers, stream=True)

    if upstream.status_code not in (200, 206):
        return f"Drive error: {upstream.status_code}", upstream.status_code

    resp_headers = {
        "Content-Type":  upstream.headers.get("Content-Type", "audio/ogg"),
        "Accept-Ranges": "bytes",
    }
    for h in ("Content-Length", "Content-Range"):
        if h in upstream.headers:
            resp_headers[h] = upstream.headers[h]

    return Response(
        stream_with_context(upstream.iter_content(chunk_size=64 * 1024)),
        status=upstream.status_code,
        headers=resp_headers,
    )


@app.route("/thumb")
def thumb_file():
    """Serve thumbnail de imagem do Drive (redimensionado, leve)."""
    file_id = request.args.get("id", "").strip()
    sz      = request.args.get("sz", "w400")
    if not file_id:
        return "Missing id", 400

    url      = f"https://lh3.googleusercontent.com/d/{file_id}=s400"
    upstream = session.get(url, stream=True)

    # fallback: thumbnail via Drive API
    if upstream.status_code != 200:
        url      = f"https://www.googleapis.com/drive/v3/files/{file_id}?fields=thumbnailLink"
        meta     = session.get(url).json()
        thumb_lnk = meta.get("thumbnailLink", "")
        if thumb_lnk:
            thumb_lnk = thumb_lnk.replace("=s220", f"={sz}")
            upstream = session.get(thumb_lnk, stream=True)
        else:
            # last resort: full file
            return stream_file()

    resp_headers = {
        "Content-Type":  upstream.headers.get("Content-Type", "image/jpeg"),
        "Cache-Control": "public, max-age=86400",
    }
    if "Content-Length" in upstream.headers:
        resp_headers["Content-Length"] = upstream.headers["Content-Length"]

    return Response(
        stream_with_context(upstream.iter_content(chunk_size=64 * 1024)),
        status=200,
        headers=resp_headers,
    )


CONVERT_MIMES = {"audio/ogg", "audio/opus", "application/ogg"}

@app.route("/download")
def download_file():
    """
    Baixa o arquivo do Drive.
    Áudios OGG/Opus são convertidos para MP3 via FFmpeg antes de servir.
    """
    file_id  = request.args.get("id",   "").strip()
    filename = request.args.get("name", "arquivo").strip()
    if not file_id:
        return "Missing id", 400

    # Busca metadados para saber o mime type
    meta_url  = f"https://www.googleapis.com/drive/v3/files/{file_id}?fields=name,mimeType,size"
    meta      = session.get(meta_url).json()
    mime      = meta.get("mimeType", "")
    orig_name = meta.get("name", filename)

    url      = f"https://www.googleapis.com/drive/v3/files/{file_id}?alt=media"
    upstream = session.get(url, stream=False)   # carrega tudo para passar ao ffmpeg

    if upstream.status_code not in (200, 206):
        return f"Drive error: {upstream.status_code}", upstream.status_code

    if mime in CONVERT_MIMES or orig_name.lower().endswith((".ogg", ".opus")):
        # Converte OGG/Opus → MP3 via FFmpeg (stdin → stdout)
        base      = re.sub(r"\.[^.]+$", "", orig_name)
        out_name  = base + ".mp3"
        proc = subprocess.run(
            ["ffmpeg", "-y", "-i", "pipe:0", "-codec:a", "libmp3lame", "-q:a", "2",
             "-f", "mp3", "pipe:1"],
            input=upstream.content,
            capture_output=True,
        )
        if proc.returncode != 0:
            return f"FFmpeg error: {proc.stderr.decode()[-300:]}", 500

        return Response(
            proc.stdout,
            headers={
                "Content-Type":        "audio/mpeg",
                "Content-Disposition": f'attachment; filename="{out_name}"',
                "Content-Length":      str(len(proc.stdout)),
            },
        )

    # Outros tipos (mp4, imagens, docs): passa direto com Content-Disposition
    safe_name = re.sub(r'[\\/*?:"<>|]', "_", orig_name)
    return Response(
        upstream.content,
        headers={
            "Content-Type":        mime or "application/octet-stream",
            "Content-Disposition": f'attachment; filename="{safe_name}"',
            "Content-Length":      str(len(upstream.content)),
        },
    )


@app.route("/health")
def health():
    return "ok", 200


if __name__ == "__main__":
    print(f"✔  Proxy rodando em http://localhost:{PORT}")
    print(f"   Pressione Ctrl+C para parar\n")
    app.run(host="0.0.0.0", port=PORT, debug=False)
