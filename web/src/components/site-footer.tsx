import { GithubLogoIcon, ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { SITE } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-[9px] bg-ink" aria-hidden>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M5 3 V12 H13" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="3" y="2.4" width="2.2" height="2.2" rx="0.5" fill="#fff" />
            </svg>
          </span>
          <span className="font-display text-[15px] font-semibold text-ink">{SITE.name}</span>
          <span className="font-display text-[12px] font-medium text-muted">{SITE.version}</span>
        </div>

        <p className="text-[13px] text-muted">
          &copy; {SITE.year} {SITE.author}. Licensed CC BY-SA 4.0.
        </p>

        <a
          href={SITE.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-display text-[13.5px] font-medium text-ink2 transition-colors hover:text-ink"
        >
          <GithubLogoIcon size={17} weight="fill" />
          Read the spec
          <ArrowUpRightIcon size={13} weight="bold" className="text-muted" />
        </a>
      </div>
    </footer>
  );
}
