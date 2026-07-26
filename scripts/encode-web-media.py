#!/usr/bin/env python3
"""Encode oversized local media into GitHub/Vercel-safe web files (<95MB)."""
from __future__ import annotations

import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FFMPEG = Path(os.environ.get("FFMPEG", "/tmp/ffmpeg"))
MAX_BYTES = 95 * 1024 * 1024

# path relative to ROOT → encode kind
JOBS = [
    ("assets/film/mirage/mix.wav", "audio", "assets/film/mirage/mix.m4a"),
    ("assets/film/thirst/film.mp4", "video", "assets/film/thirst/film.mp4"),
    ("assets/film/between-the-shadow/film.mp4", "video", "assets/film/between-the-shadow/film.mp4"),
    ("assets/film/birdy/film.mp4", "video", "assets/film/birdy/film.mp4"),
    ("assets/film/early-spring/film.mp4", "video", "assets/film/early-spring/film.mp4"),
    ("assets/install/dmsp/final-pre.mp4", "video", "assets/install/dmsp/final-pre.mp4"),
    ("assets/install/dmsp/screen-record.mov", "video", "assets/install/dmsp/screen-record.mp4"),
    ("assets/install/dmsp/sfx/chaos-music.wav", "audio", "assets/install/dmsp/sfx/chaos-music.m4a"),
    ("assets/install/a1/demo.mp4", "video", "assets/install/a1/demo.mp4"),
    ("assets/install/a2/presentation.mp4", "video", "assets/install/a2/presentation.mp4"),
    ("assets/install/a2/explanation.mp4", "video", "assets/install/a2/explanation.mp4"),
    ("assets/game/soundscape/demo-1-play.mp4", "video", "assets/game/soundscape/demo-1-play.mp4"),
    ("assets/game/soundscape/demo-2-play.mp4", "video", "assets/game/soundscape/demo-2-play.mp4"),
    ("assets/game/soundscape/demo-2-explain.mp4", "video", "assets/game/soundscape/demo-2-explain.mp4"),
]


def real_src(rel: str) -> Path:
    p = ROOT / rel
    return p.resolve()


def run(cmd: list[str]) -> None:
    print("+", " ".join(cmd), flush=True)
    subprocess.check_call(cmd)


def encode_audio(src: Path, dst: Path, bitrate: str = "160k") -> None:
    # Keep a real container extension so ffmpeg can pick a muxer
    tmp = dst.with_name(dst.stem + ".partial" + dst.suffix)
    tmp.parent.mkdir(parents=True, exist_ok=True)
    run(
        [
            str(FFMPEG),
            "-y",
            "-i",
            str(src),
            "-vn",
            "-c:a",
            "aac",
            "-b:a",
            bitrate,
            "-movflags",
            "+faststart",
            str(tmp),
        ]
    )
    if dst.is_symlink() or dst.exists():
        dst.unlink()
    tmp.replace(dst)


def encode_video(src: Path, dst: Path, height: int, crf: int) -> None:
    tmp = dst.with_name(dst.stem + ".partial.mp4")
    tmp.parent.mkdir(parents=True, exist_ok=True)
    vf = f"scale=-2:{height}"
    run(
        [
            str(FFMPEG),
            "-y",
            "-i",
            str(src),
            "-vf",
            vf,
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-crf",
            str(crf),
            "-c:a",
            "aac",
            "-b:a",
            "128k",
            "-ac",
            "2",
            "-movflags",
            "+faststart",
            str(tmp),
        ]
    )
    # If destination path currently a symlink, remove it first
    if dst.is_symlink() or dst.exists():
        dst.unlink()
    tmp.replace(dst)


def ensure_under_limit(kind: str, src: Path, dst: Path) -> None:
    if kind == "audio":
        for br in ("160k", "128k", "96k"):
            encode_audio(src, dst, br)
            size = dst.stat().st_size
            print(f"  -> {dst} {size/1024/1024:.1f}MB @ {br}", flush=True)
            if size <= MAX_BYTES:
                return
        raise SystemExit(f"audio still too large: {dst}")

    # video ladder
    ladder = [
        (720, 28),
        (720, 30),
        (720, 32),
        (540, 28),
        (540, 30),
        (540, 32),
        (480, 30),
        (480, 32),
        (480, 34),
    ]
    for height, crf in ladder:
        encode_video(src, dst, height, crf)
        size = dst.stat().st_size
        print(f"  -> {dst} {size/1024/1024:.1f}MB @ {height}p crf{crf}", flush=True)
        if size <= MAX_BYTES:
            return
    raise SystemExit(f"video still too large: {dst}")


def main() -> None:
    if not FFMPEG.exists():
        sys.exit(f"ffmpeg not found at {FFMPEG}")

    only = set(sys.argv[1:]) if len(sys.argv) > 1 else None
    for src_rel, kind, dst_rel in JOBS:
        if only and src_rel not in only and dst_rel not in only:
            continue
        src = real_src(src_rel)
        dst = ROOT / dst_rel
        if not src.exists():
            print(f"SKIP missing {src_rel}", flush=True)
            continue
        # Skip if destination already a real file under limit and newer-ish
        if dst.exists() and not dst.is_symlink() and dst.stat().st_size <= MAX_BYTES:
            # Re-encode if source is the same path and still huge? If dst is real and small, skip
            if dst.resolve() != src or src.stat().st_size <= MAX_BYTES:
                print(f"SKIP already web-sized {dst_rel} ({dst.stat().st_size/1024/1024:.1f}MB)", flush=True)
                continue
        print(f"ENCODE {src_rel} ({src.stat().st_size/1024/1024:.1f}MB) -> {dst_rel}", flush=True)
        # If encoding in-place over symlink, read from resolved src first (copy to temp if needed)
        work_src = src
        if dst.resolve() == src:
            # in-place: copy source bytes to temp input
            work_src = ROOT / ".media-local" / Path(src_rel).name
            work_src.parent.mkdir(parents=True, exist_ok=True)
            if not work_src.exists() or work_src.stat().st_size != src.stat().st_size:
                print(f"  staging {work_src}", flush=True)
                shutil.copy2(src, work_src)
        ensure_under_limit(kind, work_src, dst)
    print("ALL DONE", flush=True)


if __name__ == "__main__":
    main()
