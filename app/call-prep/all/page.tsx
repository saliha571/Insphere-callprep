"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Phone, SlidersHorizontal, Search } from "lucide-react";
import { AppSidebar } from "@/components/call-prep/AppSidebar";
import { CallPrepBreadcrumbs } from "@/components/call-prep/CallPrepBreadcrumbs";
import { cn } from "@/lib/utils";
import { CALLS, type CallData, type Readiness } from "@/lib/call-data";

/** Rough hours-until-call from mock strings (“2h 14m”, “4m”, “14h 4m”). */
function urgencyHours(remaining: string): number {
  const hMatch = remaining.match(/(\d+)\s*h/i);
  if (hMatch) return Number.parseInt(hMatch[1], 10);
  const dMatch = remaining.match(/(\d+)\s*d/i);
  if (dMatch) return Number.parseInt(dMatch[1], 10) * 24;
  const mMatch = remaining.match(/(\d+)\s*m/i);
  if (mMatch) return 0;
  return 12;
}

function RemainingChip({ remaining }: { remaining: string }) {
  const hrs = urgencyHours(remaining);
  const calm = hrs >= 6;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-[20px] px-2 py-px text-[14px] font-medium leading-[18px] whitespace-nowrap",
        calm
          ? "bg-[rgba(8,60,144,0.12)] text-[#0745b9]"
          : "bg-[rgba(144,8,8,0.12)] text-[#b90707]",
      )}
    >
      {remaining} left
    </span>
  );
}

function CompanyMark({ company }: { company: string }) {
  const letter = company.trim()[0]?.toUpperCase() ?? "?";
  return (
    <div className="flex size-[30px] shrink-0 items-center justify-center rounded-md bg-black/[0.06] text-[12px] font-semibold text-[rgba(0,0,0,0.65)]">
      {letter}
    </div>
  );
}

// ── All Calls — Revsphere Figma 2028:31121 ───────────────────────────────────────
export default function AllCallsPage() {
  const [sectionScope, setSectionScope] = useState<"all" | "today" | "tomorrow">(
    "all",
  );
  const [readinessFilter, setReadinessFilter] = useState<
    Readiness | "all"
  >("all");
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!filterWrapRef.current?.contains(e.target as Node)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [filterOpen]);

  const filtered = CALLS.filter((c) => {
    if (sectionScope !== "all" && c.section !== sectionScope) return false;
    if (readinessFilter !== "all" && c.readiness !== readinessFilter)
      return false;
    const q = search.trim().toLowerCase();
    if (q) {
      if (
        !c.person.toLowerCase().includes(q) &&
        !c.company.toLowerCase().includes(q) &&
        !c.role.toLowerCase().includes(q) &&
        !c.website.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const matchesDefaultFilters =
    sectionScope === "all" &&
    readinessFilter === "all" &&
    search.trim() === "";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <AppSidebar logoHref="/call-prep" />

      <main className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-white">
        <div className="flex w-full flex-col gap-5 px-8 pt-6 pb-12">
          <CallPrepBreadcrumbs
            items={[
              { label: "Dashboard", href: "/call-prep" },
              { label: "All Calls" },
            ]}
          />
          <h1 className="text-[24px] font-medium leading-[1.04] text-[rgba(0,0,0,0.9)]">
            All Calls
          </h1>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSectionScope("all");
                  setReadinessFilter("all");
                  setSearch("");
                }}
                className={cn(
                  "flex h-8 items-center gap-2 rounded-[32px] border border-[rgba(0,0,0,0.12)] bg-white px-4 py-2 text-[14px] font-medium leading-4 text-[rgba(0,0,0,0.9)] transition-colors",
                  matchesDefaultFilters && "bg-black/[0.03]",
                )}
              >
                <Phone className="size-3.5 shrink-0 text-[rgba(0,0,0,0.55)]" strokeWidth={1.75} />
                All
              </button>

              <div className="relative" ref={filterWrapRef}>
                <button
                  type="button"
                  onClick={() => setFilterOpen((v) => !v)}
                  className={cn(
                    "flex h-8 items-center gap-2 rounded-[32px] border border-[rgba(0,0,0,0.12)] bg-white px-4 py-2 text-[14px] font-medium leading-4 text-[rgba(0,0,0,0.9)] transition-colors",
                    (filterOpen ||
                      sectionScope !== "all" ||
                      readinessFilter !== "all") &&
                      "bg-black/[0.03]",
                  )}
                >
                  <SlidersHorizontal
                    className="size-3.5 shrink-0 text-[rgba(0,0,0,0.55)]"
                    strokeWidth={1.75}
                  />
                  Filter
                </button>
                {filterOpen && (
                  <div className="absolute left-0 top-[calc(100%+8px)] z-20 flex min-w-[220px] flex-col gap-3 rounded-2xl border border-[rgba(0,0,0,0.12)] bg-white p-4 shadow-lg">
                    <label className="flex flex-col gap-1.5 text-[12px] font-medium text-[rgba(0,0,0,0.5)]">
                      When
                      <select
                        value={sectionScope}
                        onChange={(e) =>
                          setSectionScope(
                            e.target.value as "all" | "today" | "tomorrow",
                          )
                        }
                        className="rounded-xl border border-[rgba(0,0,0,0.12)] bg-white px-3 py-2 text-[14px] font-medium text-[rgba(0,0,0,0.9)] outline-none"
                      >
                        <option value="all">All dates</option>
                        <option value="today">Today</option>
                        <option value="tomorrow">Tomorrow</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1.5 text-[12px] font-medium text-[rgba(0,0,0,0.5)]">
                      Prep status
                      <select
                        value={readinessFilter}
                        onChange={(e) =>
                          setReadinessFilter(e.target.value as Readiness | "all")
                        }
                        className="rounded-xl border border-[rgba(0,0,0,0.12)] bg-white px-3 py-2 text-[14px] font-medium text-[rgba(0,0,0,0.9)] outline-none"
                      >
                        <option value="all">All</option>
                        <option value="complete">Prep ready</option>
                        <option value="in-progress">Enriching</option>
                        <option value="gap-flagged">Action needed</option>
                        <option value="not-started">Not started</option>
                      </select>
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="relative w-full sm:w-[200px] sm:shrink-0">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-3.5 -translate-y-1/2 text-[rgba(0,0,0,0.35)]"
                strokeWidth={1.75}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="h-9 w-full rounded-[32px] border border-[rgba(0,0,0,0.12)] bg-white py-2 pl-10 pr-4 text-[14px] font-medium leading-4 text-[rgba(0,0,0,0.9)] outline-none placeholder:text-[rgba(0,0,0,0.5)] focus:border-[rgba(0,0,0,0.2)]"
              />
            </div>
          </div>

          <div className="min-w-0 overflow-x-auto">
            <div className="min-w-[900px]">
              <div
                className="grid items-start gap-3 border-b border-[rgba(0,0,0,0.12)] px-0 py-3 text-[14px] font-medium leading-5 text-[rgba(0,0,0,0.5)]"
                style={{
                  gridTemplateColumns:
                    "minmax(160px, 1.1fr) minmax(200px, 1.2fr) minmax(140px, 0.9fr) minmax(120px, 0.75fr) 130px",
                }}
              >
                <p>Prospect</p>
                <p>Company</p>
                <p>Date</p>
                <p>Time remaining</p>
                <p>Actions</p>
              </div>

              {filtered.map((call) => (
                <CallTableRow key={call.id} call={call} />
              ))}

              {filtered.length === 0 && (
                <p className="border-t border-[rgba(0,0,0,0.12)] py-12 text-center text-[14px] text-[rgba(0,0,0,0.45)]">
                  No calls match your filters.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function CallTableRow({ call }: { call: CallData }) {
  const web = call.website.trim();
  const companyHref = /^https?:\/\//i.test(web) ? web : `https://${web}`;

  return (
    <div
      className="grid items-center gap-3 border-t border-[rgba(0,0,0,0.12)] py-3 text-[14px] font-medium leading-5"
      style={{
        gridTemplateColumns:
          "minmax(160px, 1.1fr) minmax(200px, 1.2fr) minmax(140px, 0.9fr) minmax(120px, 0.75fr) 130px",
      }}
    >
      <p className="truncate text-black">{call.person}</p>

      <div className="flex min-w-0 items-center gap-2">
        <CompanyMark company={call.company} />
        <a
          href={companyHref}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 truncate text-[14px] font-medium text-[rgba(0,25,255,0.9)] underline decoration-solid underline-offset-2"
        >
          {call.company}
        </a>
      </div>

      <p className="truncate text-[rgba(0,0,0,0.9)]">{call.datetime}</p>

      <div className="flex min-w-0">
        <RemainingChip remaining={call.remaining} />
      </div>

      <div>
        <Link
          href={`/call-prep/${call.id}`}
          className="inline-flex h-9 items-center justify-center rounded-[32px] border border-[rgba(0,0,0,0.12)] bg-white px-4 text-[14px] font-medium leading-4 text-[rgba(0,0,0,0.9)] transition-colors hover:bg-black/[0.02]"
        >
          Prep call
        </Link>
      </div>
    </div>
  );
}
