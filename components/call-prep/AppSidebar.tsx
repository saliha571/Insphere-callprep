"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const SIDEBAR_LOGO_SRC = "/brand/insphere-logo.png";

const imgCollapseBtn =
  "http://localhost:3845/assets/8617444a33d1440f572df3040e2c6f1b251658a0.svg";
const imgNavAIAgents =
  "http://localhost:3845/assets/e5c98e13f239ed9fde99db192113cd87821f64e4.svg";
const imgNavUserMgmt =
  "http://localhost:3845/assets/47de2fb5f27373ab56331dd8ba539a6991c130e7.svg";
const imgNavPrompt =
  "http://localhost:3845/assets/246d2affd7e15828fddf99611462ef5ebeefcd52.svg";
const imgNavAnalytics =
  "http://localhost:3845/assets/31db0c3a207b6d081326a280b651a7da262a85d1.svg";
const imgNavLeadEnrich =
  "http://localhost:3845/assets/749ea788b4a6e52a373545047262c746f3b4ed40.svg";
const imgNavCallPrep =
  "http://localhost:3845/assets/809d890f748a278f7fe8a7b72a6f1f1de3294191.svg";
const imgNavPostDC =
  "http://localhost:3845/assets/8b1e36aec46996ca72264d8377f9b11b388340d4.svg";
const imgNavCallQA =
  "http://localhost:3845/assets/c5255a3444b99f4506ea1971e8e8dc05ee27ea1d.svg";

const SIDEBAR_TOP: { img: string; label: string }[] = [
  { img: imgNavAIAgents, label: "AI Agents" },
  { img: imgNavUserMgmt, label: "User Management" },
  { img: imgNavPrompt, label: "Prompt Playground" },
  { img: imgNavAnalytics, label: "Analytics" },
];

const SALES_NAV: { img: string; label: string; active?: boolean }[] = [
  { img: imgNavLeadEnrich, label: "Lead Enrichment" },
  { img: imgNavCallPrep, label: "Call Preparation", active: true },
  { img: imgNavPostDC, label: "Post DC" },
  { img: imgNavCallQA, label: "Call QA" },
];

type AppSidebarProps = {
  /** When set, wraps the logo in a link (e.g. back to dashboard). */
  logoHref?: string;
  className?: string;
};

export function AppSidebar({ logoHref, className }: AppSidebarProps) {
  const logo = (
    <div className="relative h-8 w-40 shrink-0 overflow-visible">
      <img
        src={SIDEBAR_LOGO_SRC}
        alt="Insphere"
        width={160}
        height={32}
        className="pointer-events-none block h-8 max-h-8 w-40 max-w-40 origin-left select-none object-contain object-left"
      />
    </div>
  );

  return (
    <aside
      className={cn(
        // Design system: sidebar width spacing-64 (256px); matches layout.sidebarWidth token
        "flex h-full w-64 shrink-0 flex-col justify-between border-r border-black/[0.08] bg-[#f7f7f7] px-6 pb-5 pt-7",
        className,
      )}
    >
      <div className="flex flex-col gap-8">
        <div className="flex min-h-10 w-full items-center justify-between gap-3">
          {logoHref ? (
            <Link href={logoHref} className="min-w-0 flex-1 shrink">
              {logo}
            </Link>
          ) : (
            logo
          )}
          <button
            type="button"
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-black/[0.05]",
            )}
            aria-label="Collapse sidebar"
          >
            <img src={imgCollapseBtn} alt="" className="h-2.5 w-2.5" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <nav className="flex flex-col gap-0">
            {SIDEBAR_TOP.map(({ img, label }) => (
              <button
                key={label}
                type="button"
                className={cn(
                  "flex h-9 w-full items-center gap-3 overflow-hidden rounded-[32px] px-4 text-left text-[14px] font-medium leading-4 text-[rgba(0,0,0,0.6)] transition-colors hover:bg-black/[0.03]",
                )}
              >
                <img src={img} alt="" className="h-3.5 w-3.5 shrink-0" />
                {label}
              </button>
            ))}
          </nav>

          <div className="flex flex-col">
            <div className="flex h-8 items-center px-4">
              <span className="whitespace-nowrap text-[10px] font-normal uppercase tracking-[1px] text-[rgba(0,0,0,0.5)]">
                SALES
              </span>
            </div>
            <nav className="flex flex-col gap-0">
              {SALES_NAV.map(({ img, label, active }) => (
                <div
                  key={label}
                  className={cn(
                    "flex h-9 w-full cursor-default items-center gap-3 overflow-hidden rounded-[32px] px-4 transition-colors",
                    active
                      ? "bg-white text-[14px] font-medium leading-4 text-black shadow-[0px_1px_3px_rgba(0,0,0,0.06)]"
                      : "text-[14px] font-medium leading-4 text-[rgba(0,0,0,0.6)] hover:bg-black/[0.03]",
                  )}
                >
                  <img src={img} alt="" className="h-3.5 w-3.5 shrink-0 opacity-90" />
                  {label}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="h-px w-full shrink-0 bg-black/[0.08]" aria-hidden />
        <div className="flex flex-col px-0">
          <div className="flex items-center gap-3">
            <div
              className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full"
              style={{ background: "rgba(1,143,244,0.32)" }}
            >
              <span className="text-[12px] font-medium leading-4 text-[#01a2f6]">
                AA
              </span>
            </div>
            <span className="whitespace-nowrap text-[14px] font-medium leading-4 text-black">
              Abdullah Ali
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
