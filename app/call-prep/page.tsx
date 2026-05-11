"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Calendar, Phone, UserRound } from "lucide-react";
import { CALLS } from "@/lib/call-data";
import type { CallData } from "@/lib/call-data";
import { getDoneCalls } from "@/lib/done-calls";

import { AppSidebar } from "@/components/call-prep/AppSidebar";

type TabKey = "today" | "tomorrow";

/** Display label for stakeholder technical level — matches Figma “Non-technical”. */
function formatTechnical(raw?: string): string {
  if (!raw) return "Non-technical";
  const r = raw.toLowerCase();
  if (r.includes("non")) return "Non-technical";
  if (r.includes("semi")) return "Semi-technical";
  return "Technical";
}

/** Short headline industry to align with card layout (e.g. “Insurance”). */
function headlineIndustry(industry: string): string {
  const amp = industry.split(/\s*&\s*/);
  return amp[0]?.trim() || industry;
}

/** Card blurb: end at “…during acquisitions.” when present; else first sentence (~2 lines). */
function trimmedCompanyDescription(description: string): string {
  const m = description.match(/^[\s\S]*?during acquisitions\.?/i);
  if (m) {
    const out = m[0].trim();
    return out.endsWith(".") ? out : `${out}.`;
  }
  const firstSentence = description.split(/(?<=\.)\s+/)[0]?.trim();
  if (firstSentence && firstSentence.length < description.trim().length) {
    return firstSentence.endsWith(".") ? firstSentence : `${firstSentence}.`;
  }
  return description.trim();
}

function CompanyBlurb({ company, description }: { company: string; description?: string }) {
  if (!description) return null;
  const brief = trimmedCompanyDescription(description);
  const rest = brief.startsWith(company)
    ? brief.slice(company.length)
    : ` ${brief}`;
  return (
    <p className="line-clamp-2 text-[14px] font-normal leading-[20px] text-[rgba(0,0,0,0.5)]">
      <span className="text-[rgba(3,82,208,0.9)] underline decoration-solid [text-decoration-skip-ink:none]">
        {company}
      </span>
      {rest}
    </p>
  );
}

// ── Root Page — Revsphere Figma Call Preparation ──────────────────────────────
export default function CallPrepPage() {
  const [tab, setTab] = React.useState<TabKey>("today");
  const [doneCalls, setDoneCalls] = React.useState<string[]>([]);

  React.useEffect(() => {
    setDoneCalls(getDoneCalls());
    const onFocus = () => setDoneCalls(getDoneCalls());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const visibleCalls = CALLS.filter(
    (c) => !doneCalls.includes(c.id) && c.section === tab,
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <AppSidebar />

      {/* ── Main (white) ─────────────────────────────────────────────────── */}
      <main className="relative flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto bg-white">
        <div className="flex w-full flex-col gap-5 px-8 pt-7 pb-10">
          <h1 className="text-[24px] font-medium leading-[1.04] tracking-normal text-[rgba(0,0,0,0.9)]">
            Hey Abdullah, let&apos;s get you prepped for your calls!
          </h1>

          <div className="flex h-10 flex-col justify-center">
            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setTab("today")}
                  className={cn(
                    "flex items-center justify-center gap-2 border-b-[1.5px] px-2 py-3 text-[14px] font-medium leading-4 transition-colors",
                    tab === "today"
                      ? "border-[rgba(0,0,0,0.9)] text-[rgba(0,0,0,0.9)]"
                      : "border-transparent text-[rgba(0,0,0,0.5)] hover:text-[rgba(0,0,0,0.7)]",
                  )}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setTab("tomorrow")}
                  className={cn(
                    "flex items-center justify-center gap-2 px-2 py-3 text-[14px] font-medium leading-4 transition-colors",
                    tab === "tomorrow"
                      ? "border-b-[1.5px] border-[rgba(0,0,0,0.9)] text-[rgba(0,0,0,0.9)]"
                      : "border-b-[1.5px] border-transparent text-[rgba(0,0,0,0.5)] hover:text-[rgba(0,0,0,0.7)]",
                  )}
                >
                  Tomorrow
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-xl",
                    "bg-[rgba(0,0,0,0.9)]",
                  )}
                  aria-label="Open calendar"
                >
                  <Calendar className="size-3.5 text-white" strokeWidth={2} />
                </button>
                <Link
                  href="/call-prep/all"
                  className={cn(
                    "flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-[32px] border border-solid border-[rgba(0,0,0,0.12)] bg-white px-4 py-2",
                    "text-[14px] font-medium leading-4 text-[rgba(0,0,0,0.9)]",
                    "transition-colors hover:bg-black/[0.02]",
                  )}
                >
                  <Phone className="size-3.5 shrink-0 text-[rgba(0,0,0,0.55)]" strokeWidth={1.75} />
                  View All Calls
                </Link>
              </div>
            </div>
          </div>

          {/* Card row */}
          <div className="flex flex-col gap-4">
            {visibleCalls.length === 0 ? (
              <p className="py-16 text-center text-[14px] text-[rgba(0,0,0,0.5)]">
                No calls scheduled for{" "}
                {tab === "today" ? "today" : "tomorrow"}.
              </p>
            ) : (
              <div className="grid w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleCalls.map((c) => (
                  <PrepCard key={c.id} card={c} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Prep card (Figma focus-area-card) ─────────────────────────────────────────
function PrepCard({ card }: { card: CallData }) {
  const primary =
    card.stakeholders.find((s) => s.name === card.person) ??
    card.stakeholders[0];
  const techLine = formatTechnical(primary?.technicalLevel);
  const roleTitle =
    card.role.toLowerCase() === "co-founder"
      ? "Co-founder"
      : card.role.replace(/-/g, " ");

  return (
    <Link href={`/call-prep/${card.id}`} className="block h-full min-w-0">
      <article
        className={cn(
          "flex h-full min-h-[290px] flex-col overflow-hidden rounded-[32px] bg-[#f7f7f7] p-5",
          "transition-shadow hover:shadow-md",
        )}
      >
        <div className="flex flex-1 flex-col gap-8">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex w-full items-start justify-between gap-2">
                <p className="whitespace-nowrap text-[16px] font-semibold leading-[22px] tracking-[-0.2px] text-[rgba(0,0,0,0.9)]">
                  {card.person}
                </p>
                <div className="flex shrink-0 items-center gap-1">
                  <div className="flex items-center justify-center rounded-[20px] bg-white px-2 py-px">
                    <p className="whitespace-nowrap text-[14px] font-normal leading-5 text-[rgba(0,0,0,0.5)]">
                      Call Rating:{" "}
                      <span className="text-[rgba(0,0,0,0.81)]">
                        {card.rating * 2}/10
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col items-start">
                    <div
                      className={cn(
                        "flex items-center justify-center gap-1 rounded-[20px] px-2 py-px",
                        "bg-[rgba(144,8,8,0.12)]",
                      )}
                    >
                      <span className="whitespace-nowrap text-[14px] font-medium leading-[18px] text-[#b90707]">
                        {card.remaining} left
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1">
                <div className="flex items-center gap-1">
                  <UserRound className="h-3.5 w-3.5 shrink-0 text-[rgba(0,0,0,0.5)]" />
                  <span className="text-[14px] font-normal leading-5 text-[rgba(0,0,0,0.5)]">
                    {roleTitle}
                  </span>
                </div>
                <span className="text-[14px] leading-5 text-[rgba(0,0,0,0.5)]">
                  •
                </span>
                <span className="text-[14px] font-normal leading-5 text-[rgba(0,0,0,0.5)]">
                  {techLine}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <p className="whitespace-nowrap text-[12px] font-normal leading-normal tracking-[1px] text-[rgba(0,0,0,0.7)]">
                COMPANY INFORMATION
              </p>
              <CompanyBlurb company={card.company} description={card.description} />
            </div>
          </div>

          <div className="flex flex-col justify-center gap-[22px]">
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex min-w-0 flex-col gap-3" style={{ width: 137 }}>
                <p className="text-[14px] font-medium leading-[1.4] text-[rgba(0,0,0,0.5)]">
                  Industry
                </p>
                <p className="truncate text-[24px] font-medium leading-[1.04] text-[rgba(0,0,0,0.9)]">
                  {headlineIndustry(card.companyDetails.industry)}
                </p>
              </div>

              <div className="h-14 w-px shrink-0 self-center bg-[rgba(0,0,0,0.12)]" />

              <div className="flex min-w-0 flex-col gap-3" style={{ width: 137 }}>
                <p className="text-[14px] font-medium leading-[1.4] text-[rgba(0,0,0,0.5)]">
                  Employees
                </p>
                <p className="text-[24px] font-medium leading-[1.04] text-[rgba(0,0,0,0.9)]">
                  {card.companyDetails.employees}
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
