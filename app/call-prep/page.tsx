"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart2,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronUp,
  Clock,
  Globe,
  Layers,
  LayoutGrid,
  MessageSquare,
  Monitor,
  Sparkles,
  User,
} from "lucide-react";
import { CALLS } from "@/lib/call-data";
import type { CallData, Readiness } from "@/lib/call-data";
import { getDoneCalls } from "@/lib/done-calls";

// ── Sidebar nav data ─────────────────────────────────────────────────────────
const SIDEBAR_TOP = [
  { icon: Monitor, label: "AI Agents" },
  { icon: Layers, label: "Integration" },
  { icon: User, label: "User Management" },
  { icon: MessageSquare, label: "Prompt Playground" },
  { icon: BarChart2, label: "Analytics" },
];

const SALES_NAV = [
  "AE Co-pilot",
  "Call Preparation",
  "Discovery Call QA",
  "Lead Enrichment",
  "Pitch Deck",
];

// ── Root Page ────────────────────────────────────────────────────────────────
export default function CallPrepPage() {
  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const [doneCalls, setDoneCalls] = React.useState<string[]>([]);
  React.useEffect(() => {
    setDoneCalls(getDoneCalls());
    const onFocus = () => setDoneCalls(getDoneCalls());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const visibleCalls = CALLS.filter((c) => !doneCalls.includes(c.id));

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="flex h-full w-[180px] flex-shrink-0 flex-col justify-between bg-white">
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-0.5 p-3 pb-2">
            <button className="mb-2 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100">
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
            {SIDEBAR_TOP.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                <Icon className="h-[17px] w-[17px] flex-shrink-0 text-slate-400" />
                {label}
              </div>
            ))}
          </div>
          <div className="mx-3 h-px bg-slate-100" />
          <div className="flex flex-col p-3 pt-2">
            <span className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Sales
            </span>
            {SALES_NAV.map((label) => {
              const active = label === "Call Preparation";
              return (
                <div key={label} className="relative flex items-center">
                  {active && (
                    <div className="absolute -left-3 h-4 w-0.5 rounded-full bg-slate-900" />
                  )}
                  <div
                    className={cn(
                      "w-full cursor-pointer rounded-md px-2 py-1.5 text-[13px] font-medium text-slate-800 transition-colors",
                      active ? "bg-slate-100" : "hover:bg-slate-50"
                    )}
                  >
                    {label}
                  </div>
                </div>
              );
            })}
            <span className="mt-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              HR
            </span>
            <div className="cursor-pointer rounded-md px-2 py-1.5 text-[13px] font-medium text-slate-800 transition-colors hover:bg-slate-50">
              People Buddy
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="mx-2.5 rounded-lg bg-blue-50 p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 via-red-400 to-green-400 text-sm">
                🌐
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] font-semibold text-[#19173d]">
                    Insphere for Chrome
                  </span>
                  <ArrowUpRight className="h-3 w-3 text-[#19173d]" />
                </div>
                <p className="text-[10.5px] text-slate-500">
                  Available on Web Store
                </p>
              </div>
            </div>
          </div>
          <div className="mx-3 h-px bg-slate-100" />
          <div className="p-2.5">
            <button className="flex w-full items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-[12px] font-semibold text-white">
                  S
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[12px] font-medium text-slate-800">
                    Saliha Shahzad
                  </span>
                  <span className="text-[10.5px] text-slate-400">
                    saliha.shahzad@cam…
                  </span>
                </div>
              </div>
              <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="relative m-2 ml-0 flex flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-[#eef2fb] shadow-sm">
        {/* Topbar */}
        <header className="flex flex-shrink-0 items-center justify-between border-b border-slate-200/60 px-5 py-2.5">
          <div className="flex items-center gap-1.5">
            <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-slate-800">
              <div className="h-1 w-1 rounded-full bg-slate-800" />
            </div>
            <span className="text-[14px] font-semibold tracking-tight text-slate-800">
              Insphere
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/70">
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        {/* Hero */}
        <div className="flex flex-shrink-0 flex-col items-center pt-10 pb-8">
          <p className="mb-2 text-[13px] font-medium text-slate-400">
            {dateLabel}
          </p>
          <p className="mb-1 text-[14px] text-slate-500">
            Good evening, Saliha
          </p>
          <p className="mb-0 bg-[linear-gradient(to_right,#1e293b,#0924ad_89.457%)] bg-clip-text text-[42px] leading-[1.2] tracking-[-1.05px] text-transparent">
            Let&apos;s pick up from where you left off.
          </p>
        </div>

        {/* Section label + right controls */}
        <div className="flex flex-shrink-0 items-center border-b border-slate-200/60 px-6 py-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            All calls for today &amp; tomorrow
            <span className="ml-1.5 opacity-70">({visibleCalls.length})</span>
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/70">
              <Calendar className="h-4 w-4" />
            </button>
            <a
              href="/call-prep/all"
              className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
            >
              View all calls
              <ArrowUpRight className="h-3 w-3 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Cards area — single horizontal scroll row */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
            {visibleCalls.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-slate-400 w-full">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                <p className="text-[14px] font-medium text-slate-600">All caught up!</p>
                <p className="text-[13px]">No pending calls — all marked as done.</p>
              </div>
            ) : visibleCalls.map((c) => (
              <PrepCard key={c.id} card={c} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Urgency helper ────────────────────────────────────────────────────────────
function urgencyLevel(remaining: string): "critical" | "moderate" | "low" {
  if (!remaining.includes("h")) {
    return parseInt(remaining) < 30 ? "critical" : "moderate";
  }
  return parseInt(remaining.split("h")[0]) < 3 ? "moderate" : "low";
}

const URGENCY_CHIP: Record<"critical" | "moderate" | "low", { pill: string; dot: string }> = {
  critical: { pill: "bg-red-50 border border-red-200 text-red-700",   dot: "bg-red-500 animate-pulse" },
  moderate: { pill: "bg-red-50 border border-red-200 text-red-600",   dot: "bg-red-400" },
  low:      { pill: "bg-blue-50 border border-blue-200 text-blue-700", dot: "bg-blue-500" },
};

const CALL_TYPE_LABEL: Record<string, string> = {
  disco: "DISCOVERY CALL",
  predc: "PRE-DC CALL",
};

const READINESS_BADGE: Record<Readiness, { pill: string; dot: string; label: string }> = {
  complete:      { pill: "bg-emerald-50 border border-emerald-200 text-emerald-700", dot: "bg-emerald-500",            label: "Prep ready"    },
  "in-progress": { pill: "bg-blue-50 border border-blue-200 text-blue-700",          dot: "bg-blue-400 animate-pulse", label: "Enriching…"    },
  "gap-flagged": { pill: "bg-amber-50 border border-amber-200 text-amber-700",        dot: "bg-amber-500",              label: "Action needed" },
  "not-started": { pill: "bg-red-50 border border-red-200 text-red-700",              dot: "bg-red-400",                label: "Not started"   },
};

// ── Star rating ───────────────────────────────────────────────────────────────
function StarRating({ rating, max = 5, size = "sm" }: { rating: number; max?: number; size?: "sm" | "md" }) {
  const starSize = size === "md" ? "h-3.5 w-3.5" : "h-3 w-3";
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} className={cn(starSize, "flex-shrink-0", i < rating ? "text-amber-400" : "text-slate-200")} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-[11px] font-medium text-slate-500">{rating}/{max}</span>
    </span>
  );
}

// ── Prep card ─────────────────────────────────────────────────────────────────
function PrepCard({ card }: { card: CallData }) {
  const urgency = urgencyLevel(card.remaining);
  const chip = URGENCY_CHIP[urgency];

  return (
    <article className="flex w-[340px] flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

      {/* ── Row 1: time chip ────────────────────────────────────────── */}
      <div className="px-4 pt-3.5 pb-0">
        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium", chip.pill)}>
          <span className={cn("h-1.5 w-1.5 flex-shrink-0 rounded-full", chip.dot)} />
          {card.remaining} remaining
        </span>
      </div>

      {/* ── Row 2: title ────────────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[16px] font-bold leading-snug text-slate-900">
            {card.person}, {card.company}
          </p>
          <StarRating rating={card.rating} />
        </div>
        <p className="mt-0.5 text-[12.5px] text-slate-500">{card.role}</p>
      </div>

      {/* ── Row 3: company summary — flex-1 pushes footer to bottom ── */}
      <p className="flex-1 px-4 pb-4 text-[13px] leading-relaxed text-slate-500">
        {card.description}
      </p>

      {/* ── Row 4: metadata ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4 px-4 pb-4 text-[12px] text-slate-600">
        <span className="flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
          {card.companyDetails.employees} employees
        </span>
        <span className="flex items-center gap-1.5">
          <Briefcase className="h-3.5 w-3.5 flex-shrink-0" />
          {card.companyDetails.industry}
        </span>
        {card.companyDetails.website && (
          <a
            href={card.companyDetails.website.startsWith("http") ? card.companyDetails.website : `https://${card.companyDetails.website}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-[#2563eb] underline underline-offset-2 hover:text-blue-800"
          >
            <Globe className="h-3.5 w-3.5 flex-shrink-0" />
            {card.companyDetails.website.replace(/^https?:\/\//, "")}
          </a>
        )}
      </div>

      <div className="mx-4 h-px bg-slate-100" />

      {/* ── Row 5: CTA ──────────────────────────────────────────────── */}
      <div className="px-4 py-3">
        <Link
          href={`/call-prep/${card.id}`}
          className="flex w-full items-center justify-center rounded-xl bg-[#3B5BDB] py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-[#3451c7] active:scale-[0.97]"
        >
          View prep
        </Link>
      </div>
    </article>
  );
}
