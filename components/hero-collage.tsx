import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

// Home hero showcase: real project screenshots in a browser frame and two
// phone frames, so a visitor sees the kind of site I build before reading
// anything. Flat frames (borders, no shadows), pre-sized WebP via the custom loader.

function BrowserFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="overflow-hidden rounded-[12px] border border-[#2b3646] bg-[#151d28]">
      <div className="flex items-center gap-1.5 border-b border-[#2b3646] px-3 py-2" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-[#3a4656]" />
        <span className="h-2 w-2 rounded-full bg-[#3a4656]" />
        <span className="h-2 w-2 rounded-full bg-[#3a4656]" />
      </div>
      <div className="relative aspect-[16/10]">
        {/* LCP image: high fetch priority, and sizes matching the frame (88% of the container) so phones
            get the 640px file and it lands before the JS chunks. */}
        <Image
          src={src}
          alt={alt}
          fill
          priority
          fetchPriority="high"
          sizes="(min-width: 820px) 520px, calc(88vw - 28px)"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

function PhoneFrame({ src, alt, topBar }: { src: string; alt: string; topBar?: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[22px] border-[5px] border-[#1c2430] bg-[#1c2430]">
      <div className="relative aspect-[390/700] overflow-hidden rounded-[17px]">
        <Image src={src} alt={alt} fill sizes="200px" className="object-cover object-top" />
        {topBar}
      </div>
    </div>
  );
}

export function HeroCollage() {
  return (
    <div className="relative w-full select-none pb-10 sm:pb-14">
      <div className="collage-card w-[88%] sm:w-[86%]" style={{ "--delay": "0.05s" } as CSSProperties}>
        <BrowserFrame
          src="/work/kingsway-cuts"
          alt="Kingsway Cuts barbershop website with an online booking button, shown in a desktop browser"
        />
      </div>
      <div
        className="collage-card absolute bottom-0 right-[20%] w-[29%] sm:right-[22%] sm:w-[27%]"
        style={{ "--delay": "0.15s" } as CSSProperties}
      >
        {/* Phone-shaped crop of the owner's chat from the customer-assistant-booking screenshot. */}
        <PhoneFrame
          src="/work/hero-phone-assistant"
          alt="AI assistant in Telegram sending a business owner a customer's booking request to approve"
          topBar={
            // Decorative label; the alt text already says it.
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 flex h-[22px] items-center justify-center gap-0.5 overflow-hidden whitespace-nowrap rounded-t-[17px] bg-accent-2/90 px-1 text-[10px] font-semibold leading-none text-accent-2-ink sm:h-[26px] sm:gap-1 sm:text-[11px]"
            >
              <svg viewBox="0 0 16 16" className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" fill="currentColor">
                <path d="M8 0l1.8 6.2L16 8l-6.2 1.8L8 16l-1.8-6.2L0 8l6.2-1.8z" />
              </svg>
              AI assistant
            </span>
          }
        />
      </div>
      <div
        className="collage-card absolute bottom-6 right-0 w-[29%] sm:bottom-8 sm:w-[27%]"
        style={{ "--delay": "0.25s" } as CSSProperties}
      >
        <PhoneFrame src="/work/hero-phone-maplepaws" alt="Maple Paws Vet clinic website shown on a phone" />
      </div>
    </div>
  );
}
