"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import type { LayoutItem } from "react-grid-layout";
type GridLayouts = { [breakpoint: string]: LayoutItem[] };
import { cn } from "@/lib/utils";
import { CALLS, QA_BANK, type CallData } from "@/lib/call-data";
import type { InternalMatch } from "@/lib/call-data";
import { getDoneCalls, markCallDone, unmarkCallDone } from "@/lib/done-calls";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  BarChart2,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  Cpu,
  Download,
  Flag,
  GraduationCap,
  GripVertical,
  Hash,
  Layers,
  Lightbulb,
  Linkedin,
  Mail,
  MapPin,
  Maximize2,
  MessageCircle,
  MessageSquare,
  Monitor,
  Newspaper,
  Phone,
  PlusCircle,
  Search,
  Send,
  Share2,
  Sparkles,
  Star,
  TrendingUp,
  UserPlus,
  Users,
  X,
} from "lucide-react";

// Import Responsive directly — we'll supply `width` ourselves via ResizeObserver
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ResponsiveGrid = dynamic<any>(
  () => import("react-grid-layout").then((m) => m.Responsive),
  { ssr: false },
);

// ── Panel IDs ─────────────────────────────────────────────────────────────────
const BASE_PANELS = [
  "stakeholders",
  "opportunity",
  "recap",
  "news",
  "work",
  "tech",
] as const;

type BasePanelId = (typeof BASE_PANELS)[number];

// ── Default layouts per breakpoint ────────────────────────────────────────────
// Matches the Salesforce Canvas reference screenshot exactly:
//   Row 1 (25% · 50% · 25%): Stakeholders | Opportunity Analysis | Meeting Notes
//   Row 2 (50% · 50%):        Conversation Recap | Related News
//   Row 3 (100%):             Related Work
//
// rowHeight=34, margin=16 → 1 grid unit = 50px
//   h=8  → 384px  (row 1 — taller to fit stakeholders + opportunity depth)
//   h=7  → 334px  (row 2 — recap + news)
//   h=10 → 484px  (row 3 — related work, 2 side-by-side cards)
//
// Row groups used by auto-height normaliser so all panels in a row stay equal:
//   ROW_GROUPS[0] = ["stakeholders","opportunity","meeting"]
//   ROW_GROUPS[1] = ["recap","news"]
//   ROW_GROUPS[2] = ["work"]
const DEFAULT_LAYOUTS: GridLayouts = {
  lg: [
    { i: "stakeholders", x: 0, y:  0, w: 1, h: 8,  minH: 4, minW: 1 },
    { i: "opportunity",  x: 1, y:  0, w: 3, h: 8,  minH: 4, minW: 1 },
    { i: "recap",        x: 0, y:  8, w: 2, h: 7,  minH: 3, minW: 1 },
    { i: "news",         x: 2, y:  8, w: 2, h: 7,  minH: 3, minW: 1 },
    { i: "tech",         x: 0, y: 15, w: 2, h: 10, minH: 6, minW: 1 },
    { i: "work",         x: 2, y: 15, w: 2, h: 10, minH: 6, minW: 1 },
  ],
  md: [
    { i: "stakeholders", x: 0, y:  0, w: 1, h: 8 },
    { i: "opportunity",  x: 1, y:  0, w: 1, h: 8 },
    { i: "recap",        x: 0, y:  8, w: 1, h: 7 },
    { i: "news",         x: 1, y:  8, w: 1, h: 7 },
    { i: "tech",         x: 0, y: 15, w: 1, h: 10 },
    { i: "work",         x: 1, y: 15, w: 1, h: 10 },
  ],
  sm: [
    { i: "stakeholders", x: 0, y:  0, w: 1, h: 8 },
    { i: "opportunity",  x: 0, y:  8, w: 1, h: 8 },
    { i: "recap",        x: 0, y: 16, w: 1, h: 7 },
    { i: "news",         x: 0, y: 23, w: 1, h: 7 },
    { i: "tech",         x: 0, y: 30, w: 1, h: 10 },
    { i: "work",         x: 0, y: 40, w: 1, h: 10 },
  ],
};

// Panels that share the same grid row — auto-height normalises to max(h) in row
const ROW_GROUPS: string[][] = [
  ["stakeholders", "opportunity"],
  ["recap", "news"],
  ["tech", "work"],
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getLayoutKey(callId: string) {
  // v5 — bumped: 4-col grid, 1:2:1 / 2:2 layout matching reference
  return `insphere-layout-v12-${callId}`;
}

function loadLayouts(callId: string): GridLayouts {
  if (typeof window === "undefined") return DEFAULT_LAYOUTS;
  try {
    const raw = localStorage.getItem(getLayoutKey(callId));
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_LAYOUTS;
}

function saveLayouts(callId: string, layouts: GridLayouts) {
  try {
    localStorage.setItem(getLayoutKey(callId), JSON.stringify(layouts));
  } catch {}
}

const READINESS_LABEL: Record<string, string> = {
  complete: "Good",
  "in-progress": "Active",
  "gap-flagged": "Review",
  "not-started": "At Risk",
};

// ── Agent response type ───────────────────────────────────────────────────────
interface AgentSection {
  label?: string;
  items: string[];
  type?: "bullets" | "prose" | "stats";
}
interface AgentCard {
  id: string;
  question: string;
  timestamp: string;
  thinking: boolean;
  // Structured response (preferred over plain answer)
  title?: string;
  icon?: string;      // emoji accent for the card header
  sections?: AgentSection[];
  answer?: string;    // fallback prose
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CallPrepDetailPage() {
  const params = useParams();
  const callId = params.callId as string;
  const call = CALLS.find((c) => c.id === callId) ?? CALLS[0];

  const [layouts, setLayouts] = useState<GridLayouts>(() => loadLayouts(callId));
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [agentCards, setAgentCards] = useState<AgentCard[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [sendEmail, setSendEmail] = useState("");
  const [sendMsg, setSendMsg] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [gridWidth, setGridWidth] = useState(0);
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [preparedModalOpen, setPreparedModalOpen] = useState(false);
  const [notifyStep, setNotifyStep] = useState(-1);

  const gridRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const msgId = useRef(0);

  // ── Auto-height: measure each panel's natural content height once on mount ──
  // rowHeight=34, margin=16 → one grid unit = 50px
  // panel total px = contentPx + 47 (header) + 24 (body padding top+bottom)
  // h = ceil((panel total + 16 margin) / 50)
  const hasMeasured = useRef<Set<string>>(new Set());
  const pendingHeights = useRef<Record<string, number>>({});
  const heightBatchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNaturalHeight = useCallback((id: string, contentPx: number) => {
    if (hasMeasured.current.has(id)) return;
    // Guard: ignore measurements that fired before content painted (height = 0)
    if (contentPx < 20) return;
    hasMeasured.current.add(id);
    const totalPx = contentPx + 47 + 24; // header + body padding
    const measuredH = Math.max(3, Math.ceil((totalPx + 16) / 50));
    // Never shrink below the DEFAULT_LAYOUTS h for this panel
    const defaultH = DEFAULT_LAYOUTS.lg.find((item: LayoutItem) => item.i === id)?.h ?? 3;
    pendingHeights.current[id] = Math.max(measuredH, defaultH);
    if (heightBatchTimer.current) clearTimeout(heightBatchTimer.current);
    heightBatchTimer.current = setTimeout(() => {
      const pending = { ...pendingHeights.current };
      // Normalise: all panels in the same row share the tallest h
      const normalised = { ...pending };
      ROW_GROUPS.forEach((group) => {
        const measured = group.filter((p) => normalised[p] !== undefined);
        if (measured.length === 0) return;
        const maxH = Math.max(...measured.map((p) => normalised[p]));
        measured.forEach((p) => { normalised[p] = maxH; });
      });
      setLayouts((prev: GridLayouts) => {
        const lg = (prev.lg ?? DEFAULT_LAYOUTS.lg).map((item: LayoutItem) =>
          normalised[item.i] !== undefined ? { ...item, h: normalised[item.i] } : item
        );
        const updated = { ...prev, lg };
        saveLayouts(callId, updated);
        return updated;
      });
    }, 80);
  }, [callId]);

  // Measure grid container so we can pass `width` directly to <Responsive>
  useEffect(() => {
    const el = gridContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setGridWidth(entry.contentRect.width));
    ro.observe(el);
    setGridWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setLayouts(loadLayouts(callId));
    setCollapsed(new Set());
    setAgentCards([]);
    hasMeasured.current = new Set();
    pendingHeights.current = {};
    setIsDone(getDoneCalls().includes(callId));
  }, [callId]);

  const handleLayoutChange = useCallback((_: LayoutItem[], all: GridLayouts) => {
    setLayouts(all);
    saveLayouts(callId, all);
  }, [callId]);

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => { setShareOpen(false); showToast("Link copied to clipboard"); });
  };
  const exportPDF = () => { setShareOpen(false); window.print(); };
  const sendToTeammate = () => { setSendModalOpen(false); setSendEmail(""); setSendMsg(""); showToast(`Prep sent to ${sendEmail}`); };

  // ── Intent → card title + prose answer ──────────────────────────────────────
  const resolveAgentCard = useCallback((text: string): Pick<AgentCard, "title" | "icon" | "answer"> => {
    const lc = text.toLowerCase();

    if (/industry|sector|market|vertical/.test(lc)) {
      return {
        title: "Industry Overview",
        icon: "industry",
        answer: `${call.company} operates in the ${call.companyDetails.industry} space — a sector where boutique specialists win on depth of domain knowledge rather than platform breadth. With ${call.companyDetails.employees} employees and ${call.companyDetails.revenue} in revenue, the team is deliberately lean. They are not buying scale — they are buying precision tools that make a small team look bigger and smarter.\n\nIn this vertical, trust is currency. Buyers like ${call.person} have seen dozens of vendors and will immediately discount anyone who leads with a pitch. The entry point is always the problem, not the solution.\n\nThe key dynamic to understand: firms like ${call.company} are squeezed between growing client demand and headcount constraints. The opportunity is automation that removes manual overhead without disrupting the expert judgment at the core of their value proposition.`,
      };
    }
    if (/stakeholder|who|contact|person|people/.test(lc)) {
      return {
        title: "Stakeholder Briefing",
        icon: "stakeholders",
        answer: call.stakeholders.map(s =>
          `${s.name} (${s.role}) — the primary contact on this call. ${call.turns.find(t => /verdict/i.test(t.label))?.text ?? ""}`
        ).join("\n\n"),
      };
    }
    if (/approach|strategy|open|start|how to|frame|pitch/.test(lc)) {
      const turn = call.turns.find(t => /approach/i.test(t.label)) ?? call.turns[call.turns.length - 1];
      return {
        title: "Recommended Approach",
        icon: "approach",
        answer: turn?.text ?? `Open without pitching. ${call.person} will lose respect the moment you start selling. Lead with questions, let them talk, and close directly by asking for a clear next step.`,
      };
    }
    if (/hook|angle|opener|icebreak|conversation/.test(lc)) {
      return {
        title: "Conversation Openers",
        icon: "news",
        answer: call.relatedNews.items.map((item, i) => `${i + 1}. ${item.headline}`).join("\n\n"),
      };
    }
    if (/roadblock|challenge|risk|blocker|problem|pain/.test(lc)) {
      return {
        title: "Risks & Blockers",
        icon: "risk",
        answer: `The current roadblock is: ${call.opportunityAnalysis.roadblock}\n\nWhat to watch for on this call: budget ownership may be unclear — qualify this early. Technical stakeholders may not be present. Any incumbent vendor relationship could slow the decision significantly. Don't push for a close until these are surfaced.`,
      };
    }
    if (/meeting|agenda|goal|objective|topic|discuss/.test(lc)) {
      return {
        title: "Meeting Agenda",
        icon: "meeting",
        answer: `Goals for this call:\n${call.meetingNotes.goals.map((g, i) => `${i + 1}. ${g}`).join("\n")}\n\nTopics to cover:\n${call.meetingNotes.discussionTopics.map((t, i) => `${i + 1}. ${t}`).join("\n")}`,
      };
    }
    if (/news|linkedin|post|recent|article/.test(lc)) {
      return {
        title: "Recent Intelligence",
        icon: "news",
        answer: call.relatedNews.items.map((item, i) => `${i + 1}. ${item.headline}`).join("\n\n"),
      };
    }
    if (/upsell|expand|grow|next|opportunity/.test(lc)) {
      return {
        title: "Growth & Upsell Path",
        icon: "opportunity",
        answer: `Next milestone: ${call.opportunityAnalysis.nextMilestone}\n\nUpsell potential: ${call.opportunityAnalysis.upsell}`,
      };
    }
    const match = QA_BANK.find((q) => q.keywords.some((k) => lc.includes(k)));
    return {
      title: "Insphere Insight",
      icon: "agent",
      answer: match?.response ?? `Based on what I know about ${call.person} and ${call.company}, stay in discovery mode. Let ${call.person} describe the situation in their own terms before you draw conclusions.`,
    };
  }, [call]);

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;
    setInputValue("");

    const id = `agent-${++msgId.current}`;
    const now = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const newCard: AgentCard = { id, question: text, timestamp: now, thinking: true };

    setAgentCards((prev) => [...prev, newCard]);

    setLayouts((prev: GridLayouts) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((bp) => {
        const existing: LayoutItem[] = updated[bp] ?? [];
        const maxY = existing.reduce((m: number, l: LayoutItem) => Math.max(m, l.y + l.h), 0);
        const fullW = bp === "lg" ? 4 : bp === "md" ? 2 : 1;
        updated[bp] = [...existing, { i: id, x: 0, y: maxY, w: fullW, h: 8, minH: 5, minW: 1 }];
      });
      return updated;
    });

    requestAnimationFrame(() => {
      gridRef.current?.scrollTo({ top: gridRef.current.scrollHeight, behavior: "smooth" });
    });

    // Simulate agent thinking (1.2s) then resolve structured content
    setTimeout(() => {
      const resolved = resolveAgentCard(text);
      setAgentCards((prev) => prev.map((c) => c.id === id ? { ...c, thinking: false, ...resolved } : c));
      requestAnimationFrame(() => {
        gridRef.current?.scrollTo({ top: gridRef.current.scrollHeight, behavior: "smooth" });
      });
    }, 1200);
  }, [inputValue, resolveAgentCard]);

  // All item IDs for the grid
  const allItems: { id: string; isAgent: boolean }[] = [
    ...BASE_PANELS.map((id) => ({ id, isAgent: false })),
    ...agentCards.map((c) => ({ id: c.id, isAgent: true })),
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <Sidebar />

      <main className="relative flex flex-1 flex-col overflow-hidden bg-[#f4f6fb] sm:m-2 sm:ml-0 sm:rounded-lg sm:shadow-sm print:m-0 print:rounded-none print:border-none">

        {/* ── Minimal top bar ── */}
        <div className="flex flex-shrink-0 items-center justify-between bg-white px-3 py-2 sm:px-4 sm:py-2.5 print:hidden">
          <nav className="flex items-center gap-1.5 text-[12px] text-slate-400">
            <Link href="/call-prep" className="transition-colors hover:text-slate-600">Dashboard</Link>
            <ArrowLeft className="h-3 w-3 rotate-180" />
            <Link href="/call-prep/all" className="transition-colors hover:text-slate-600">All Calls</Link>
            <ArrowLeft className="h-3 w-3 rotate-180" />
            <span className="font-medium text-slate-700">{call.person}</span>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPreparedModalOpen(true);
                setNotifyStep(0);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-[#1e2a6e]/20 bg-[#1e2a6e]/5 px-3 py-1.5 text-[12.5px] font-medium text-[#1e2a6e] shadow-sm transition-all hover:bg-[#1e2a6e]/10 active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Mark as prepared
            </button>
            <button
              onClick={() => {
                if (isDone) {
                  unmarkCallDone(callId);
                  setIsDone(false);
                } else {
                  markCallDone(callId);
                  setIsDone(true);
                }
              }}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12.5px] font-medium shadow-sm transition-all active:scale-95",
                isDone
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              )}
            >
              <CheckCircle2 className={cn("h-3.5 w-3.5", isDone ? "text-emerald-500" : "text-slate-400")} />
              {isDone ? "Done" : "Mark as done"}
            </button>
            <button
              onClick={() => setShareOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
          </div>
        </div>

        {shareOpen && (
          <ShareMenu
            onClose={() => setShareOpen(false)}
            onCopy={copyLink}
            onPDF={exportPDF}
            onSend={() => { setShareOpen(false); setSendModalOpen(true); }}
          />
        )}

        {/* ── Hero section ── */}
        <div className="flex flex-shrink-0 flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-8 sm:px-6 sm:py-3.5 print:bg-white">

          {/* Heading + chip + paragraph */}
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[18px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[20px]">
                {call.company}
              </h1>
              <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-500 shadow-sm">
                <Clock className="h-3 w-3 text-amber-500" />
                {call.datetime}
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-500 shadow-sm">
                Call rating: <span className="font-semibold text-slate-700">{call.rating * 2}/10</span>
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-slate-500">
              {call.description ?? call.opportunityAnalysis.recap}
            </p>
          </div>

          {/* Stats card — horizontal scroll strip on mobile, fixed card on desktop */}
          <div className="flex items-center divide-x divide-slate-100 overflow-x-auto rounded-2xl bg-white px-1 py-3 shadow-[0px_-2px_15px_0px_rgba(0,0,0,0.04)] sm:flex-shrink-0 sm:py-4">
            {[
              { icon: TrendingUp, label: "Revenue",   value: call.companyDetails.revenue },
              { icon: Building2,  label: "Industry",  value: call.companyDetails.industry },
              { icon: Users,      label: "Employees", value: call.companyDetails.employees },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-shrink-0 flex-col gap-1 px-4 sm:gap-1.5 sm:px-5">
                <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400 sm:text-[10.5px]">
                  <Icon className="h-3 w-3" />
                  {label}
                </div>
                <span className="text-[13px] font-bold text-slate-900 sm:text-[15px]">{value}</span>
              </div>
            ))}
            {call.companyDetails.website && (
              <div className="flex flex-shrink-0 flex-col gap-1 px-4 sm:gap-1.5 sm:px-5">
                <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400 sm:text-[10.5px]">
                  <ArrowUpRight className="h-3 w-3" />
                  Website
                </div>
                <a
                  href={call.companyDetails.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] font-bold text-blue-500 underline underline-offset-2 hover:text-blue-600 sm:text-[15px]"
                >
                  {call.companyDetails.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
          </div>

        </div>

        {/* ── Quick access strip ── */}

        {/* ── Bento grid ── */}
        <div ref={gridRef} className="flex-1 overflow-y-auto px-2 pb-28 pt-2 sm:px-4 sm:pb-24 sm:pt-3 md:px-5 print:overflow-visible">
          <div ref={gridContainerRef}>
          {gridWidth > 0 && (
          <ResponsiveGrid
            width={gridWidth}
            layouts={layouts}
            breakpoints={{ lg: 1024, md: 640, sm: 0 }}
            cols={{ lg: 4, md: 2, sm: 1 }}
            rowHeight={34}
            margin={[16, 16]}
            containerPadding={[0, 0]}
            onLayoutChange={handleLayoutChange}
            draggableHandle=".drag-handle"
            resizeHandles={["se", "e", "s"]}
            isDraggable
            isResizable
          >
            {allItems.map(({ id, isAgent }) => {
              const agentCard = isAgent ? agentCards.find((c) => c.id === id) : null;
              return (
                // h-full + overflow-hidden required for panels to fill their RGL cell
                <div key={id} className="h-full overflow-hidden">
                  {isAgent && agentCard ? (
                    <AgentResponseCard card={agentCard} />
                  ) : (
                    <PanelCard
                      id={id}
                      collapsed={collapsed.has(id)}
                      onToggle={() => toggleCollapse(id)}
                      call={call}
                      onNaturalHeight={handleNaturalHeight}
                      onExpand={setActiveDrawer}
                    />
                  )}
                </div>
              );
            })}
          </ResponsiveGrid>
          )}
          </div>
        </div>

        {/* ── Panel drawers ── */}
        {activeDrawer && (
          <PanelDrawer
            panelId={activeDrawer}
            call={call}
            onClose={() => setActiveDrawer(null)}
          />
        )}

        {/* ── Floating chat bar ── */}
        {/* Full-bleed gradient strip flush with bottom edge */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 flex flex-col justify-end px-3 pb-4 pt-16 sm:px-6 sm:pb-5 print:hidden"
          style={{ background: "linear-gradient(to top, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0.06) 50%, transparent 100%)" }}
          data-chat-bar
        >
          <div className="pointer-events-auto w-full max-w-2xl self-center">
            <div className="chat-bar-input flex items-center gap-2.5 rounded-full bg-white px-5 py-3">
              <Sparkles className="h-4 w-4 flex-shrink-0 text-[#2563eb]" />
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask Insphere Agent anything about this call…"
                className="flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button
                disabled={!inputValue.trim()}
                onClick={handleSend}
                className={cn(
                  "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full",
                  "bg-[#2563eb] text-white shadow-sm transition-all",
                  "disabled:cursor-not-allowed disabled:opacity-30",
                  "enabled:hover:opacity-90 enabled:active:scale-95"
                )}
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {sendModalOpen && (
        <SendModal
          email={sendEmail}
          message={sendMsg}
          callPerson={call.person}
          onEmailChange={setSendEmail}
          onMessageChange={setSendMsg}
          onSend={sendToTeammate}
          onClose={() => setSendModalOpen(false)}
        />
      )}

      {preparedModalOpen && (
        <PreparedModal
          call={call}
          notifyStep={notifyStep}
          setNotifyStep={setNotifyStep}
          onClose={() => { setPreparedModalOpen(false); setNotifyStep(-1); }}
        />
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
const SIDEBAR_TOP = [
  { icon: Monitor,      label: "AI Agents"        },
  { icon: Layers,       label: "Integration"      },
  { icon: Users,        label: "User Management"  },
  { icon: MessageSquare,label: "Prompt Playground"},
  { icon: BarChart2,    label: "Analytics"        },
];
const SALES_NAV = ["AE Co-pilot", "Call Preparation", "Discovery Call QA", "Lead Enrichment", "Pitch Deck"];

function Sidebar() {
  return (
    <aside className="hidden h-full w-[180px] flex-shrink-0 flex-col justify-between bg-white md:flex print:hidden">
      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-0.5 p-3 pb-2">
          <Link href="/call-prep" className="mb-2 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100">
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
          {SIDEBAR_TOP.map(({ icon: Icon, label }) => (
            <div key={label} className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-100">
              <Icon className="h-[17px] w-[17px] flex-shrink-0 text-slate-400" />
              {label}
            </div>
          ))}
        </div>
        <div className="mx-3 h-px bg-slate-100" />
        <div className="flex flex-col p-3 pt-2">
          <span className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Sales</span>
          {SALES_NAV.map((label) => {
            const active = label === "Call Preparation";
            return (
              <div key={label} className="relative flex items-center">
                {active && <div className="absolute -left-3 h-4 w-0.5 rounded-full bg-slate-900" />}
                <div className={cn("w-full cursor-pointer rounded-md px-2 py-1.5 text-[13px] font-medium text-slate-800 transition-colors", active ? "bg-slate-100" : "hover:bg-slate-50")}>
                  {label}
                </div>
              </div>
            );
          })}
          <span className="mt-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">HR</span>
          <div className="cursor-pointer rounded-md px-2 py-1.5 text-[13px] font-medium text-slate-800 transition-colors hover:bg-slate-50">People Buddy</div>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 p-2.5">
        <div className="mx-3 h-px bg-slate-100" />
        <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-slate-100">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-[12px] font-semibold text-white">S</div>
          <div className="flex flex-col items-start">
            <span className="text-[12px] font-medium text-slate-800">Saliha Shahzad</span>
            <span className="text-[10.5px] text-slate-400">saliha.shahzad@cam…</span>
          </div>
        </button>
      </div>
    </aside>
  );
}

// ── Panel config ──────────────────────────────────────────────────────────────
const PANEL_CONFIG: Record<string, { icon: React.ElementType; title: string; iconBg: string }> = {
  stakeholders: { icon: Users,          title: "Stakeholders",           iconBg: "bg-violet-500"  },
  opportunity:  { icon: BarChart2,      title: "Opportunity Analysis",   iconBg: "bg-rose-500"    },
  recap:        { icon: MessageCircle,  title: "Conversation Recap",     iconBg: "bg-emerald-500" },
  news:         { icon: Newspaper,      title: "Conversation Openers",   iconBg: "bg-sky-500"     },
  work:         { icon: BookOpen,       title: "Related Work",           iconBg: "bg-teal-500"    },
  tech:         { icon: Cpu,            title: "Tech Intelligence",      iconBg: "bg-indigo-500"  },
};

const EXPANDABLE_PANELS = new Set(["stakeholders", "opportunity", "recap", "work", "news"]);

function PanelCard({
  id, collapsed, onToggle, call, onNaturalHeight, onExpand,
}: {
  id: string; collapsed: boolean; onToggle: () => void; call: CallData;
  onNaturalHeight?: (id: string, px: number) => void;
  onExpand?: (id: string) => void;
}) {
  const cfg = PANEL_CONFIG[id] ?? { icon: Sparkles, title: id, iconBg: "bg-slate-400" };
  const Icon = cfg.icon;

  // Measure the inner content div (auto-height) — not the flex-1 body wrapper
  const contentMeasureRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = contentMeasureRef.current;
    if (!el || !onNaturalHeight) return;
    const report = () => onNaturalHeight(id, el.getBoundingClientRect().height);
    const ro = new ResizeObserver(report);
    ro.observe(el);
    report();
    return () => ro.disconnect();
  }, [id, onNaturalHeight]);

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden rounded-[20px] bg-white shadow-[0px_-2px_15px_0px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/60"
      data-panel-card
    >
      {/* Figma frosted glass overlay */}
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[20px] backdrop-blur-[21px] bg-[rgba(255,255,255,0.22)]" />
      {/* Figma inner highlight */}
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_-5px_-5px_250px_0px_rgba(255,255,255,0.02)]" />

      {/* Header — relative so it renders above the overlays */}
      <div className="relative flex flex-shrink-0 items-center gap-1 border-b border-slate-100 px-4 py-3.5">
        <div className="flex flex-shrink-0 items-center justify-center">
          <Icon className="h-[18px] w-[18px] text-slate-400" />
        </div>
        <span className="flex-1 text-[14px] font-semibold text-slate-900">{cfg.title}</span>
        {EXPANDABLE_PANELS.has(id) && onExpand && (
          <button
            onClick={() => onExpand(id)}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 print:hidden"
          >
            View details
            <Maximize2 className="h-3 w-3" />
          </button>
        )}
        <div className="drag-handle flex h-6 w-6 cursor-grab items-center justify-center rounded-md text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-500 active:cursor-grabbing print:hidden">
          <GripVertical className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Scrollable body — inner div is auto-height for measurement */}
      <div
        data-panel-body
        className={cn(
          "relative flex-1 overflow-y-auto px-4 py-3 transition-all duration-300",
          collapsed && "hidden"
        )}
      >
        {/* Inner auto-height wrapper — observed by ResizeObserver */}
        <div ref={contentMeasureRef}>
          <PanelContent id={id} call={call} />
        </div>
      </div>
    </div>
  );
}

// ── Panel content router ──────────────────────────────────────────────────────
function PanelContent({ id, call }: { id: string; call: CallData }) {
  switch (id) {
    case "stakeholders": return <StakeholdersPanel call={call} />;
    case "opportunity":  return <OpportunityPanel call={call} />;
    case "meeting":      return <MeetingNotesPanel call={call} />;
    case "recap":        return <ConversationRecapPanel call={call} />;
    case "news":         return <RelatedNewsPanel call={call} />;
    case "work":         return <RelatedWorkPanel call={call} />;
    case "tech":         return <TechIntelligencePanel call={call} />;
    default:             return null;
  }
}

// ── Brand-icon SVGs ───────────────────────────────────────────────────────────
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function GmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4caf50" d="M45 16.2l-5 2.75-5 4.75L35 40h7c1.657 0 3-1.343 3-3V16.2z"/>
      <path fill="#1e88e5" d="M3 16.2l3.614 1.71L13 23.7V40H6c-1.657 0-3-1.343-3-3V16.2z"/>
      <polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"/>
      <path fill="#c62828" d="M3 12.298V16.2l10 7.5V11.2L9.876 8.859C9.132 8.301 8.228 8 7.298 8 4.924 8 3 9.924 3 12.298z"/>
      <path fill="#fbc02d" d="M45 12.298V16.2l-10 7.5V11.2l3.124-2.341C38.868 8.301 39.772 8 40.702 8 43.076 8 45 9.924 45 12.298z"/>
    </svg>
  );
}

function SlackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ color: "initial" }}>
      {/* Blue — inline style beats any CSS currentColor override */}
      <path style={{ fill: "#36C5F0" }} d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z"/>
      <path style={{ fill: "#36C5F0" }} d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"/>
      {/* Green */}
      <path style={{ fill: "#2EB67D" }} d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834z"/>
      <path style={{ fill: "#2EB67D" }} d="M8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"/>
      {/* Red */}
      <path style={{ fill: "#E01E5A" }} d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834z"/>
      <path style={{ fill: "#E01E5A" }} d="M17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"/>
      {/* Yellow */}
      <path style={{ fill: "#ECB22E" }} d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52z"/>
      <path style={{ fill: "#ECB22E" }} d="M15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
    </svg>
  );
}

// ── Quick access strip ────────────────────────────────────────────────────────
function QuickAccessStrip({ call, onOpenDrawer }: { call: CallData; onOpenDrawer: (id: string) => void }) {
  const lastEmail = call.conversationRecap.recent[call.conversationRecap.recent.length - 1];
  const approachTurn = call.turns.find((t) => /approach/i.test(t.label));
  const approachSnippet = approachTurn ? approachTurn.text.split(/[.!?]/)[0] + "." : null;
  const emailColor = lastEmail ? avatarColor(lastEmail.person) : "bg-slate-400";
  const emailInitial = lastEmail ? lastEmail.person.trim()[0]?.toUpperCase() : "?";

  return (
    <div className="mx-4 mb-3 flex-shrink-0 overflow-hidden rounded-2xl bg-white shadow-[0px_-2px_15px_0px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/60 sm:mx-6 print:hidden">
      <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {/* Column 1 — latest email */}
        <button
          onClick={() => onOpenDrawer("recap")}
          className="flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
        >
          <div className={cn("flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white", emailColor)}>
            {emailInitial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <GmailIcon className="h-[11px] w-[11px] flex-shrink-0" />
              <p className="text-[11px] font-medium text-slate-400">Latest email</p>
              {lastEmail && <span className="ml-auto text-[10.5px] text-slate-300">{lastEmail.timestamp}</span>}
            </div>
            <p className="mt-0.5 truncate text-[12.5px] font-semibold text-slate-800">
              {lastEmail ? lastEmail.person.split(" ")[0] : "—"} — {lastEmail?.note.split("\n\n")[0].split("\n")[0].slice(0, 60)}
            </p>
          </div>
        </button>

        {/* Column 2 — meeting goal */}
        <div className="flex items-start gap-3 px-4 py-3">
          <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
            <Flag className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-slate-400">Call goal</p>
            <p className="mt-0.5 text-[12.5px] font-semibold leading-snug text-slate-800">
              {call.meetingNotes.callGoalOneSentence}
            </p>
          </div>
        </div>

        {/* Column 3 — suggested approach */}
        <div className="flex items-start gap-3 px-4 py-3">
          <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#1e2a6e]/5">
            <Sparkles className="h-3.5 w-3.5 text-[#1e2a6e]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-slate-400">Suggested approach</p>
            <p className="mt-0.5 text-[12.5px] font-semibold leading-snug text-slate-800">
              {approachSnippet ?? "Open without pitching. Lead with questions."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Stakeholders panel ────────────────────────────────────────────────────────
function StakeholdersPanel({ call }: { call: CallData }) {
  const onCall = call.stakeholders.filter((s) => s.confirmed);
  const decisionMakers = call.stakeholders.filter((s) => s.isDecisionMaker);
  const tkxel = call.tkxelAttendees ?? [];

  return (
    <div className="flex flex-col gap-4">
      {/* Section 1 — On this call */}
      {onCall.length > 0 && (
        <div>
          <p className="mb-2 text-[12px] font-semibold text-slate-900">On this call</p>
          <div className="flex flex-col divide-y divide-slate-50">
            {onCall.map((s) => {
              const avatarSrc = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(s.name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
              return (
                <div key={s.name} className={cn(
                  "flex items-center gap-3 rounded-xl px-2 py-2 first:pt-2 last:pb-2",
                  s.isDecisionMaker ? "bg-amber-50 ring-1 ring-amber-200" : ""
                )}>
                  <div className={cn("relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full", s.color)}>
                    <img src={avatarSrc} alt={s.name} className="h-9 w-9 object-cover" />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-semibold leading-tight text-slate-900">{s.name}</p>
                    <p className="truncate text-[11px] text-slate-400">{s.role}</p>
                  </div>
                  <div className="flex flex-shrink-0 flex-col items-end gap-1">
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">On call</span>
                    {s.isDecisionMaker && (
                      <span className="flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                        <Star className="h-2.5 w-2.5" fill="currentColor" />
                        Decision maker
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 2 — Decision makers */}
      {decisionMakers.length > 0 && (
        <>
          <div className="h-px bg-slate-100" />
          <div>
            <p className="mb-2 text-[12px] font-semibold text-slate-900">Decision makers</p>
            <div className="flex flex-col gap-2">
              {decisionMakers.map((s) => (
                <div key={s.name} className="flex items-start gap-2.5">
                  <div className={cn("mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white", s.color)}>
                    {s.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-semibold text-slate-900">{s.name}</p>
                    {s.decisionMakerReason && (
                      <p className="mt-0.5 text-[11px] italic leading-snug text-slate-400">{s.decisionMakerReason}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Section 3 — Tkxel on this call */}
      {tkxel.length > 0 && (
        <>
          <div className="h-px bg-slate-100" />
          <div>
            <p className="mb-2 text-[12px] font-semibold text-slate-900">Tkxel on this call</p>
            <div className="flex flex-col gap-2">
              {tkxel.map((a) => (
                <div key={a.name} className="flex items-center gap-2.5">
                  <div className={cn("flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white", a.color)}>
                    {a.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-semibold text-slate-900">{a.name}</p>
                    <p className="text-[11px] text-slate-400">{a.role}</p>
                  </div>
                  <span className="flex-shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                    Internal
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Fallback — no data */}
      {onCall.length === 0 && decisionMakers.length === 0 && (
        <div className="flex flex-col divide-y divide-slate-50">
          {call.stakeholders.map((s) => {
            const avatarSrc = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(s.name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
            return (
              <div key={s.name} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
                <div className={cn("relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full", s.color)}>
                  <img src={avatarSrc} alt={s.name} className="h-9 w-9 object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-semibold leading-tight text-slate-900">{s.name}</p>
                  <p className="truncate text-[11px] text-slate-400">{s.role}</p>
                </div>
                <div className="flex items-center gap-1">
                  <a href={s.linkedin ?? "#"} onClick={(e) => { if (!s.linkedin || s.linkedin === "#") e.preventDefault(); }} className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-[#0a66c2]/8 text-[#0a66c2] transition-colors hover:bg-[#0a66c2]/15">
                    <LinkedInIcon className="h-3.5 w-3.5" />
                  </a>
                  <button className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-slate-100 transition-colors hover:bg-slate-200">
                    <SlackIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-[12px] font-medium text-slate-600 transition-colors hover:bg-slate-50">
          <UserPlus className="h-3.5 w-3.5" />
          Add stakeholder
        </button>
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-[12px] font-medium text-slate-600 transition-colors hover:bg-slate-50">
          <PlusCircle className="h-3.5 w-3.5" />
          Start channel
        </button>
      </div>
    </div>
  );
}

// ── Opportunity analysis panel ────────────────────────────────────────────────
function OpportunityPanel({ call }: { call: CallData }) {
  const oa = call.opportunityAnalysis;
  const approachTurn = call.turns.find((t) => /approach/i.test(t.label));
  const approachText = approachTurn ? approachTurn.text.split(/[.!?]/)[0] + "." : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border border-slate-100">
        {[
          { label: "Current Roadblock", value: oa.roadblock },
          { label: "Next Milestone",    value: oa.nextMilestone },
        ].map((row, i) => (
          <div key={row.label} className={cn("grid grid-cols-[140px_1fr] items-start gap-3 px-4 py-3", i > 0 && "border-t border-slate-100")}>
            <span className="text-[12px] font-semibold text-slate-500">{row.label}</span>
            <span className="text-[13px] leading-relaxed text-slate-700">{row.value}</span>
          </div>
        ))}
        {/* Upsell row — with service mapping chips below */}
        <div className="grid grid-cols-[140px_1fr] items-start gap-3 border-t border-slate-100 px-4 py-3">
          <span className="text-[12px] font-semibold text-slate-500">Up-sell Opportunities</span>
          <div className="flex flex-col gap-2">
            <span className="text-[13px] leading-relaxed text-slate-700">{oa.upsell}</span>
            {oa.serviceMapping && oa.serviceMapping.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {oa.serviceMapping.map((sm, i) => (
                  <span key={i} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">{sm.service}</span>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Use cases row */}
        {oa.useCases && oa.useCases.length > 0 && (
          <div className="grid grid-cols-[140px_1fr] items-start gap-3 border-t border-slate-100 px-4 py-3">
            <span className="text-[12px] font-semibold text-slate-500">Use cases</span>
            <div className="flex flex-wrap gap-1.5">
              {oa.useCases.map((uc, i) => (
                <span key={i} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11.5px] text-slate-700">{uc}</span>
              ))}
            </div>
          </div>
        )}
        {/* Approach row */}
        {approachText && (
          <div className="grid grid-cols-[140px_1fr] items-start gap-3 border-t border-slate-100 px-4 py-3">
            <span className="text-[12px] font-semibold text-slate-500">Approach</span>
            <span className="text-[13px] leading-relaxed text-slate-700">{approachText}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Meeting notes panel ───────────────────────────────────────────────────────
function MeetingNotesPanel({ call }: { call: CallData }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-[12px] font-semibold text-slate-800">Meeting Goals</p>
        <ul className="flex flex-col gap-1.5">
          {call.meetingNotes.goals.map((g, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-slate-700">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300" />
              {g}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="mb-2 text-[12px] font-semibold text-slate-800">Discussion Topics</p>
        <ul className="flex flex-col gap-1.5">
          {call.meetingNotes.discussionTopics.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-slate-700">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── Conversation recap panel — Gmail thread style ──────────────────────────────
const AVATAR_COLORS = [
  "bg-violet-500", "bg-blue-500", "bg-rose-500",
  "bg-emerald-500", "bg-amber-500", "bg-indigo-500",
];
function avatarColor(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function ConversationRecapPanel({ call }: { call: CallData }) {
  const messages = call.conversationRecap.recent;
  const lastIdx = messages.length - 1;
  const [expandedIdx, setExpandedIdx] = useState<number>(lastIdx);

  return (
    <div className="flex flex-col gap-4">
      {/* Recap summary */}
      <div>
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Recap</p>
        <p className="text-[13px] leading-relaxed text-slate-700">{call.conversationRecap.summary}</p>
      </div>

      {/* Gmail-style thread */}
      <div className="flex flex-col overflow-hidden rounded-xl border border-slate-100">
        {messages.map((r, i) => {
          const isLast = i === lastIdx;
          const isExpanded = expandedIdx === i;
          const initial = r.person.trim()[0]?.toUpperCase() ?? "?";
          const color = avatarColor(r.person);
          const firstName = r.person.split(" ")[0];

          return (
            <div key={i} className={cn(!isLast && "border-b border-slate-100")}>
              {isExpanded ? (
                /* Expanded message */
                <div className="px-3.5 py-3">
                  <div className="flex items-start gap-3">
                    <div className={cn("mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white", color)}>
                      {initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <GmailIcon className="h-[13px] w-[13px] flex-shrink-0" />
                        <p className="text-[13px] font-semibold text-slate-900">{r.person}</p>
                        <span className="ml-auto flex-shrink-0 text-[11px] text-slate-400">{r.timestamp}</span>
                      </div>
                      <p className="mt-0.5 text-[10.5px] text-slate-400">{r.email}</p>
                      <div className="mt-2.5 flex flex-col gap-2 border-t border-slate-100 pt-2.5">
                        {r.note.split("\n\n").map((para, pi) => (
                          <p key={pi} className="whitespace-pre-line text-[12.5px] leading-relaxed text-slate-700">
                            {para}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Collapsed row */
                <button
                  onClick={() => setExpandedIdx(i)}
                  className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-slate-50"
                >
                  <div className={cn("flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white", color)}>
                    {initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[13px] font-semibold text-slate-900">{firstName}</p>
                      <span className="flex-shrink-0 text-[11px] text-slate-400">{r.timestamp}</span>
                    </div>
                    <p className="mt-0.5 truncate text-[12px] text-slate-400">
                      {r.note.split("\n\n")[0].split("\n")[0]}
                    </p>
                  </div>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Related news panel ────────────────────────────────────────────────────────
function RelatedNewsPanel({ call }: { call: CallData }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="mb-2 text-[12px] font-semibold text-slate-800">Conversation Starters</p>
      <ul className="flex flex-col gap-2.5">
        {call.relatedNews.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-[13px] leading-relaxed text-slate-700">
            <span className="mt-[6px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300" />
            <span className="flex-1">{item.headline}</span>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-[3px] inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-[#0a66c2]/8 px-2 py-0.5 text-[10px] font-semibold text-[#0a66c2] transition-colors hover:bg-[#0a66c2]/15"
            >
              <LinkedInIcon className="h-2.5 w-2.5" />
              View source
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Internal match card ───────────────────────────────────────────────────────
function InternalMatchCard({ match }: { match: InternalMatch }) {
  return (
    <div className="mb-4 rounded-2xl border border-violet-200 bg-violet-50/40 px-4 py-4">
      <div className="mb-3 flex items-center gap-3">
        <div className={cn("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white", match.color)}>
          {match.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-bold text-slate-900">{match.name}</p>
          <p className="text-[11.5px] text-slate-500">{match.role}</p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 text-[10.5px] font-semibold text-violet-700">
          <MapPin className="h-3 w-3" />
          {match.location}
        </span>
      </div>
      <p className="mb-2 text-[12.5px] leading-relaxed text-slate-700">{match.relevance}</p>
      {match.pastContext && (
        <p className="mb-3 text-[11.5px] italic text-slate-400">{match.pastContext}</p>
      )}
      <div className="flex gap-2">
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-violet-200 bg-white py-1.5 text-[11.5px] font-medium text-violet-700 transition-colors hover:bg-violet-50">
          <Phone className="h-3 w-3" />
          Schedule intro
        </button>
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-violet-200 bg-white py-1.5 text-[11.5px] font-medium text-violet-700 transition-colors hover:bg-violet-50">
          <Mail className="h-3 w-3" />
          Intro email
        </button>
      </div>
    </div>
  );
}

// ── Related work panel ────────────────────────────────────────────────────────
function RelatedWorkPanel({ call }: { call: CallData }) {
  return (
    <div className="flex flex-col gap-0">
      {call.internalMatch && <InternalMatchCard match={call.internalMatch} />}
      <div className="grid grid-cols-2 gap-3">
        {call.relatedWork.map((w, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3.5"
          >
            <p className="text-[12.5px] font-semibold text-slate-800">{w.label}</p>
            {w.problem && (
              <div className="flex flex-col gap-1">
                <span className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Problem</span>
                <p className="text-[12px] leading-relaxed text-slate-500">{w.problem}</p>
              </div>
            )}
            {w.solution && (
              <div className="flex flex-col gap-1">
                <span className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">How we solved it</span>
                <p className="text-[12px] leading-relaxed text-slate-600">{w.solution}</p>
              </div>
            )}
            <a
              href={w.href}
              className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[11.5px] font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-blue-50 hover:text-blue-700 hover:ring-blue-200"
            >
              View case study
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tech Intelligence panel ───────────────────────────────────────────────────
function TechIntelligencePanel({ call }: { call: CallData }) {
  const ti = call.techIntelligence;
  if (!ti) {
    return <p className="text-[13px] text-slate-400 italic">No tech intelligence data available for this call.</p>;
  }
  return (
    <div className="flex flex-col gap-4">
      {/* Vendors table */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Detected vendors</p>
        <div className="overflow-hidden rounded-xl border border-slate-100">
          {ti.vendors.map((v, i) => (
            <div key={i} className={cn("px-4 py-3", i > 0 && "border-t border-slate-100")}>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[12.5px] font-semibold text-slate-900">{v.name}</p>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">{v.category}</span>
              </div>
              <p className="text-[11.5px] leading-snug text-slate-500">{v.signal}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hiring signals */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Hiring signals</p>
        <ul className="flex flex-col gap-2">
          {ti.hiringSignals.map((signal, i) => (
            <li key={i} className="flex items-start gap-2 text-[12.5px] leading-snug text-slate-700">
              <TrendingUp className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-indigo-400" />
              {signal}
            </li>
          ))}
        </ul>
      </div>

      {/* AI synthesis */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3">
        <div className="mb-1.5 flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-indigo-500" />
          <p className="text-[10.5px] font-semibold text-indigo-600">AI read</p>
        </div>
        <p className="text-[12.5px] leading-relaxed text-slate-700">{ti.synthesis}</p>
      </div>
    </div>
  );
}

// ── Prepared modal ────────────────────────────────────────────────────────────
const NOTIFY_CHAIN = [
  { role: "AE",         name: "Hassan Malik"   },
  { role: "Director",   name: "Sarah Chen"     },
  { role: "VP of Sales",name: "James Liu"      },
  { role: "CEO",        name: "Nadia Kowalski" },
];

function PreparedModal({ call, notifyStep, setNotifyStep, onClose }: {
  call: CallData;
  notifyStep: number;
  setNotifyStep: (n: number) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (notifyStep < NOTIFY_CHAIN.length - 1) {
      const t = setTimeout(() => setNotifyStep(notifyStep + 1), 800);
      return () => clearTimeout(t);
    }
  }, [notifyStep, setNotifyStep]);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto w-full max-w-sm mx-4 rounded-2xl bg-white p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-[15px] font-bold text-slate-900">Prep marked as ready</p>
              <p className="text-[12px] text-slate-400">{call.company} · {call.person}</p>
            </div>
          </div>

          {/* Chain */}
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Notification chain</p>
          <div className="flex flex-col gap-3">
            {NOTIFY_CHAIN.map((node, i) => {
              const isDone = i <= notifyStep;
              const isActive = i === notifyStep;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={cn(
                    "h-2.5 w-2.5 flex-shrink-0 rounded-full transition-colors duration-500",
                    isDone ? "bg-emerald-400" : "bg-slate-200",
                    isActive && "animate-pulse bg-amber-400",
                  )} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-slate-900">{node.name}</p>
                    <p className="text-[11px] text-slate-400">{node.role}</p>
                  </div>
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[10.5px] font-semibold",
                    isDone && !isActive ? "bg-emerald-50 text-emerald-700" : isActive ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-400",
                  )}>
                    {isDone && !isActive ? "Sent" : isActive ? "Sending…" : "Queued"}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="mt-7 w-full rounded-xl bg-slate-900 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

// ── Panel drawer ─────────────────────────────────────────────────────────────
const DRAWER_CONFIG: Record<string, { icon: React.ElementType; title: string; accent: string }> = {
  stakeholders: { icon: Users,         title: "Stakeholder Briefing", accent: "text-violet-500"  },
  opportunity:  { icon: BarChart2,     title: "Opportunity Analysis", accent: "text-rose-500"    },
  recap:        { icon: MessageCircle, title: "Conversation Recap",   accent: "text-emerald-500" },
  work:         { icon: BookOpen,      title: "Related Work",         accent: "text-teal-500"    },
  news:         { icon: Newspaper,     title: "Conversation Openers", accent: "text-amber-500"   },
};

// ── Shared drawer primitives ──────────────────────────────────────────────────
function DrawerSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-[16px] font-bold text-slate-900">{title}</h3>
      {children}
    </section>
  );
}
function DrawerDivider() {
  return <div className="h-px bg-slate-100" />;
}
function DrawerBody({ children }: { children: React.ReactNode }) {
  const text = typeof children === "string" ? children : null;
  if (text) {
    const bullets = text.split(/(?<=\.)\s+/).filter(Boolean);
    if (bullets.length > 1) {
      return (
        <ul className="flex flex-col gap-2">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#1e2a6e]/30" />
              <span className="text-[13.5px] leading-relaxed text-slate-800">{b}</span>
            </li>
          ))}
        </ul>
      );
    }
  }
  return <p className="text-[13.5px] leading-relaxed text-slate-800">{children}</p>;
}
function DrawerBlockquote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="rounded-r-xl border-l-[3px] border-slate-300 bg-slate-50 py-3 pl-4 pr-4">
      <p className="text-[14px] italic leading-relaxed text-slate-600">{children}</p>
    </blockquote>
  );
}
function DrawerCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#1e2a6e]/10 bg-[#1e2a6e]/5 px-5 py-4">
      <p className="text-[14px] font-medium leading-relaxed text-[#1e2a6e]">{children}</p>
    </div>
  );
}
function DrawerField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2.5 text-[13px] font-semibold text-slate-800">{label}</p>
      {children}
    </div>
  );
}
function DrawerTabBar({ tabs, active, onChange }: { tabs: string[]; active: number; onChange: (i: number) => void }) {
  return (
    <div className="-mx-1 flex border-b border-slate-200 px-5">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          onClick={() => onChange(i)}
          className={cn(
            "relative px-4 pb-3 pt-1 text-[13px] font-medium transition-colors",
            i === active ? "text-slate-900" : "text-slate-400 hover:text-slate-600",
          )}
        >
          {tab}
          {i === active && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#1e2a6e]" />
          )}
        </button>
      ))}
    </div>
  );
}

// ── Stakeholder drawer ────────────────────────────────────────────────────────
const TECHNICAL_BADGE: Record<string, { label: string; className: string }> = {
  "Technical":      { label: "Technical",      className: "bg-blue-100 text-blue-700" },
  "Semi Technical": { label: "Semi Technical", className: "bg-amber-100 text-amber-700" },
  "Non Technical":  { label: "Non Technical",  className: "bg-violet-100 text-violet-700" },
};

function StakeholderAccordion({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <Icon className="h-[18px] w-[18px] flex-shrink-0 text-slate-500" />
        <span className="flex-1 text-[14px] font-semibold text-slate-900">{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-4">{children}</div>
      )}
    </div>
  );
}

function DrawerStakeholders({ call }: { call: CallData }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = call.stakeholders[activeIdx];
  if (!active) return null;

  const avatarSrc = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(active.name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
  const badge = active.technicalLevel ? TECHNICAL_BADGE[active.technicalLevel] : null;
  const summaryLines = active.summary
    ? active.summary.split(/(?<=\.)\s+/).filter(Boolean)
    : [];

  return (
    <div className="flex flex-col">
      {/* ── Person tab bar (sticky) ── */}
      {call.stakeholders.length > 1 && (
        <div className="sticky top-0 z-10 flex border-b border-slate-100 bg-white px-5 py-2">
          {call.stakeholders.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setActiveIdx(i)}
              className={cn(
                "relative px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                activeIdx === i ? "text-slate-900" : "text-slate-400 hover:text-slate-600",
              )}
            >
              {s.name.split(" ")[0]}
              {activeIdx === i && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#1e2a6e]" />
              )}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-6 px-6 py-6">
        {/* ── 1. Profile ── */}
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className={cn("h-14 w-14 overflow-hidden rounded-2xl", active.color)}>
              <img src={avatarSrc} alt={active.name} className="h-14 w-14 object-cover" />
            </div>
            <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[18px] font-bold leading-tight text-slate-900">{active.name}</p>
            <p className="mt-0.5 text-[13px] text-slate-400">{active.role}</p>
            {badge && (
              <span className={cn("mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold", badge.className)}>
                {badge.label}
              </span>
            )}
          </div>
          {active.linkedin && (
            <a
              href={active.linkedin}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-[#0a66c2]/20 bg-[#0a66c2]/8 text-[#0a66c2] transition-colors hover:bg-[#0a66c2]/15"
              title="LinkedIn"
            >
              <LinkedInIcon className="h-4 w-4" />
            </a>
          )}
        </div>

        {/* ── 2. Prospect summary ── */}
        {summaryLines.length > 0 && (
          <div>
            <div className="mb-2.5 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#2563eb]" />
              <p className="text-[13px] font-semibold text-slate-800">Prospect summary</p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3.5">
              <div className="flex flex-col gap-2">
                {summaryLines.map((sentence, i) => (
                  <p key={i} className="text-[13px] leading-relaxed text-slate-700">{sentence}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="h-px bg-slate-100" />

        {/* ── 3. Background ── */}
        {((active.education && active.education.length > 0) || (active.previousCompanies && active.previousCompanies.length > 0)) && (
          <div className="flex flex-col gap-5">
            {active.education && active.education.length > 0 && (
              <DrawerField label="Education">
                <div className="flex flex-col gap-2.5">
                  {active.education.map((e, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <GraduationCap className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-300" />
                      <div>
                        <p className="text-[13px] font-semibold text-slate-800">{e.degree}</p>
                        <p className="text-[12px] text-slate-400">{e.institution}{e.year ? ` · ${e.year}` : ""}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </DrawerField>
            )}
            {active.previousCompanies && active.previousCompanies.length > 0 && (
              <DrawerField label="Previous companies">
                <div className="flex flex-col gap-2.5">
                  {active.previousCompanies.map((c, i) => (
                    <div key={i} className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <Briefcase className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-300" />
                        <div>
                          <p className="text-[13px] font-semibold text-slate-800">{c.name}</p>
                          <p className="text-[12px] text-slate-400">{c.role}</p>
                        </div>
                      </div>
                      {c.duration && <span className="flex-shrink-0 text-[12px] text-slate-400">{c.duration}</span>}
                    </div>
                  ))}
                </div>
              </DrawerField>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

function DrawerOpportunity({ call }: { call: CallData }) {
  const [tab, setTab] = useState(0);
  const oa = call.opportunityAnalysis;
  return (
    <div className="flex flex-col">
      <DrawerTabBar tabs={["Context", "Risk"]} active={tab} onChange={setTab} />
      <div className="flex flex-col gap-6 px-6 py-6">
        {tab === 0 && (
          <>
            <DrawerField label="Why they are talking to us">
              <DrawerBody>{oa.whyTalkingToUs}</DrawerBody>
            </DrawerField>
            <div className="h-px bg-slate-100" />
            <DrawerField label="In their own words">
              <DrawerBlockquote>{oa.problemInTheirWords}</DrawerBlockquote>
            </DrawerField>
            <div className="h-px bg-slate-100" />
            <DrawerField label="What they have tried">
              <DrawerBody>{oa.whatTheyHaveTried}</DrawerBody>
            </DrawerField>
            <div className="h-px bg-slate-100" />
            <DrawerField label="What a win looks like">
              <DrawerBody>{oa.whatWinLooksLike}</DrawerBody>
            </DrawerField>
            <div className="h-px bg-slate-100" />
            <DrawerField label="The unlock question">
              <DrawerCallout>{oa.unlockQuestion}</DrawerCallout>
            </DrawerField>
          </>
        )}
        {tab === 1 && (
          <>
            <DrawerField label="Deal risk">
              <DrawerBody>{oa.dealRisk}</DrawerBody>
            </DrawerField>
            <div className="h-px bg-slate-100" />
            <DrawerField label="What to avoid">
              <ul className="flex flex-col gap-2.5">
                {oa.whatToAvoid.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </DrawerField>
          </>
        )}
      </div>
    </div>
  );
}

function DrawerMeeting({ call }: { call: CallData }) {
  const [tab, setTab] = useState(0);
  const mn = call.meetingNotes;
  return (
    <div className="flex flex-col">
      <DrawerTabBar tabs={["Goal", "Questions", "Close", "Objections"]} active={tab} onChange={setTab} />
      <div className="flex flex-col gap-6 px-6 py-6">
        {tab === 0 && (
          <DrawerField label="How to open">
            <DrawerBlockquote>{mn.howToOpen}</DrawerBlockquote>
          </DrawerField>
        )}
        {tab === 1 && (
          <DrawerField label="Discovery arc">
            <ol className="relative mt-1 flex flex-col">
              {mn.discoveryArc.map((item, i) => {
                const isLast = i === mn.discoveryArc.length - 1;
                return (
                  <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
                    {!isLast && (
                      <div className="absolute left-[9px] top-5 h-full w-px bg-slate-100" />
                    )}
                    <div className="mt-1 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-2 border-slate-300 bg-white">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1 pb-1">
                      <p className="text-[14px] font-semibold leading-snug text-slate-900">{item.question}</p>
                      <p className="mt-1.5 rounded-lg bg-slate-50 px-3 py-2 text-[12.5px] leading-relaxed text-slate-500">{item.purpose}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </DrawerField>
        )}
        {tab === 2 && (
          <DrawerField label="How to close">
            <DrawerBody>{mn.howToClose}</DrawerBody>
          </DrawerField>
        )}
        {tab === 3 && (
          <DrawerField label="If things go wrong">
            <ol className="relative mt-1 flex flex-col">
              {mn.thingsGoWrong.map((item, i) => {
                const isLast = i === mn.thingsGoWrong.length - 1;
                return (
                  <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
                    {!isLast && (
                      <div className="absolute left-[9px] top-5 h-full w-px bg-slate-100" />
                    )}
                    <div className="mt-1 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-2 border-amber-300 bg-white">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold leading-snug text-slate-900">{item.scenario}</p>
                      <div className="mt-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                        <p className="text-[13px] leading-relaxed text-amber-900/80">{item.response}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </DrawerField>
        )}
      </div>
    </div>
  );
}

function DrawerRecapEmails({ messages }: { messages: { person: string; email: string; timestamp: string; note: string }[] }) {
  const lastIdx = messages.length - 1;
  const [expandedIdx, setExpandedIdx] = useState<number>(lastIdx);
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-100">
      {messages.map((r, i) => {
        const isExpanded = expandedIdx === i;
        const initial = r.person.trim()[0]?.toUpperCase() ?? "?";
        const color = avatarColor(r.person);
        const firstName = r.person.split(" ")[0];
        return (
          <div key={i} className={cn(i < messages.length - 1 && "border-b border-slate-100")}>
            {isExpanded ? (
              <div className="px-4 py-3.5">
                <div className="flex items-start gap-3">
                  <div className={cn("mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white", color)}>
                    {initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <GmailIcon className="h-[13px] w-[13px] flex-shrink-0" />
                      <p className="text-[13px] font-semibold text-slate-900">{r.person}</p>
                      <span className="ml-auto flex-shrink-0 text-[11px] text-slate-400">{r.timestamp}</span>
                    </div>
                    <p className="mt-0.5 text-[10.5px] text-slate-400">{r.email}</p>
                    <div className="mt-2.5 flex flex-col gap-2 border-t border-slate-100 pt-2.5">
                      {r.note.split("\n\n").map((para, pi) => (
                        <p key={pi} className="whitespace-pre-line text-[12.5px] leading-relaxed text-slate-700">{para}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setExpandedIdx(i)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50"
              >
                <div className={cn("flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white", color)}>
                  {initial}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-semibold text-slate-900">{firstName}</p>
                    <span className="flex-shrink-0 text-[11px] text-slate-400">{r.timestamp}</span>
                  </div>
                  <p className="mt-0.5 truncate text-[12px] text-slate-400">
                    {r.note.split("\n\n")[0].split("\n")[0]}
                  </p>
                </div>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DrawerRecap({ call }: { call: CallData }) {
  const [tab, setTab] = useState(0);
  const cr = call.conversationRecap;
  return (
    <div className="flex flex-col">
      <DrawerTabBar tabs={["History", "Emails", "Insights"]} active={tab} onChange={setTab} />
      <div className="flex flex-col gap-6 px-6 py-6">
        {tab === 0 && (
          <>
            <DrawerField label="What has been said">
              <DrawerBody>{cr.whatHasBeenSaid}</DrawerBody>
            </DrawerField>
            <div className="h-px bg-slate-100" />
            <DrawerField label="Most important thing said">
              <DrawerBlockquote>{cr.mostImportantThing}</DrawerBlockquote>
            </DrawerField>
            <div className="h-px bg-slate-100" />
            <DrawerField label="Commitments already made">
              <DrawerBody>{cr.commitmentsMade}</DrawerBody>
            </DrawerField>
          </>
        )}
        {tab === 1 && (
          <DrawerRecapEmails messages={cr.recent} />
        )}
        {tab === 2 && (
          <>
            <DrawerField label="Their communication style">
              <DrawerBody>{cr.communicationStyle}</DrawerBody>
            </DrawerField>
            <div className="h-px bg-slate-100" />
            <DrawerField label="The one thing to make sure comes up">
              <DrawerCallout>{cr.oneThing}</DrawerCallout>
            </DrawerField>
          </>
        )}
      </div>
    </div>
  );
}

function DrawerWork({ call }: { call: CallData }) {
  const [tab, setTab] = useState(0);
  return (
    <div className="flex flex-col">
      <DrawerTabBar tabs={["Case Studies", "AI Relevance"]} active={tab} onChange={setTab} />
      <div className="flex flex-col gap-6 px-6 py-6">
        {tab === 0 && (
          <>
            {call.relatedWork.map((w, i) => (
              <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <p className="mb-3.5 text-[14px] font-bold text-slate-900">{w.label}</p>
                {w.problem && (
                  <div className="mb-3">
                    <p className="mb-1.5 text-[12px] font-semibold text-slate-700">Problem</p>
                    <p className="text-[13px] leading-relaxed text-slate-600">{w.problem}</p>
                  </div>
                )}
                {w.solution && (
                  <div className="mb-4">
                    <p className="mb-1.5 text-[12px] font-semibold text-slate-700">How we solved it</p>
                    <p className="text-[13px] leading-relaxed text-slate-600">{w.solution}</p>
                  </div>
                )}
                <a
                  href={w.href}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563eb] px-4 py-2 text-[12px] font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
                >
                  View full case study <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </>
        )}
        {tab === 1 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#2563eb]" />
              <p className="text-[12px] text-slate-400">Why each project is relevant to this call</p>
            </div>
            {call.relatedWork.map((w, i) => (
              <div key={i} className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <p className="mb-2.5 text-[13px] font-bold text-slate-900">{w.label}</p>
                {w.aiRelevance ? (
                  <DrawerBody>{w.aiRelevance}</DrawerBody>
                ) : (
                  <p className="text-[13px] text-slate-400 italic">No AI relevance note available.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── News drawer ───────────────────────────────────────────────────────────────
function DrawerNews({ call }: { call: CallData }) {
  const [tab, setTab] = useState(0);
  const rn = call.relatedNews;
  return (
    <div className="flex flex-col">
      <DrawerTabBar tabs={["Signals", "How to use"]} active={tab} onChange={setTab} />
      <div className="flex flex-col gap-6 px-6 py-6">
        {tab === 0 && (
          <>
            {/* Warning callout */}
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
              <p className="text-[13px] leading-relaxed text-amber-900">{rn.whatNotToDo}</p>
            </div>
            <DrawerField label="What is happening in their world">
              <div className="flex flex-col gap-5 mt-1">
                {rn.items.map((item, i) => (
                  <div key={i}>
                    <div className="mb-1 flex items-start justify-between gap-3">
                      <p className="text-[13.5px] font-semibold leading-snug text-slate-900">{item.headline}</p>
                      <a href={item.href} className="mt-0.5 flex-shrink-0 text-[11px] text-blue-500 hover:underline">
                        {item.source} ↗
                      </a>
                    </div>
                    <p className="text-[13px] leading-relaxed text-slate-500">{item.context}</p>
                  </div>
                ))}
              </div>
            </DrawerField>
          </>
        )}
        {tab === 1 && (
          <>
            <DrawerField label="How to use each signal">
              <div className="flex flex-col gap-5 mt-1">
                {rn.items.map((item, i) => (
                  <div key={i}>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{item.headline.split("—")[0].trim()}</p>
                    <div className="rounded-lg border-l-2 border-blue-300 bg-blue-50/60 px-3 py-2.5">
                      <p className="text-[12.5px] italic leading-relaxed text-slate-600">{item.howToUse}</p>
                    </div>
                  </div>
                ))}
              </div>
            </DrawerField>
            {rn.tkxelSignals && (
              <>
                <div className="h-px bg-slate-100" />
                <DrawerField label="Tkxel signals worth mentioning">
                  <DrawerBody>{rn.tkxelSignals}</DrawerBody>
                </DrawerField>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function PanelDrawer({ panelId, call, onClose }: { panelId: string; call: CallData; onClose: () => void }) {
  const cfg = DRAWER_CONFIG[panelId];
  if (!cfg) return null;
  const Icon = cfg.icon;

  const [drawerInput, setDrawerInput] = useState("");
  const [drawerReply, setDrawerReply] = useState<string | null>(null);
  const [drawerThinking, setDrawerThinking] = useState(false);
  const [typedReply, setTypedReply] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleDrawerSend = () => {
    const q = drawerInput.trim();
    if (!q) return;
    setDrawerInput("");
    setDrawerReply(null);
    setTypedReply("");
    setDrawerThinking(true);
    setTimeout(() => {
      const answer = `Based on the ${cfg.title.toLowerCase()} for ${call.company}: ${q.endsWith("?") ? "" : "regarding your question — "}this is specific prep context generated from what we know about ${call.person} and their situation. The agent would surface the most relevant detail from this section to answer your question directly.`;
      setDrawerThinking(false);
      setDrawerReply(answer);
    }, 1800);
  };

  // Typewriter for drawer reply
  useEffect(() => {
    if (!drawerThinking && drawerReply) {
      setTypedReply("");
      const chars = drawerReply.split("");
      let i = 0;
      intervalRef.current = setInterval(() => {
        i += 3;
        setTypedReply(chars.slice(0, i).join(""));
        if (i >= chars.length) clearInterval(intervalRef.current!);
      }, 12);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [drawerThinking, drawerReply]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[580px] flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center gap-3 border-b border-slate-100 px-6 py-5">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50">
            <Icon className={cn("h-[18px] w-[18px]", cfg.accent)} />
          </div>
          <h2 className="flex-1 text-[17px] font-bold text-slate-900">{cfg.title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {panelId === "stakeholders" && <DrawerStakeholders call={call} />}
          {panelId === "opportunity" && <DrawerOpportunity call={call} />}
          {panelId === "meeting"     && <DrawerMeeting call={call} />}
          {panelId === "recap"       && <DrawerRecap call={call} />}
          {panelId === "work"        && <DrawerWork call={call} />}
          {panelId === "news"        && <DrawerNews call={call} />}
        </div>

        {/* AI ask bar — sticky bottom */}
        <div className="flex-shrink-0 border-t border-slate-100 bg-white px-5 pb-5 pt-3">
          {/* Inline reply bubble */}
          {(drawerThinking || typedReply) && (
            <div className="mb-3 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3">
              {drawerThinking ? (
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-[#1e2a6e]" />
                  <span className="text-[12px] text-slate-400">Thinking…</span>
                  <span className="flex gap-1 ml-1">
                    {[0,1,2].map(i => (
                      <span key={i} className="inline-block h-1 w-1 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 flex-shrink-0 text-[#1e2a6e]" />
                    <span className="text-[11px] font-semibold text-[#1e2a6e]">Insphere Agent</span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-slate-700">{typedReply}</p>
                </div>
              )}
            </div>
          )}
          {/* Input row */}
          <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 focus-within:border-[#1e2a6e]/40 focus-within:ring-2 focus-within:ring-[#1e2a6e]/10 transition-all">
            <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-[#1e2a6e]" />
            <input
              value={drawerInput}
              onChange={(e) => setDrawerInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleDrawerSend(); } }}
              placeholder={`Ask anything about ${cfg.title.toLowerCase()}…`}
              className="flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-400"
            />
            <button
              disabled={!drawerInput.trim() || drawerThinking}
              onClick={handleDrawerSend}
              className={cn(
                "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#1e2a6e] text-white transition-all",
                "disabled:cursor-not-allowed disabled:opacity-30 enabled:hover:opacity-90 enabled:active:scale-95",
              )}
            >
              <Send className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Agent response card ───────────────────────────────────────────────────────
// Looks identical to PanelCard. Shows skeleton while thinking, then typewriter.
function AgentResponseCard({ card }: { card: AgentCard }) {
  const [typedText, setTypedText] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!card.thinking && card.answer) {
      setTypedText("");
      const chars = card.answer.split("");
      let i = 0;
      intervalRef.current = setInterval(() => {
        i += 2; // 2 chars per tick for natural speed
        setTypedText(chars.slice(0, i).join(""));
        if (i >= chars.length) clearInterval(intervalRef.current!);
      }, 14);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [card.thinking, card.answer]); // eslint-disable-line react-hooks/exhaustive-deps

  // Resolve panel icon from card.icon string
  const iconMap: Record<string, React.ElementType> = {
    industry: Building2, stakeholders: Users, approach: Flag, news: Newspaper,
    meeting: Flag, risk: BarChart2, opportunity: TrendingUp, agent: Sparkles,
  };
  const Icon = iconMap[card.icon ?? "agent"] ?? Sparkles;

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden rounded-[20px] bg-white ring-1 ring-slate-200/60 shadow-[0px_-2px_15px_0px_rgba(0,0,0,0.04)]"
      data-panel-card
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[20px] backdrop-blur-[21px] bg-[rgba(235,240,255,0.14)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_-5px_-5px_250px_0px_rgba(255,255,255,0.02)]" />

      {/* Header — identical structure to PanelCard */}
      <div className="relative flex flex-shrink-0 items-center gap-1 border-b border-slate-100 px-4 py-3.5">
        <div className="flex flex-shrink-0 items-center justify-center">
          {card.thinking ? (
            <div className="relative">
              <Sparkles className="h-4 w-4 animate-pulse text-[#1e2a6e]" />
              <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 animate-ping rounded-full bg-indigo-400" />
            </div>
          ) : (
            <Icon className="h-4 w-4 text-slate-400" />
          )}
        </div>
        <span className="flex-1 text-[14px] font-semibold text-slate-900">
          {card.thinking ? "Thinking…" : (card.title ?? "Insphere Agent")}
        </span>
        <div className="drag-handle flex h-6 w-6 cursor-grab items-center justify-center rounded-md text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-500 active:cursor-grabbing print:hidden">
          <GripVertical className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Body */}
      <div className="relative flex-1 overflow-y-auto px-4 py-3">
        {card.thinking ? (
          /* Skeleton shimmer */
          <div className="flex flex-col gap-2.5 pt-1">
            <div className="h-3 w-full animate-pulse rounded-md bg-slate-100" />
            <div className="h-3 w-5/6 animate-pulse rounded-md bg-slate-100" style={{ animationDelay: "0.08s" }} />
            <div className="h-3 w-4/5 animate-pulse rounded-md bg-slate-100" style={{ animationDelay: "0.16s" }} />
            <div className="mt-2 h-3 w-full animate-pulse rounded-md bg-slate-100" style={{ animationDelay: "0.24s" }} />
            <div className="h-3 w-3/4 animate-pulse rounded-md bg-slate-100" style={{ animationDelay: "0.32s" }} />
            <div className="mt-2 h-3 w-5/6 animate-pulse rounded-md bg-slate-100" style={{ animationDelay: "0.4s" }} />
            <div className="h-3 w-2/3 animate-pulse rounded-md bg-slate-100" style={{ animationDelay: "0.48s" }} />
          </div>
        ) : (
          /* Typewriter text — preserves newlines as paragraphs */
          <div className="text-[13px] leading-relaxed text-slate-700">
            {typedText.split("\n\n").map((para, i) => (
              <p key={i} className={i > 0 ? "mt-3" : ""}>
                {para.split("\n").map((line, j) => (
                  <span key={j}>{j > 0 && <br />}{line}</span>
                ))}
              </p>
            ))}
            {typedText && typedText !== card.answer && (
              <span className="ml-0.5 inline-block animate-[blink_0.9s_steps(2)_infinite] text-[#1e2a6e]">▋</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Thinking dots (unused but kept) ───────────────────────────────────────────
function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-blue-400"
          style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
      <span className="ml-1 text-[11.5px] text-slate-400">Thinking…</span>
    </div>
  );
}

// ── Share menu ────────────────────────────────────────────────────────────────
function ShareMenu({ onClose, onCopy, onPDF, onSend }: {
  onClose: () => void; onCopy: () => void; onPDF: () => void; onSend: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-4 top-12 z-50 w-56 animate-[fadeUp_0.2s_ease_both] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl md:right-6">
        <div className="px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Share prep</p>
        </div>
        <div className="border-t border-slate-100">
          {[
            { icon: Copy,     label: "Copy link",        sub: "Share a read-only URL",     onClick: onCopy },
            { icon: Download, label: "Export PDF",        sub: "Download as formatted PDF", onClick: onPDF  },
            { icon: Mail,     label: "Send to teammate",  sub: "Email this prep",           onClick: onSend },
          ].map(({ icon: Icon, label, sub, onClick }) => (
            <button key={label} onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white">
                <Icon className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-slate-800">{label}</p>
                <p className="text-[11px] text-slate-400">{sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Send modal ────────────────────────────────────────────────────────────────
function SendModal({ email, message, callPerson, onEmailChange, onMessageChange, onSend, onClose }: {
  email: string; message: string; callPerson: string;
  onEmailChange: (v: string) => void; onMessageChange: (v: string) => void;
  onSend: () => void; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-sm animate-[fadeUp_0.25s_ease_both] rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-[14px] font-semibold text-slate-900">Send prep to teammate</p>
            <p className="text-[12px] text-slate-500">Share the {callPerson} brief</p>
          </div>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col gap-3 p-5">
          <div>
            <label className="mb-1.5 block text-[11.5px] font-medium text-slate-600">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="colleague@company.com"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-700 outline-none transition-colors focus:border-blue-300 focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11.5px] font-medium text-slate-600">Message (optional)</label>
            <textarea
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder="Here's the prep for tomorrow's call…"
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-700 outline-none transition-colors focus:border-blue-300 focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
            />
          </div>
          <button
            disabled={!email.trim()}
            onClick={onSend}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#1e2a6e] py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all disabled:opacity-40 enabled:hover:opacity-90 enabled:active:scale-[0.98]"
          >
            <Send className="h-3.5 w-3.5" />
            Send prep
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-[fadeUp_0.25s_ease_both] rounded-full border border-slate-200 bg-slate-900 px-4 py-2.5 shadow-xl">
      <p className="text-[13px] font-medium text-white">{message}</p>
    </div>
  );
}
