"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart2,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Globe,
  Layers,
  MessageSquare,
  Monitor,
  Search,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
type CallType = "disco" | "predc";
type Readiness = "complete" | "in-progress" | "gap-flagged" | "not-started";

interface Turn {
  label: string;
  text: string;
}

interface CallCard {
  id: string;
  company: string;
  person: string;
  role: string;
  type: CallType;
  readiness: Readiness;
  summary: string;
  website: string;
  datetime: string;
  remaining: string;
  section: "today" | "tomorrow";
  turns: Turn[];
}

// ── Data (shared with dashboard) ─────────────────────────────────────────────
const CALLS: CallCard[] = [
  {
    id: "andy",
    company: "NewCo Risk",
    person: "Andy Harbut",
    role: "Co-Founder",
    type: "disco",
    readiness: "complete",
    summary:
      "Insurance and risk advisory for PE firms. 20 years in the space, over 1,000 deals. Six employees, five million in revenue. Boutique operator. Not buying a platform, buying a force multiplier.",
    website: "newcorisk.com",
    datetime: "Today · 3:00 PM",
    remaining: "2h 14m",
    section: "today",
    turns: [
      {
        label: "The Verdict",
        text: "Andy Harbut, Co-Founder at NewCo Risk. Insurance and risk advisory for PE firms, 20 years in the space, over 1,000 deals. He is an operator, not a thought leader. He will not be moved by credentials. He will be moved by whether you understand his world. Medium priority call, he has authority but the firm is small. Ask me anything or I will keep going.",
      },
      {
        label: "The Company Read",
        text: "NewCo Risk serves PE firms during acquisitions. Their job is identifying insurance and risk exposure before a deal closes. Their clients are PE partners under enormous time pressure, they want certainty, not creativity. Six employees, five million in revenue. This is a boutique. They are not buying a platform. They are buying something that makes their small team look bigger and smarter. Frame Tkxel as a force multiplier.",
      },
      {
        label: "The Relevance Bridge",
        text: "Here is where we are genuinely relevant. We built a document processing pipeline for an insurance advisory firm that cut their due diligence report time from three days to four hours. That story lands for Andy, he lives in that problem. Lead with it as a question, not a case study: ask him what the bottleneck is that costs him the most time in a due diligence cycle. Let him describe the problem, then mirror it back with what we built.",
      },
      {
        label: "The Approach",
        text: "Open without pitching. Andy has twenty years in this industry, he will lose respect for you the moment you start selling. Open with a genuine observation about his space. In the middle, let him talk, your job in the first half is to make him feel heard, not to demonstrate Tkxel. Avoid referencing company size. Close directly: ask for the next step, do not wait for him to offer it. He is an operator. He respects directness.",
      },
      {
        label: "Hooks",
        text: "Andy left a President-level role at Symphony Risk Solutions to start NewCo. That is a meaningful choice worth acknowledging if it comes up naturally, not as a compliment, but as a real question: what made you decide to go independent? His background is in high-stakes, high-trust environments. Match his register. Be specific, be prepared, do not wing it. Precision will build more credibility with him than personality.",
      },
      {
        label: "Open Questions",
        text: "Here is what I do not know and what you should try to find out on the call: what tools they currently use for risk analysis; whether they have worked with a technology partner before; who else will be in the room; and what triggered this conversation, did they come to us or did we reach out? That last one matters most. If they came to us, Andy already has a problem in mind. If we reached out, you need to surface the problem before you can solve it.",
      },
    ],
  },
  {
    id: "avantgarde",
    company: "Avant Garde Solutions Ltd",
    person: "Sarah Chen",
    role: "VP of Operations",
    type: "predc",
    readiness: "in-progress",
    summary:
      "Mid-size logistics and operations consultancy scaling fast. Three hundred employees, $40M revenue. Growing faster than their internal processes can handle. That tension is exactly where we play.",
    website: "avantgarde-solutions.net",
    datetime: "Today · 9:00 PM",
    remaining: "4m",
    section: "today",
    turns: [
      {
        label: "The Verdict",
        text: "Sarah Chen, VP of Operations at Avant Garde Solutions Ltd. Mid-size logistics and operations consultancy, scaling fast, operationally stretched. She is pragmatic and detail-oriented. She will need to see a direct line from what we do to how her team operates better. Lead with outcomes, not capabilities. This is a strong fit call. Do not undersell it.",
      },
      {
        label: "The Company Read",
        text: "Avant Garde serves enterprise clients across logistics, retail, and manufacturing. They are growing faster than their internal processes can handle, that tension is exactly where we play. Three hundred employees, revenue in the $40M range. Decision-making is distributed; Sarah has influence but she is not the only sign-off. Expect a second conversation with her CTO.",
      },
      {
        label: "The Relevance Bridge",
        text: "We built a document processing pipeline for an insurance advisory firm that cut their due diligence report time from three days to four hours. Position this not as a technology project but as an operational capacity gain, Avant Garde's language is throughput and headcount efficiency, not infrastructure. Ask her what the highest-volume manual process in her team is. That is your entry point.",
      },
      {
        label: "The Approach",
        text: "Open with the operational pressure framing, acknowledge that fast-growing operations teams are solving problems that did not exist six months ago. Let her confirm or redirect. Do not pitch until she has described her world. In the middle, bring in the proof point. Close by proposing a structured next step: a 30-minute technical scoping call with her and the CTO. Make it easy for her to say yes.",
      },
      {
        label: "Hooks",
        text: "Sarah has been at Avant Garde for three years and moved from a senior analyst role to VP in eighteen months. That is an unusually fast track, she is driven and results-oriented. She will respect efficiency in the conversation itself. Do not over-explain. She is also active on LinkedIn around operational excellence, reference that framing if it comes up.",
      },
      {
        label: "Open Questions",
        text: "I do not yet know: who the CTO is and how technical they are; what tools they are currently using for process management; whether they have a defined budget for this type of work; and whether this came from a top-down initiative or Sarah identified the need independently. That last point shapes how much internal selling she will need to do after this call.",
      },
    ],
  },
  {
    id: "amherst",
    company: "Amherst",
    person: "Sidra Masood",
    role: "Director",
    type: "predc",
    readiness: "gap-flagged",
    summary:
      "Real estate investment and advisory, 400 employees. Navigating a challenging market cycle. Conservative buyers, ROI-driven decisions. Gap: who else is on this call is unknown.",
    website: "amherst.com",
    datetime: "Tomorrow · 11:00 AM",
    remaining: "14h 4m",
    section: "tomorrow",
    turns: [
      {
        label: "The Verdict",
        text: "Sidra Masood, Director at Amherst. Real estate investment and advisory firm, institutional clients, long decision cycles. She is analytical and process-driven. Credibility here comes from preparation and precision, not warmth. I have a gap: I do not yet know who else will be on this call. Answer this before you open or you risk pitching at the wrong level.",
      },
      {
        label: "The Company Read",
        text: "Amherst operates across real estate investment, property technology, and advisory services. Roughly 400 employees. They are navigating a challenging market cycle, their clients are under pressure and that pressure flows down to the advisory layer. Technology investment here tends to be conservative and ROI-driven. The buying cycle will be long. This call is about qualification as much as anything else.",
      },
      {
        label: "The Relevance Bridge",
        text: "Our most transferable proof point is the data aggregation and reporting work we did for a property advisory firm, reduced manual reporting time by 60% and gave their analysts 90 minutes a day back. Sidra's world runs on analysis and reporting. Ask her what the most time-consuming reporting process her team runs is. If she pauses, you have your entry point.",
      },
      {
        label: "The Approach",
        text: "Open formally. Sidra will expect structure. Introduce the call with an agenda, even a simple one, it signals that you have prepared. In the middle, use precise questions rather than open-ended ones. She will be more comfortable with specifics. Avoid vague language like 'solutions' and 'partnerships.' Close by summarising what you heard and proposing a concrete next step with a timeline.",
      },
      {
        label: "Hooks",
        text: "Sidra has a finance background, she moved into real estate from investment banking. That means she thinks in terms of ROI, payback periods, and risk. Frame every capability in those terms if you can. She is measured and deliberate in how she speaks. Match that register. Do not rush the conversation.",
      },
      {
        label: "Open Questions",
        text: "The critical gap: who else is attending this call. I need you to find that out in the first two minutes, ask Sidra directly. The other gaps: what prompted this conversation, what their current technology stack looks like, and whether they have an active budget or this is exploratory. The last point determines how hard to push on next steps.",
      },
    ],
  },
];

const QA_BANK = [
  {
    keywords: ["avoid", "not say", "should not", "shouldnt", "warn"],
    response:
      "The single thing not to say is anything that positions Tkxel as a vendor. The moment you reference deliverables, timelines, or pricing unprompted, you break the frame. Keep the conversation in their world, their problems, their constraints, until they ask you to shift it.",
  },
  {
    keywords: ["proof point", "project", "built", "case study", "reference", "done"],
    response:
      "The strongest proof point is the document processing pipeline we built for an insurance advisory firm, three-day due diligence reports down to four hours. Use it as a question, not a story: 'What is the part of your process that costs you the most time?' Let them describe it. Then mirror it back.",
  },
  {
    keywords: ["competitor", "competition", "alternative"],
    response:
      "Do not deflect and do not trash competitors. Acknowledge briefly, then pivot: 'Most tools give you data. What we do is build the infrastructure that makes your team faster at using that data.' Then return to their problem.",
  },
  {
    keywords: ["question", "discovery", "ask", "find out"],
    response:
      "Four questions to prioritise: (1) What does your current process look like end-to-end? (2) Where does the most time get lost? (3) Have you worked with a technology partner before? (4) What triggered this conversation, inbound or outreach? That last one tells you where they are in the buying process.",
  },
  {
    keywords: ["close", "next step", "end", "follow up", "wrap"],
    response:
      "Close directly. Give them a binary choice: 'The logical next step is a 45-minute technical scoping call. Does Thursday or Friday work?' Make it easy to say yes. Do not ask open-ended questions at the close.",
  },
];

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

const READINESS_CONFIG: Record<
  Readiness,
  { dot: string; label: string; text: string; pill: string }
> = {
  complete:      { dot: "bg-emerald-500", label: "text-emerald-600", text: "Prep complete", pill: "bg-emerald-50 border border-emerald-200 text-emerald-700" },
  "in-progress": { dot: "bg-blue-400 animate-pulse", label: "text-blue-600", text: "Enriching…",   pill: "bg-blue-50 border border-blue-200 text-blue-700"       },
  "gap-flagged": { dot: "bg-amber-500", label: "text-amber-600", text: "Gap flagged",   pill: "bg-amber-50 border border-amber-200 text-amber-700"   },
  "not-started": { dot: "bg-red-500",   label: "text-red-600",   text: "Not started",   pill: "bg-red-50 border border-red-200 text-red-700"         },
};

// ── Root Page ─────────────────────────────────────────────────────────────────
export default function AllCallsPage() {
  const [filter, setFilter] = useState<"all" | "today" | "tomorrow">("all");
  const [search, setSearch] = useState("");
  const [readinessFilter, setReadinessFilter] = useState<string>("all");
  const [drawerCall, setDrawerCall] = useState<CallCard | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);

  const openDrawer = useCallback((call: CallCard) => {
    setDrawerCall(call);
    setDrawerMounted(true);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setDrawerOpen(true))
    );
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => {
      setDrawerMounted(false);
      setDrawerCall(null);
    }, 320);
  }, []);

  const filtered = CALLS.filter((c) => {
    if (filter !== "all" && c.section !== filter) return false;
    if (readinessFilter !== "all" && c.readiness !== readinessFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (
        !c.person.toLowerCase().includes(q) &&
        !c.company.toLowerCase().includes(q) &&
        !c.role.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

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
        <header className="flex flex-shrink-0 items-center justify-between border-b border-slate-200/60 bg-white/80 px-5 py-2.5 backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-slate-800">
              <div className="h-1 w-1 rounded-full bg-slate-800" />
            </div>
            <span className="text-[14px] font-semibold tracking-tight text-slate-800">
              Insphere
            </span>
          </div>
        </header>

        {/* Breadcrumbs + page header */}
        <div className="flex flex-shrink-0 flex-col border-b border-slate-200/60 bg-white/60 px-6 py-4">
          {/* Breadcrumb trail */}
          <nav className="mb-3 flex items-center gap-1.5 text-[12px] text-slate-400">
            <a href="/call-prep" className="transition-colors hover:text-slate-600">
              Dashboard
            </a>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-slate-700">All Calls</span>
          </nav>

          {/* Page title */}
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-[20px] font-bold tracking-tight text-[#1e2a6e]">
                All Calls
              </h1>
              <p className="mt-0.5 text-[13px] text-slate-500">
                {filtered.length} of {CALLS.length} calls
              </p>
            </div>
          </div>

          {/* Search + filters row */}
          <div className="mt-4 flex items-center gap-3">
            {/* Search, pill shape */}
            <div className="flex w-72 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <Search className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, company, or role…"
                className="flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-400"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* When dropdown */}
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as "all" | "today" | "tomorrow")}
                className="appearance-none cursor-pointer rounded-full border border-slate-200 bg-white py-2.5 pl-4 pr-9 text-[13px] font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Readiness dropdown */}
            <div className="relative">
              <select
                value={readinessFilter}
                onChange={(e) => setReadinessFilter(e.target.value)}
                className="appearance-none cursor-pointer rounded-full border border-slate-200 bg-white py-2.5 pl-4 pr-9 text-[13px] font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All status</option>
                <option value="complete">Prep ready</option>
                <option value="gap-flagged">Action needed</option>
                <option value="in-progress">Enriching</option>
                <option value="not-started">Not started</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Calls table */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Table head */}
            <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_120px] gap-4 border-b border-slate-100 px-5 py-2.5">
              {["Contact", "Company", "Date", "Time remaining", ""].map((h) => (
                <span
                  key={h}
                  className="text-[10.5px] font-semibold uppercase tracking-widest text-slate-400"
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {filtered.map((call, i) => {
              const r = READINESS_CONFIG[call.readiness];
              const isActive = drawerCall?.id === call.id;
              return (
                <div
                  key={call.id}
                  className={cn(
                    "grid grid-cols-[2fr_1.5fr_1fr_1fr_120px] items-center gap-4 px-5 py-4 transition-colors",
                    i < filtered.length - 1 && "border-b border-slate-100",
                    isActive ? "bg-blue-50/60" : "hover:bg-slate-50/60"
                  )}
                >
                  {/* Contact */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-[12px] font-semibold text-slate-700">
                      {call.person.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-semibold text-slate-900">
                        {call.person}
                      </p>
                      <p className="text-[12px] text-slate-400">{call.role}</p>
                    </div>
                  </div>

                  {/* Company */}
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-slate-700">
                      {call.company}
                    </p>
                    <span className="flex items-center gap-1 text-[11px] text-blue-500">
                      <Globe className="h-2.5 w-2.5" />
                      {call.website}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-[12.5px] text-slate-700">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    {call.datetime}
                  </div>

                  {/* Time remaining */}
                  <div className="flex items-center gap-2">
                    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-medium", r.pill)}>
                      <span className={cn("h-1.5 w-1.5 flex-shrink-0 rounded-full", r.dot)} />
                      {call.remaining} remaining
                    </span>
                  </div>

                  {/* Action */}
                  <div className="flex justify-end">
                    <Link
                      href={`/call-prep/${call.id}`}
                      className="flex items-center gap-1 text-[13px] font-medium text-blue-600 transition-colors hover:text-blue-800"
                    >
                      View prep →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overlay dim */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-slate-900/10 transition-opacity duration-300",
            drawerOpen ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Briefing drawer */}
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-1/2 flex-col",
            "overflow-hidden rounded-r-lg border-l border-slate-200 bg-white shadow-2xl",
            "transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
            drawerOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {drawerMounted && drawerCall && (
            <BriefingDrawer
              key={drawerCall.id}
              call={drawerCall}
              onClose={closeDrawer}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// ── Briefing drawer ───────────────────────────────────────────────────────────
type TurnState = { text: string; typing: boolean; visible: boolean };
type ChatMsg = { role: "user" | "agent"; text: string; id: number };

function BriefingDrawer({
  call,
  onClose,
}: {
  call: CallCard;
  onClose: () => void;
}) {
  const [turns, setTurns] = useState<TurnState[]>([]);
  const [currentTurn, setCurrentTurn] = useState(-1);
  const [actionTurn, setActionTurn] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [inputLocked, setInputLocked] = useState(true);
  const [inputHint, setInputHint] = useState("Briefing in progress");
  const [midBriefingPause, setMidBriefingPause] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const msgIdRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (chatRef.current)
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
    });
  }, []);

  const deliverTurn = useCallback(
    (index: number) => {
      if (index >= call.turns.length) return;
      const words = call.turns[index].text.split(" ");
      let wi = 0;

      setCurrentTurn(index);
      setTurns((prev) => {
        const next = [...prev];
        next[index] = { text: "", typing: true, visible: false };
        return next;
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTurns((prev) => {
            const next = [...prev];
            if (next[index]) next[index] = { ...next[index], visible: true };
            return next;
          });
        });
      });

      intervalRef.current = setInterval(() => {
        wi++;
        const partial = words.slice(0, wi).join(" ");
        setTurns((prev) => {
          const next = [...prev];
          next[index] = { text: partial, typing: wi < words.length, visible: true };
          return next;
        });
        scrollToBottom();

        if (wi >= words.length) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setActionTurn(index);
          if (index === call.turns.length - 1) {
            setComplete(true);
            setInputLocked(false);
            setInputHint("");
          }
          scrollToBottom();
        }
      }, 22);
    },
    [call.turns, scrollToBottom]
  );

  useEffect(() => {
    const t = setTimeout(() => deliverTurn(0), 500);
    return () => {
      clearTimeout(t);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleKeepGoing = (index: number) => {
    setActionTurn(null);
    setTimeout(() => deliverTurn(index + 1), 250);
  };

  const handleAskQuestion = () => {
    setMidBriefingPause(true);
    setInputLocked(false);
    setInputHint("Ask a question, briefing continues after");
    setTimeout(() => {
      (document.querySelector("#briefing-input-all") as HTMLInputElement | null)?.focus();
    }, 50);
  };

  const handleContinueBriefing = () => {
    setMidBriefingPause(false);
    setInputLocked(true);
    setInputHint("Briefing in progress");
    setTimeout(() => deliverTurn(currentTurn + 1), 300);
  };

  const sendMessage = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;
    setInputValue("");

    const id = ++msgIdRef.current;
    setMessages((prev) => [...prev, { role: "user", text, id }]);
    scrollToBottom();

    if (!complete) {
      setMidBriefingPause(false);
      setInputLocked(true);
      setInputHint("Briefing in progress");
    }

    setTimeout(() => {
      const lc = text.toLowerCase();
      const match = QA_BANK.find((q) => q.keywords.some((k) => lc.includes(k)));
      const response =
        match?.response ??
        `Based on what I know about ${call.person} and ${call.company}, the most important thing is to stay in discovery mode. Let ${call.person} describe the situation in their own terms before you draw conclusions.`;

      const rid = ++msgIdRef.current;
      setMessages((prev) => [...prev, { role: "agent", text: response, id: rid }]);
      scrollToBottom();

      if (!complete) setTimeout(() => setMidBriefingPause(true), 300);
    }, 500);
  }, [inputValue, complete, call.person, call.company, scrollToBottom]);

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 bg-white/90 px-4 py-3 backdrop-blur-sm">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <button
            onClick={onClose}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <span className="text-[13.5px] font-semibold text-slate-900">
              {call.person}
            </span>
            <span className="text-[13px] text-slate-400"> · {call.company}</span>
          </div>
          <span className="flex-shrink-0 text-[11.5px] text-slate-400">
            {call.datetime}
          </span>
        </div>
      </header>

      {/* Progress strip */}
      <div className="flex flex-shrink-0 items-center justify-center gap-0 border-b border-slate-100 bg-white/70 px-4 py-2.5">
        {call.turns.map((turn, i) => (
          <div key={i} className="flex items-center">
            {i > 0 && (
              <div
                className={cn(
                  "h-px w-5 transition-colors duration-500",
                  i <= currentTurn ? "bg-emerald-400" : "bg-slate-200"
                )}
              />
            )}
            <div className="group relative flex items-center">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold",
                  "border-[1.5px] transition-all duration-300",
                  i < currentTurn
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : i === currentTurn
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-400"
                )}
              >
                {i < currentTurn ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              <div className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-[10.5px] text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
                {turn.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat */}
      <div ref={chatRef} className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
        {turns.map((t, i) => (
          <AgentTurn
            key={i}
            index={i}
            label={call.turns[i].label}
            text={t.text}
            typing={t.typing}
            visible={t.visible}
            isLast={i === call.turns.length - 1}
            actionVisible={actionTurn === i}
            complete={complete}
            onKeepGoing={() => handleKeepGoing(i)}
            onAskQuestion={handleAskQuestion}
          />
        ))}

        {midBriefingPause && (
          <div className="flex animate-[fadeUp_0.25s_ease_both] gap-2">
            <button
              onClick={handleContinueBriefing}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-[12.5px] font-medium text-white shadow-sm transition-opacity hover:opacity-90"
            >
              Continue briefing
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {messages.map((msg) =>
          msg.role === "user" ? (
            <div key={msg.id} className="flex justify-end animate-[fadeUp_0.25s_ease_both]">
              <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-2.5 text-[13px] leading-relaxed text-white shadow-sm">
                {msg.text}
              </div>
            </div>
          ) : (
            <AgentReply key={msg.id} text={msg.text} />
          )
        )}
      </div>

      {/* Input */}
      <div
        className={cn(
          "flex-shrink-0 border-t border-slate-100 bg-white/80 p-3 backdrop-blur-sm",
          "transition-opacity duration-200",
          inputLocked && "opacity-60"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 rounded-full border px-4 py-2",
            "bg-gradient-to-b from-white to-slate-50/80 shadow-sm",
            "transition-all duration-150",
            !inputLocked && "border-blue-200 shadow-blue-50"
          )}
        >
          <input
            id="briefing-input-all"
            disabled={inputLocked}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask anything about this call…"
            className="flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
          />
          {inputHint && (
            <span className="flex-shrink-0 text-[11px] text-slate-400">
              {inputHint}
            </span>
          )}
          <button
            disabled={inputLocked || !inputValue.trim()}
            onClick={sendMessage}
            className={cn(
              "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full",
              "bg-slate-900 text-white shadow-sm transition-all duration-150",
              "disabled:cursor-not-allowed disabled:opacity-40",
              "enabled:hover:bg-blue-600 enabled:active:scale-95"
            )}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Agent turn ────────────────────────────────────────────────────────────────
function AgentTurn({
  index,
  label,
  text,
  typing,
  visible,
  isLast,
  actionVisible,
  complete,
  onKeepGoing,
  onAskQuestion,
}: {
  index: number;
  label: string;
  text: string;
  typing: boolean;
  visible: boolean;
  isLast: boolean;
  actionVisible: boolean;
  complete: boolean;
  onKeepGoing: () => void;
  onAskQuestion: () => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-600">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>
        <div>
          <span className="text-[12.5px] font-semibold text-slate-800">
            Insphere Agent
          </span>
          <span className="ml-2 text-[10.5px] font-semibold uppercase tracking-widest text-slate-400">
            Turn {index + 1}, {label}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "relative rounded-xl border border-slate-100 bg-white px-4 py-3.5 text-[13px] leading-relaxed text-slate-700 shadow-sm",
          typing &&
            "after:ml-0.5 after:inline-block after:animate-[blink_0.9s_steps(2)_infinite] after:text-blue-500 after:content-['▋']"
        )}
      >
        {text}
      </div>

      {actionVisible && (
        <div
          className={cn(
            "flex gap-2 transition-all duration-300",
            actionVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
          )}
        >
          {isLast && complete ? (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-[12.5px] font-medium text-white shadow-sm">
              <Check className="h-3.5 w-3.5" />
              Briefing complete, ask me anything.
            </div>
          ) : (
            <>
              <button
                onClick={onKeepGoing}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-[12.5px] font-medium text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.97]"
              >
                Keep going
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={onAskQuestion}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.97]"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Ask a question
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Agent reply ───────────────────────────────────────────────────────────────
function AgentReply({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col gap-2 transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-600">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="text-[12.5px] font-semibold text-slate-800">
          Insphere Agent
        </span>
      </div>
      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3.5 text-[13px] leading-relaxed text-slate-700 shadow-sm">
        {text}
      </div>
    </div>
  );
}
