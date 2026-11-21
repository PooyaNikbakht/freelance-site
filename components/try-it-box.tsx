import { ButtonLink } from "./ui";

/** "Try it" card on project pages: inline after the intro on phones, a sticky column on desktop. */
export function TryItBox({
  liveUrl,
  adminUrl,
  repoUrl,
  guideUrl,
  tryIt,
}: {
  liveUrl?: string | null;
  adminUrl?: string | null;
  repoUrl?: string | null;
  guideUrl?: string;
  tryIt?: string;
}) {
  return (
    <aside aria-labelledby="try-it-heading" className="rounded-[12px] border border-border bg-surface p-5">
      <h2 id="try-it-heading" className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-accent">
        Try it
      </h2>
      {tryIt ? <p className="mt-3 text-pretty leading-relaxed">{tryIt}</p> : null}
      <div className="mt-4 flex flex-col gap-3">
        {liveUrl ? (
          <ButtonLink href={liveUrl} className="w-full">
            Visit the live site
          </ButtonLink>
        ) : null}
        {adminUrl ? (
          <ButtonLink href={adminUrl} variant="secondary" className="w-full">
            Try the owner admin
          </ButtonLink>
        ) : null}
        {guideUrl ? (
          <ButtonLink href={guideUrl} variant="secondary" className="w-full">
            How to try it
          </ButtonLink>
        ) : null}
        {repoUrl ? (
          <ButtonLink href={repoUrl} variant="secondary" className="w-full">
            View the source on GitHub
          </ButtonLink>
        ) : null}
      </div>
    </aside>
  );
}
