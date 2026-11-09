// Images in this site are pre-optimized WebP files in public/ at two widths
// (name-640.webp and name-1200.webp), so they need no image optimization
// service at runtime. The Cloudflare Worker has none configured.
const widths = [640, 1200];

export default function imageLoader({ src, width }: { src: string; width: number }) {
  return `${src}-${widths.find((w) => w >= width) ?? widths[widths.length - 1]}.webp`;
}
