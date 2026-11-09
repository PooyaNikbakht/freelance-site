"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Shot } from "./work-gallery";

type Item = { key: string; label: string; caption: string; thumb: ReactNode; full: ReactNode };

/**
 * Screenshot grid where each image opens in a large view. Uses a native <dialog>
 * for focus handling and Esc; arrows (buttons or keys) move through the gallery.
 */
export function ShotLightboxGrid({ shots }: { shots: Shot[] }) {
  const items: Item[] = shots.map((shot) => ({
    key: shot.src,
    label: shot.alt,
    caption: shot.caption,
    thumb: (
      <Image
        src={shot.src}
        alt={shot.alt}
        fill
        sizes="(min-width: 1024px) 560px, (min-width: 640px) 50vw, 100vw"
        className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none"
      />
    ),
    full: (
      // eslint-disable-next-line @next/next/no-img-element -- full-size file served as-is
      <img
        src={`${shot.src}-1200.webp`}
        alt={shot.alt}
        className="max-h-[80vh] w-auto max-w-full rounded-[10px] border border-[#232b36] bg-[#121821]"
      />
    ),
  }));
  return <LightboxGrid items={items} />;
}

function LightboxGrid({ items }: { items: Item[] }) {
  const shots = items;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const step = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + shots.length) % shots.length)),
    [shots.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const onClose = () => setIndex(null);
    dialog.addEventListener("keydown", onKey);
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("keydown", onKey);
      dialog.removeEventListener("close", onClose);
    };
  }, [step]);

  const current = index === null ? null : shots[index];

  return (
    <>
      <ul className="mt-6 grid gap-6 sm:grid-cols-2">
        {shots.map((shot, i) => (
          <li key={shot.key}>
            <figure>
              <button
                type="button"
                onClick={() => open(i)}
                aria-label={`View larger: ${shot.label}`}
                className="group relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-[12px] border border-border bg-surface"
              >
                {shot.thumb}
              </button>
              <figcaption className="mt-3 text-sm leading-relaxed text-muted">{shot.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={current ? current.label : "Image viewer"}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-[#0b0f14]/90"
      >
        {current ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-4 sm:p-8" onClick={(e) => e.target === e.currentTarget && close()}>
            {current.full}
            <p className="max-w-3xl text-center text-sm text-[#c9ced6]">
              {current.caption}
              <span className="ml-2 font-mono text-xs text-[#8b95a3]">
                {index! + 1} / {shots.length}
              </span>
            </p>
          </div>
        ) : null}
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="fixed right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#1c2430] text-xl text-white hover:bg-[#263040]"
        >
          ×
        </button>
        {shots.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="fixed left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#1c2430] text-lg text-white hover:bg-[#263040]"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className="fixed right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#1c2430] text-lg text-white hover:bg-[#263040]"
            >
              →
            </button>
          </>
        ) : null}
      </dialog>
    </>
  );
}
