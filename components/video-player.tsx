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
          aria-label={`Play ${video.label.charAt(0).toLowerCase()}${video.label.slice(1)} (${video.duration})`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          <Image src={video.poster} alt="" fill sizes={sizes} className="object-cover" />
          {/* The poster's bottom band is empty (captions painted out), so the button sits there. */}
          <span className="absolute inset-x-0 bottom-[4%] flex justify-center">
            <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-accent py-1.5 pl-2.5 pr-4 text-sm font-semibold text-accent-ink transition-transform group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none sm:min-h-12 sm:gap-2.5 sm:pl-3 sm:pr-5 sm:text-base">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 fill-current sm:h-7 sm:w-7">
                <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
              </svg>
              Watch · {video.duration}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
