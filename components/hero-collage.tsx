import Image from "next/image";
import type { CSSProperties } from "react";

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
        <Image src={src} alt={alt} fill priority sizes="(min-width: 1024px) 520px, 90vw" className="object-cover object-top" />
      </div>
    </div>
  );
}

function PhoneFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="overflow-hidden rounded-[22px] border-[5px] border-[#1c2430] bg-[#1c2430]">
      <div className="relative aspect-[390/700] overflow-hidden rounded-[17px]">
        <Image src={src} alt={alt} fill sizes="200px" className="object-cover object-top" />
      </div>
    </div>
  );
}

export function HeroCollage() {
  return (
    <div className="relative mx-auto w-full max-w-[34rem] select-none pb-10 sm:pb-14 lg:max-w-none">
      <div className="collage-card w-[88%] sm:w-[86%]" style={{ "--delay": "0.05s" } as CSSProperties}>
        <BrowserFrame src="/work/kingsway-cuts" alt="Kingsway Cuts, a barbershop website with online booking" />
      </div>
      <div
        className="collage-card absolute bottom-0 right-[20%] w-[29%] sm:right-[22%] sm:w-[27%]"
        style={{ "--delay": "0.15s" } as CSSProperties}
      >
        <PhoneFrame src="/work/hero-phone-northwind" alt="Northwind Coffee Co. website on a phone" />
      </div>
      <div
        className="collage-card absolute bottom-6 right-0 w-[29%] sm:bottom-8 sm:w-[27%]"
        style={{ "--delay": "0.25s" } as CSSProperties}
      >
        <PhoneFrame src="/work/hero-phone-maplepaws" alt="Maple Paws Vet website on a phone" />
      </div>
    </div>
  );
}
