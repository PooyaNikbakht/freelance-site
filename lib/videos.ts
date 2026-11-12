// Walkthrough videos are served from Cloudflare R2 (bucket pooya-media), not from the
// Worker. Posters are pre-optimized WebP files in public/video at -640 and -1200, like
// the screenshots, so the page loads only the poster until someone presses play.

const mediaUrl = "https://media.pooya.website/videos";

export type Video = { src: string; poster: string; duration: string; label: string };

function video(name: string, duration: string, label: string): Video {
  return { src: `${mediaUrl}/${name}.mp4`, poster: `/video/${name}`, duration, label };
}

export const introVideo = video("intro", "2:17", "Video: a two-minute introduction to me and my work");

/** Demo walkthroughs, keyed by work entry slug. Lines come from demo-videos/tools/publish-videos.sh. */
const workVideos: Record<string, Video> = {
  "brightside-cleaning-quotes": video("cleaning-quote-calculator", "2:33", "Video: a walkthrough of a cleaning company's instant quote calculator"),
  "booking-assistant": video("booking-assistant", "2:11", "Video: a walkthrough of the booking assistant"),
  "docs-chat": video("website-support-bot", "2:43", "Video: a walkthrough of the website support bot"),
  "freelance-site": video("this-website", "2:21", "Video: a walkthrough of this website"),
  "harbourview-bakery-website": video("bakery-website", "2:10", "Video: a walkthrough of the bakery website"),
  "harbourview-physio": video("physio-clinic-booking", "2:23", "Video: a walkthrough of a physio clinic's website and booking"),
  "kingsway-cuts": video("barbershop-booking", "2:57", "Video: a walkthrough of a barbershop's website and booking"),
  "maple-paws-vet": video("vet-clinic-website", "1:55", "Video: a walkthrough of a vet clinic's website"),
  "northwind-coffee-ordering": video("coffee-shop-ordering", "2:22", "Video: a walkthrough of a coffee shop's online ordering"),
  "northwind-coffee-website": video("coffee-shop-website", "2:04", "Video: a walkthrough of a coffee shop's website"),
  "paperwork-ai": video("paperwork-ai", "3:04", "Video: a walkthrough of Paperwork AI"),
  "shop-search": video("smart-product-search", "1:50", "Video: a walkthrough of the smart product search"),
  "site-rescue": video("website-speed-rescue", "2:45", "Video: a walkthrough of the website speed rescue"),
  "workflow-runner": video("ai-workflow-runner", "2:37", "Video: a walkthrough of the AI workflow runner"),
};

export function getWorkVideo(slug: string): Video | undefined {
  return workVideos[slug];
}
