"use client";

import Image from "next/image";
import { useState } from "react";
import type { Video } from "@/lib/videos";

/**
 * 16:9 video that shows only its poster until pressed, so the page never downloads
 * the video on load. Captions are burned into the video itself.
 */
export function VideoPlayer({
  video,
  sizes,
  className = "",
}: {
  video: Video;
  sizes: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={`relative aspect-video overflow-hidden bg-[#121821] ${className}`}>
      {playing ? (
        <video
          src={video.src}
          poster={`${video.poster}-1200.webp`}
          controls
          autoPlay
          playsInline
          aria-label={video.label}
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${video.label} (${video.duration})`}
          className="group absolute inset-0 h-full w-full cursor-pointer focus-visible:outline-[3px] focus-visible:-outline-offset-[3px]"
        >
          <Image src={video.poster} alt="" fill sizes={sizes} className="object-cover" />
          {/* Light dim so the play button reads first. Lightens on hover. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/5 motion-reduce:transition-none"
          />
          {/* Kept small and tight to the corner: some posters start their "Demo for" text at 15.7% height. */}
          <span
            aria-hidden="true"
            className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-[4px] bg-black/55 px-1.5 py-[3px] text-[11px] font-semibold uppercase leading-none tracking-[0.12em] text-white sm:left-4 sm:top-4 sm:text-xs"
          >
            <svg viewBox="0 0 12 12" className="h-3 w-3 fill-accent-2">
              <path d="M3 1.8v8.4a.6.6 0 0 0 .9.52l7-4.2a.6.6 0 0 0 0-1.04l-7-4.2A.6.6 0 0 0 3 1.8Z" />
            </svg>
            Video
          </span>
          {/* Player-style control bar. Poster artwork ends at about 71% height, so the bar (52px on a 184px-tall
              poster at 360px wide) stays just below it. Gold (accent-2) with its ink color, so the triangle
              has AA contrast in both themes. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 flex h-[52px] items-center gap-3 bg-black/60 px-3.5 sm:h-[60px] sm:gap-4"
          >
            <span className="video-play-pulse relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-2 text-accent-2-ink transition-[scale,filter] group-hover:scale-[1.08] group-hover:brightness-[1.08] group-focus-visible:scale-[1.08] motion-reduce:transition-none sm:h-11 sm:w-11">
              <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-current">
                <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
              </svg>
            </span>
            <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
              <span className="block h-full w-[12%] bg-accent-2" />
            </span>
            <span className="shrink-0 text-[13px] font-medium tabular-nums text-white sm:text-sm">{video.duration}</span>
          </span>
        </button>
      )}
    </div>
  );
}
