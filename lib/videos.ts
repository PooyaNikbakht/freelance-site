// Walkthrough videos are served from Cloudflare R2 (bucket pooya-media), not from the
// Worker. Posters are pre-optimized WebP files in public/video at -640 and -1200, like
// the screenshots, so the page loads only the poster until someone presses play.

const mediaUrl = "https://media.pooya.website/videos";

export type Video = { src: string; poster: string; duration: string; label: string };

function video(name: string, duration: string, label: string): Video {
  return { src: `${mediaUrl}/${name}.mp4`, poster: `/video/${name}`, duration, label };
}

export const introVideo = video("intro", "2:17", "Video: a two-minute introduction to me and my work");

/** Demo walkthroughs, keyed by work entry slug. Durations are filled in from the final renders. */
const workVideos: Record<string, Video> = {
  "docs-chat": video("docs-chat", "2:00", "Video: a walkthrough of the website support bot"),
};

export function getWorkVideo(slug: string): Video | undefined {
  return workVideos[slug];
}
