"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import type { LayoutItem } from "react-grid-layout";
type GridLayouts = { [breakpoint: string]: LayoutItem[] };
import { AppSidebar } from "@/components/call-prep/AppSidebar";
import { CallPrepBreadcrumbs } from "@/components/call-prep/CallPrepBreadcrumbs";
import { cn } from "@/lib/utils";
import { CALLS, QA_BANK, type CallData } from "@/lib/call-data";
import type { GeoPresenceCard, InternalMatch, RelatedWorkItem } from "@/lib/call-data";
import { getDoneCalls, markCallDone, unmarkCallDone } from "@/lib/done-calls";
import {
  AlertTriangle,
  ArrowUp,
  ArrowUpRight,
  BarChart2,
  BookOpen,
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
  Lightbulb,
  Linkedin,
  Mail,
  MapPin,
  Maximize2,
  Menu,
  MessageCircle,
  Newspaper,
  PlusCircle,
  Search,
  Send,
  Share2,
  Sparkles,
  Star,
  Sun,
  Moon,
  TrendingUp,
  ThumbsDown,
  ThumbsUp,
  UserPlus,
  Users,
  X,
} from "lucide-react";

/** Hero intro: two-line company blurb (aligned with dashboard cards). */
function trimmedHeroDescription(description: string): string {
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

function formatStakeholderTechnical(raw?: string): string {
  if (!raw) return "Non-technical";
  const r = raw.toLowerCase();
  if (r.includes("non")) return "Non-technical";
  if (r.includes("semi")) return "Semi-technical";
  return "Technical";
}

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
  "meeting",
  "recap",
  "news",
  "work",
  "tech",
] as const;

/** 1px rules inside focus cards (replaces Figma-exported divider SVGs; no local asset server required). */
function PanelHairlineDivider() {
  return <div className="h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)]" role="presentation" />;
}

function PanelLeadIcon({
  className,
  lucide: Lucide,
}: {
  className?: string;
  lucide: React.ElementType<{ className?: string }>;
}) {
  return (
    <Lucide
      className={cn("size-[14px] shrink-0 text-[rgba(0,0,0,0.45)]", className)}
      strokeWidth={1.75}
    />
  );
}

/** Shown when marking a call prep as done (prototype). */
const MARK_DONE_NOTIFY_SUMMARY = "Notified Sarah Chen (Director).";

// ── Default layouts per breakpoint ────────────────────────────────────────────
// Matches the Salesforce Canvas reference screenshot exactly:
//   Row 1 (25% · 50% · 25%): Stakeholders | Opportunity Analysis | Meeting Notes
//   Row 2 (50% · 50%):        Conversation Recap | Related Work
//   Row 3 (50% · 50%):        About the client | Conversation opener
//
// rowHeight=50, margin=16 → 1 grid unit = 66px
//   h=4  → 248px  both rows visible at once in viewport
//
// Row groups used by auto-height normaliser so all panels in a row stay equal:
//   ROW_GROUPS[0] = ["stakeholders","opportunity","meeting"]
//   ROW_GROUPS[1] = ["recap","news"]
//   ROW_GROUPS[2] = ["tech","work"]
const DEFAULT_LAYOUTS: GridLayouts = {
  lg: [
    { i: "stakeholders", x: 0, y:  0,  w: 1, h: 6,  minH: 2, minW: 1 },
    { i: "opportunity",  x: 1, y:  0,  w: 2, h: 6,  minH: 2, minW: 1 },
    { i: "meeting",      x: 3, y:  0,  w: 1, h: 6,  minH: 2, minW: 1 },
    { i: "recap",        x: 0, y:  6,  w: 2, h: 6,  minH: 2, minW: 1 },
    { i: "work",         x: 2, y:  6,  w: 2, h: 6,  minH: 2, minW: 1 },
    { i: "tech",         x: 0, y: 12,  w: 2, h: 8,  minH: 2, minW: 1 },
    { i: "news",         x: 2, y: 12,  w: 2, h: 8,  minH: 2, minW: 1 },
  ],
  md: [
    { i: "stakeholders", x: 0, y:  0,  w: 1, h: 6 },
    { i: "opportunity",  x: 1, y:  0,  w: 1, h: 6 },
    { i: "meeting",      x: 0, y:  6,  w: 1, h: 6 },
    { i: "recap",        x: 1, y:  6,  w: 1, h: 6 },
    { i: "work",         x: 0, y: 12,  w: 2, h: 6 },
    { i: "tech",         x: 0, y: 18,  w: 1, h: 8 },
    { i: "news",         x: 1, y: 18,  w: 1, h: 8 },
  ],
  sm: [
    { i: "stakeholders", x: 0, y:  0,  w: 1, h: 6 },
    { i: "opportunity",  x: 0, y:  6,  w: 1, h: 6 },
    { i: "meeting",      x: 0, y: 12,  w: 1, h: 6 },
    { i: "recap",        x: 0, y: 18,  w: 1, h: 6 },
    { i: "work",         x: 0, y: 24,  w: 1, h: 6 },
    { i: "tech",         x: 0, y: 30,  w: 1, h: 8 },
    { i: "news",         x: 0, y: 38,  w: 1, h: 8 },
  ],
};

// Panels that share the same grid row — auto-height normalises to max(h) in row
const ROW_GROUPS: string[][] = [
  ["stakeholders", "opportunity", "meeting"],
  ["recap", "work"],
  ["tech", "news"],
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getLayoutKey(callId: string) {
  // bumped: Figma card chrome (#f7f7f7) + hero metrics row
  return `insphere-layout-v29-${callId}`;
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

  const gridRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const msgId = useRef(0);


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
        answer: `${call.company} operates in the ${call.companyDetails.industry} space, a sector where boutique specialists win on depth of domain knowledge rather than platform breadth. With ${call.companyDetails.employees} employees and ${call.companyDetails.revenue} in revenue, the team is deliberately lean. They are not buying scale, they are buying precision tools that make a small team look bigger and smarter.\n\nIn this vertical, trust is currency. Buyers like ${call.person} have seen dozens of vendors and will immediately discount anyone who leads with a pitch. The entry point is always the problem, not the solution.\n\nThe key dynamic to understand: firms like ${call.company} are squeezed between growing client demand and headcount constraints. The opportunity is automation that removes manual overhead without disrupting the expert judgment at the core of their value proposition.`,
      };
    }
    if (/stakeholder|who|contact|person|people/.test(lc)) {
      return {
        title: "Stakeholder Briefing",
        icon: "stakeholders",
        answer: call.stakeholders.map(s =>
          `${s.name} (${s.role}), the primary contact on this call. ${call.turns.find(t => /verdict/i.test(t.label))?.text ?? ""}`
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
        title: "Conversation opener",
        icon: "news",
        answer: call.relatedNews.items.map((item, i) => `${i + 1}. ${item.headline}`).join("\n\n"),
      };
    }
    if (/roadblock|challenge|risk|blocker|problem|pain/.test(lc)) {
      return {
        title: "Risks & Blockers",
        icon: "risk",
        answer: `The current roadblock is: ${call.opportunityAnalysis.roadblock}\n\nWhat to watch for on this call: budget ownership may be unclear, qualify this early. Technical stakeholders may not be present. Any incumbent vendor relationship could slow the decision significantly. Don't push for a close until these are surfaced.`,
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
      <AppSidebar logoHref="/call-prep" />

      <main className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white print:m-0">
        {shareOpen && (
          <ShareMenu
            onClose={() => setShareOpen(false)}
            onCopy={copyLink}
            onPDF={exportPDF}
            onSend={() => {
              setShareOpen(false);
              setSendModalOpen(true);
            }}
          />
        )}

        {/* ── Detail header row (matches Figma 1925:4725) ───────────────── */}
        <div className="flex-shrink-0 bg-white px-6 pb-4 pt-5 md:px-8 print:bg-white">
          <CallPrepBreadcrumbs
            items={[
              { label: "Dashboard", href: "/call-prep" },
              { label: "All Calls", href: "/call-prep/all" },
              { label: call.company },
            ]}
          />
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[24px] font-medium leading-[1.04] tracking-normal text-[rgba(0,0,0,0.9)]">
              {call.company}
            </h1>
            <div className="flex min-w-0 flex-[1_0_0] flex-wrap items-center gap-2">
              <span className="inline-flex shrink-0 items-center gap-1 rounded-[20px] bg-[#f7f7f7] px-2 py-1 text-[14px] font-normal leading-5 text-[rgba(0,0,0,0.5)]">
                <CallTimeIcon datetime={call.datetime} />
                {call.datetime}
                {call.timezone ? ` • ${call.timezone}` : ""}
              </span>
              <span className="inline-flex shrink-0 items-center rounded-[20px] bg-[#f7f7f7] px-2 py-1 text-[14px] leading-5 text-[rgba(0,0,0,0.5)]">
                Call Rating{" "}
                <span className="font-normal text-[rgba(0,0,0,0.81)]">
                  {call.rating * 2}/10
                </span>
              </span>
            </div>

            <div className="ml-auto flex shrink-0 flex-wrap items-center gap-2 print:hidden">
              <button
                type="button"
                onClick={() => {
                  if (isDone) {
                    unmarkCallDone(callId);
                    setIsDone(false);
                  } else {
                    markCallDone(callId);
                    setIsDone(true);
                    showToast(MARK_DONE_NOTIFY_SUMMARY);
                  }
                }}
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-[32px] px-4 py-2 text-[14px] font-medium transition-all active:scale-[0.98]",
                  isDone
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                    : "bg-[rgba(0,0,0,0.9)] text-white hover:bg-black",
                )}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {isDone ? "Prepared" : "Mark as Prepared"}
              </button>
              <button
                type="button"
                onClick={() => setShareOpen((v) => !v)}
                className="inline-flex h-9 items-center gap-2 rounded-[32px] border border-black/[0.12] bg-white px-4 py-2 text-[14px] font-medium text-[rgba(0,0,0,0.9)] transition-colors hover:bg-black/[0.02]"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-4 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
            <p className="max-w-[490px] shrink-0 text-[14px] font-medium leading-[1.5] text-[rgba(0,0,0,0.5)]">
              {call.detailHeroSegments ? (
                <>
                  {call.detailHeroSegments.map((seg, i) =>
                    seg.semibold ? (
                      <span key={i} className="font-semibold text-[rgba(0,0,0,0.5)]">
                        {seg.text}
                      </span>
                    ) : (
                      <span key={i}>{seg.text}</span>
                    ),
                  )}
                </>
              ) : (
                trimmedHeroDescription(call.description ?? call.opportunityAnalysis.recap)
              )}
            </p>

            <div className="ml-auto flex w-full shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-[20px] bg-[#f7f7f7] px-4 py-3 sm:w-auto sm:justify-end">
              {(() => {
                const shortIndustry =
                  call.prepMetricsIndustry ||
                  call.companyDetails.industry.split(/\s*&\s*/)[0]?.trim() ||
                  call.companyDetails.industry;
                const cols = [
                  { label: "Revenue", value: call.companyDetails.revenue },
                  { label: "Industry", value: shortIndustry },
                  { label: "Employees", value: call.companyDetails.employees },
                ] as const;
                const sep = (
                  <div
                    key="sep-inner"
                    className="hidden h-[52px] w-px shrink-0 self-center bg-black/12 sm:block"
                    aria-hidden
                  />
                );
                const chunks: React.ReactNode[] = [];
                cols.forEach((c, idx) => {
                  if (idx > 0) chunks.push(<React.Fragment key={`s-${idx}`}>{sep}</React.Fragment>);
                  chunks.push(
                    <div key={c.label} className="flex min-w-[88px] flex-col gap-2">
                      <p className="text-[12px] font-medium leading-[1.04] text-[rgba(0,0,0,0.5)]">{c.label}</p>
                      <p className="text-[24px] font-medium leading-[1.04] tracking-[-0.02em] text-[rgba(0,0,0,0.9)]">{c.value}</p>
                    </div>,
                  );
                });
                if (call.companyDetails.website) {
                  chunks.push(<React.Fragment key="wsep">{sep}</React.Fragment>);
                  const href = call.companyDetails.website.startsWith("http")
                    ? call.companyDetails.website
                    : `https://${call.companyDetails.website}`;
                  const display = call.companyDetails.website.replace(/^https?:\/\//, "");
                  chunks.push(
                    <div key="Website" className="flex flex-col gap-2">
                      <p className="text-[12px] font-medium leading-[1.04] text-[rgba(0,0,0,0.5)]">Website</p>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[24px] font-medium leading-[1.04] tracking-[-0.02em] text-[rgba(17,97,236,0.9)] underline decoration-solid underline-offset-2 [text-decoration-skip-ink:none] hover:opacity-90"
                      >
                        {display}
                      </a>
                    </div>,
                  );
                }
                return chunks;
              })()}
            </div>
          </div>
        </div>

        {/* ── Bento grid ── */}
        <div
          ref={gridRef}
          className="min-h-0 flex-1 overflow-y-auto px-6 pb-32 pt-2 md:px-8 md:pb-28 md:pt-5 print:overflow-visible"
        >
          <div ref={gridContainerRef}>
          {gridWidth > 0 && (
          <ResponsiveGrid
            width={gridWidth}
            layouts={layouts}
            breakpoints={{ lg: 1024, md: 640, sm: 0 }}
            cols={{ lg: 4, md: 2, sm: 1 }}
            rowHeight={50}
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
                    <AgentResponseCard
                      card={agentCard}
                      onAIFeedbackSubmitted={() => showToast("Thanks, your feedback helps train the model.")}
                    />
                  ) : (
                    <PanelCard
                      id={id}
                      collapsed={collapsed.has(id)}
                      onToggle={() => toggleCollapse(id)}
                      call={call}
                      onExpand={setActiveDrawer}
                      onAIFeedbackSubmitted={() => showToast("Thanks, your feedback helps train the model.")}
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

        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 flex flex-col justify-end bg-gradient-to-t from-black/[0.04] via-black/[0.02] to-transparent px-4 pb-5 pt-20 md:px-8 md:pb-6 print:hidden"
          data-chat-bar
        >
          <div className="pointer-events-auto mx-auto w-full max-w-[720px]">
            <div className="flex items-center gap-3 rounded-[38px] border border-black/[0.08] bg-white px-4 py-2.5 shadow-[0px_3px_6px_rgba(0,0,0,0.04)]">
              <Sparkles className="h-4 w-4 flex-shrink-0 text-[rgba(0,0,0,0.35)]" />
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask anything that helps you get prepped for this call!"
                className="flex-1 bg-transparent text-[14px] font-light text-[rgba(0,0,0,0.55)] outline-none placeholder:text-[rgba(0,0,0,0.35)]"
              />
              <button
                type="button"
                disabled={!inputValue.trim()}
                onClick={handleSend}
                className={cn(
                  "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full",
                  "bg-[rgba(0,0,0,0.9)] text-white shadow-sm transition-all",
                  "disabled:cursor-not-allowed disabled:opacity-35",
                  "enabled:active:scale-95 enabled:hover:bg-black",
                )}
              >
                <ArrowUp className="h-4 w-4" />
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

      {toast && <Toast message={toast} />}
    </div>
  );
}

// ── Panel config ──────────────────────────────────────────────────────────────
const PANEL_CONFIG: Record<string, { icon: React.ElementType; title: string; iconBg: string }> = {
  stakeholders: { icon: Users,          title: "Stakeholders",           iconBg: "bg-violet-500"  },
  opportunity:  { icon: BarChart2,      title: "Opportunity Analysis",   iconBg: "bg-rose-500"    },
  meeting:       { icon: Flag,           title: "Sales Play",               iconBg: "bg-blue-500"    },
  recap:        { icon: MessageCircle,  title: "Conversation recap",     iconBg: "bg-emerald-500" },
  news:         { icon: Newspaper,      title: "Conversation opener",   iconBg: "bg-sky-500"     },
  work:         { icon: BookOpen,       title: "Related Work",           iconBg: "bg-teal-500"    },
  tech:         { icon: Cpu,            title: "About the client",       iconBg: "bg-indigo-500"  },
};

const EXPANDABLE_PANELS = new Set(["stakeholders", "opportunity", "meeting", "recap", "work", "news"]);

function CallTimeIcon({ datetime }: { datetime: string }) {
  const match = datetime.match(/(\d+):(\d+)\s*(AM|PM)/i);
  let hour = match ? parseInt(match[1]) : 12;
  const period = match?.[3]?.toUpperCase();
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return hour >= 6 && hour < 18
    ? <Sun className="h-3 w-3 text-amber-400" />
    : <Moon className="h-3 w-3 text-indigo-400" />;
}

// ── Panel AI feedback (like / dislike + notes for training) ───────────────────
const FEEDBACK_STORAGE_KEY = "insphere-ai-panel-feedback";

function AIFeedbackModal({
  open,
  sentiment,
  widgetId,
  widgetTitle,
  onClose,
  onSubmit,
}: {
  open: boolean;
  sentiment: "like" | "dislike";
  widgetId: string;
  widgetTitle: string;
  onClose: () => void;
  onSubmit: (notes: string) => void;
}) {
  const [notes, setNotes] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open) setNotes("");
  }, [open, sentiment, widgetId]);

  if (!mounted || !open) return null;

  function handleSubmit() {
    try {
      const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      const prev = raw ? JSON.parse(raw) : [];
      prev.push({
        widgetId,
        widgetTitle,
        sentiment,
        notes: notes.trim(),
        at: Date.now(),
      });
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(prev.slice(-200)));
    } catch {
      /* ignore quota / parse */
    }
    onSubmit(notes.trim());
    onClose();
  }

  const modal = (
    <>
      <div className="fixed inset-0 z-[10000] bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none p-4">
        <div
          className="pointer-events-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-[15px] font-bold text-slate-900">Feedback for AI training</p>
              <p className="mt-0.5 text-[12px] text-slate-400">{widgetTitle}</p>
            </div>
            <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
            {sentiment === "like" ? (
              <ThumbsUp className="h-4 w-4 flex-shrink-0 text-emerald-600" />
            ) : (
              <ThumbsDown className="h-4 w-4 flex-shrink-0 text-rose-600" />
            )}
            <span className="text-[13px] font-semibold text-slate-700">{sentiment === "like" ? "Like" : "Dislike"}</span>
          </div>

          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="What worked or what should change?"
            className="mb-5 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-[13px] leading-relaxed text-slate-700 outline-none ring-slate-200 placeholder:text-slate-300 focus:ring-2"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-xl bg-slate-900 px-4 py-2 text-[13px] font-semibold text-white hover:bg-slate-800"
            >
              Submit feedback
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modal, document.body);
}

function PanelAIFeedbackMenu({
  widgetId,
  widgetTitle,
  onSubmitted,
}: {
  widgetId: string;
  widgetTitle: string;
  onSubmitted?: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<{ sentiment: "like" | "dislike" } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const MENU_W = 148;

  useLayoutEffect(() => {
    if (!menuOpen || !btnRef.current) {
      setMenuPos(null);
      return;
    }
    const r = btnRef.current.getBoundingClientRect();
    setMenuPos({
      top: r.bottom + 4,
      left: Math.min(Math.max(8, r.right - MENU_W), window.innerWidth - MENU_W - 8),
    });
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  const menuPortal =
    menuOpen && menuPos ? (
      createPortal(
        <div
          ref={menuRef}
          role="menu"
          style={{ position: "fixed", top: menuPos.top, left: menuPos.left, width: MENU_W }}
          className="z-[10001] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12.5px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
            onClick={(e) => {
              e.stopPropagation();
              setModal({ sentiment: "like" });
              setMenuOpen(false);
            }}
          >
            <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" />
            Like
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12.5px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
            onClick={(e) => {
              e.stopPropagation();
              setModal({ sentiment: "dislike" });
              setMenuOpen(false);
            }}
          >
            <ThumbsDown className="h-3.5 w-3.5 text-rose-600" />
            Dislike
          </button>
        </div>,
        document.body,
      )
    ) : null;

  return (
    <div className="flex-shrink-0 print:hidden">
      <button
        ref={btnRef}
        type="button"
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen((v) => !v);
        }}
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600",
          menuOpen && "bg-slate-100 text-slate-600",
        )}
      >
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", menuOpen && "rotate-180")} />
      </button>

      {menuPortal}

      {modal && (
        <AIFeedbackModal
          open
          sentiment={modal.sentiment}
          widgetId={widgetId}
          widgetTitle={widgetTitle}
          onClose={() => setModal(null)}
          onSubmit={() => onSubmitted?.()}
        />
      )}
    </div>
  );
}

function PanelCard({
  id, collapsed, onToggle, call, onExpand, onAIFeedbackSubmitted,
}: {
  id: string; collapsed: boolean; onToggle: () => void; call: CallData;
  onExpand?: (id: string) => void;
  onAIFeedbackSubmitted?: () => void;
}) {
  const cfg = PANEL_CONFIG[id] ?? { icon: Sparkles, title: id, iconBg: "bg-slate-400" };

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden rounded-[32px] bg-[#f7f7f7] p-5"
      data-panel-card
    >
      <div className="relative flex flex-shrink-0 items-center gap-3">
        <PanelLeadIcon
          lucide={cfg.icon}
          className={id === "stakeholders" ? "size-5 opacity-90" : undefined}
        />
        <span
          className={cn(
            "min-w-0 flex-1 font-semibold leading-[22px] tracking-[-0.2px] text-[rgba(0,0,0,0.9)]",
            id === "stakeholders" ? "text-[18px]" : "text-[16px]",
          )}
        >
          {cfg.title}
        </span>
        <div className="flex shrink-0 items-center gap-1 print:hidden">
          <div className="drag-handle flex h-8 w-8 cursor-grab items-center justify-center rounded-md text-[rgba(0,0,0,0.25)] transition-colors hover:bg-black/[0.04] hover:text-[rgba(0,0,0,0.45)] active:cursor-grabbing">
            <GripVertical
              className={cn(
                "shrink-0 opacity-80 text-[rgba(0,0,0,0.35)]",
                id === "stakeholders" ? "size-5" : "size-[14px]",
              )}
              strokeWidth={id === "stakeholders" ? 1.65 : 1.75}
            />
          </div>
          {EXPANDABLE_PANELS.has(id) && onExpand && (
            <button
              type="button"
              aria-label={`View ${cfg.title} details`}
              onClick={() => onExpand(id)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[rgba(0,0,0,0.45)] transition-colors hover:bg-black/[0.04] print:hidden"
            >
              <Maximize2 className="size-[14px] opacity-90" strokeWidth={1.75} />
            </button>
          )}
          <PanelAIFeedbackMenu
            widgetId={id}
            widgetTitle={cfg.title}
            onSubmitted={onAIFeedbackSubmitted}
          />
        </div>
      </div>

      <div
        data-panel-body
        className={cn(
          "relative mt-4 flex-1 overflow-y-auto pr-1 transition-all duration-300 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/10 [&::-webkit-scrollbar-track]:bg-transparent",
          collapsed && "hidden"
        )}
      >
        <PanelContent id={id} call={call} />
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
              {lastEmail ? `${lastEmail.person.split(" ")[0]}: ${lastEmail.note.split("\n\n")[0].split("\n")[0].slice(0, 60)}` : ""}
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

/** Figma: circular blue mark with “tk” on the right rail (internal attendees). */
function TkxelRailIcon({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-[25px] w-[25px] shrink-0 items-center justify-center rounded-full bg-[#1161ec] text-[11px] font-bold leading-none tracking-tight text-white",
        className,
      )}
      aria-hidden
    >
      tk
    </div>
  );
}

// ── Stakeholders panel ────────────────────────────────────────────────────────
/** Figma Revsphere sidebar 2040:32928 — tabs, profile row, PROSPECT SUMMARY bullets, EDUCATION. */
function StakeholdersPanel({ call }: { call: CallData }) {
  const tkxel = call.tkxelAttendees ?? [];
  const confirmed = call.stakeholders.filter((s) => s.confirmed);
  const tabPeople = confirmed.length > 0 ? confirmed : call.stakeholders;
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setActiveIdx((i) => Math.min(i, Math.max(0, tabPeople.length - 1)));
  }, [call.id, tabPeople.length]);

  if (tabPeople.length === 0) {
    return <p className="text-[14px] italic text-[rgba(0,0,0,0.35)]">No stakeholders on file for this call.</p>;
  }

  const safeIdx = Math.min(activeIdx, tabPeople.length - 1);
  const active = tabPeople[safeIdx];
  const avatarSrc = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(active.name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

  const technical = active.panelTechnicalLabel ?? formatStakeholderTechnical(active.technicalLevel);
  const swayLabel = active.isDecisionMaker ? "Decision-maker" : "Participant";

  const summaryBullets = active.summary
    ? active.summary.split(/(?<=\.)\s+/).map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="flex flex-col gap-[18px]">
      {tabPeople.length > 1 && (
        <div className="flex w-full flex-wrap items-center gap-1">
          {tabPeople.map((s, i) => {
            const selected = safeIdx === i;
            return (
              <button
                key={s.name}
                type="button"
                onClick={() => setActiveIdx(i)}
                className={cn(
                  "relative shrink-0 whitespace-nowrap px-2 pb-3 pt-0 text-left text-[14px] font-medium leading-4 transition-colors",
                  selected ? "text-[rgba(0,0,0,0.9)] border-b-[1.5px] border-solid border-[rgba(0,0,0,0.9)]" : "text-[rgba(0,0,0,0.5)] hover:text-[rgba(0,0,0,0.65)]",
                )}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      )}

      <div className="w-full rounded-lg">
        <div className="flex w-full items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[10px] bg-slate-100">
            <img src={avatarSrc} alt="" className="h-full w-full object-cover object-top" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
            <p className="truncate text-[14px] font-medium leading-4 text-[rgba(0,0,0,0.9)]">{active.name}</p>
            <p className="text-[14px] font-normal leading-5 text-[rgba(0,0,0,0.5)]">
              {active.role}
              <span className="text-[rgba(0,0,0,0.35)]"> • </span>
              {swayLabel}
              <span className="text-[rgba(0,0,0,0.35)]"> • </span>
              {technical}
            </p>
          </div>
        </div>
      </div>

      {summaryBullets.length > 0 && (
        <div className="flex w-full flex-col gap-[14px]">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 size-[14px] shrink-0 text-[rgba(0,0,0,0.45)]" strokeWidth={1.75} />
            <p className="text-[12px] font-normal uppercase leading-normal tracking-[1px] text-[rgba(0,0,0,0.7)]">
              Prospect summary
            </p>
          </div>
          {summaryBullets.map((line, i) => (
            <ul key={i} className="w-full list-disc pl-[21px] text-[14px] font-normal not-italic text-[rgba(0,0,0,0.5)]">
              <li>
                <span className="leading-[1.5]">{line}</span>
              </li>
            </ul>
          ))}
        </div>
      )}

      <PanelHairlineDivider />

      {active.education && active.education.length > 0 && (
        <div className="flex w-full flex-col gap-[14px]">
          <p className="text-[12px] font-normal uppercase leading-normal tracking-[1px] text-[rgba(0,0,0,0.7)]">
            Education
          </p>
          <div className="flex flex-col gap-[14px]">
            {active.education.map((e, i) => (
              <div key={i} className="flex w-full flex-col gap-1">
                <p className="truncate text-[14px] font-medium leading-4 text-[rgba(0,0,0,0.9)]">{e.degree}</p>
                <p className="text-[14px] font-normal leading-5 text-[rgba(0,0,0,0.5)]">
                  {e.institution}
                  {e.year ? ` · ${e.year}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {active.previousCompanies && active.previousCompanies.length > 0 && (
        <>
          <PanelHairlineDivider />
          <div className="flex w-full flex-col gap-[14px]">
            <p className="text-[12px] font-normal uppercase leading-normal tracking-[1px] text-[rgba(0,0,0,0.7)]">
              Previous companies
            </p>
            <div className="flex flex-col gap-[14px]">
              {active.previousCompanies.map((c, i) => (
                <div key={i} className="flex w-full items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium leading-4 text-[rgba(0,0,0,0.9)]">{c.name}</p>
                    <p className="mt-1 text-[14px] font-normal leading-5 text-[rgba(0,0,0,0.5)]">{c.role}</p>
                  </div>
                  {c.duration ? (
                    <span className="shrink-0 text-right text-[14px] font-normal leading-5 text-[rgba(0,0,0,0.5)]">
                      {c.duration}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tkxel.length > 0 && (
        <div className={cn("flex flex-col", (summaryBullets.length > 0 || active.education?.length) && "pt-1")}>
          <div className="relative mb-4 w-full shrink-0">
            <PanelHairlineDivider />
          </div>
          <p className="mb-3 text-[12px] font-normal uppercase tracking-[1px] text-[rgba(0,0,0,0.5)]">
            Tkxel on this call
          </p>
          <div className="divide-y divide-[#e5e5e5]">
            {tkxel.map((a) => (
              <div key={a.name} className="flex flex-col gap-1 py-[14px] first:pt-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <p className="text-[16px] font-semibold leading-[22px] tracking-[-0.2px] text-[rgba(0,0,0,0.9)]">
                      {a.name}
                    </p>
                    <span className="shrink-0 rounded-[20px] bg-[rgba(0,0,0,0.08)] px-2 py-px text-[14px] font-medium leading-[18px] text-[rgba(0,0,0,0.7)]">
                      Internal
                    </span>
                  </div>
                  <TkxelRailIcon />
                </div>
                <p className="pr-8 text-[14px] font-normal leading-5 text-[rgba(0,0,0,0.5)]">{a.role}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Opportunity analysis panel ────────────────────────────────────────────────
function bulletsFromParagraph(text: string): string[] {
  const chunks = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return chunks.length > 1 ? chunks : [text];
}

function OpportunityPanel({ call }: { call: CallData }) {
  const oa = call.opportunityAnalysis;
  const roadItems = oa.roadblockBullets?.length
    ? oa.roadblockBullets
    : bulletsFromParagraph(oa.roadblock);
  const mileItems = oa.nextMilestoneBullets?.length
    ? oa.nextMilestoneBullets
    : bulletsFromParagraph(oa.nextMilestone);
  const upItems = oa.upsellBullets?.length
    ? oa.upsellBullets
    : bulletsFromParagraph(oa.upsell);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p className="text-[12px] font-normal uppercase tracking-[1px] text-[rgba(0,0,0,0.5)]">
          WHY ARE THEY HERE?
        </p>
        <p className="text-[14px] font-medium leading-5 text-[rgba(0,0,0,0.71)]">
          {oa.whyHereLead ?? oa.recap}
        </p>
      </div>

      <div className="rounded-xl bg-white px-3">
        <div className="flex flex-col gap-3 gap-x-6 border-b border-black/[0.12] py-3 sm:flex-row sm:items-start">
          <p className="w-full shrink-0 text-[14px] font-medium text-black sm:w-[144px]">
            Current Roadblock
          </p>
          <ul className="list-disc space-y-3 py-0.5 ps-5 text-[14px] leading-[1.5] text-[rgba(0,0,0,0.5)] marker:text-black/35 sm:flex-1">
            {roadItems.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3 gap-x-6 border-b border-black/[0.12] py-3 sm:flex-row sm:items-start">
          <p className="w-full shrink-0 text-[14px] font-medium text-black sm:w-[144px]">
            Next Milestone
          </p>
          <ul className="list-disc space-y-3 py-0.5 ps-5 text-[14px] leading-[1.5] text-[rgba(0,0,0,0.5)] marker:text-black/35 sm:flex-1">
            {mileItems.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3 gap-x-6 border-b border-black/[0.12] py-3 sm:flex-row sm:items-start">
          <p className="w-full shrink-0 text-[14px] font-medium text-black sm:w-[144px]">
            Up-sell Opportunities
          </p>
          <ul className="list-disc space-y-3 py-0.5 ps-5 text-[14px] leading-[1.5] text-[rgba(0,0,0,0.5)] marker:text-black/35 sm:flex-1">
            {upItems.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>

        {oa.serviceMapping && oa.serviceMapping.length > 0 && (
          <div className="flex flex-col gap-6 py-3 sm:flex-row sm:gap-8">
            <p className="w-full shrink-0 text-[14px] font-medium text-black sm:w-[144px]">
              Service Mapping
            </p>
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              {oa.serviceMapping.map((sm, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <span className="w-fit rounded-[20px] bg-[rgba(0,0,0,0.08)] px-2 py-0.5 text-[14px] font-medium leading-[18px] text-[rgba(0,0,0,0.7)]">
                    {sm.service}
                  </span>
                  {sm.relevance && (
                    <ul className="list-disc space-y-3 py-0.5 ps-5 text-[14px] leading-5 text-[rgba(0,0,0,0.5)] marker:text-black/35 sm:ps-5">
                      <li>{sm.relevance}</li>
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Meeting notes panel (Strategy) ───────────────────────────────────────────
const STRATEGY_TABS = ["Approach", "Questions"] as const;
type StrategyTab = typeof STRATEGY_TABS[number];

function MeetingNotesPanel({ call }: { call: CallData }) {
  const [activeTab, setActiveTab] = useState<StrategyTab>("Approach");
  const approachTurn = call.turns.find((t) => /approach/i.test(t.label));
  const questions = call.meetingNotes.discoveryArc ?? [];

  return (
    <div className="flex min-h-0 flex-col gap-6">
      <div className="flex flex-shrink-0 gap-1 border-b border-black/[0.12]">
        {STRATEGY_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "relative px-2 py-3 text-[14px] font-medium transition-colors",
              activeTab === tab ? "text-[rgba(0,0,0,0.9)]" : "text-[rgba(0,0,0,0.5)] hover:text-[rgba(0,0,0,0.65)]",
            )}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute inset-x-0 bottom-0 h-[1.5px] rounded-full bg-[rgba(0,0,0,0.9)]" />
            )}
          </button>
        ))}
      </div>

      {activeTab === "Approach" && (
        <div className="min-h-0 flex-1 overflow-y-auto">
          {call.meetingNotes.salesPlayBlocks && call.meetingNotes.salesPlayBlocks.length > 0 ? (
            <div className="flex flex-col gap-9">
              {call.meetingNotes.salesPlayBlocks.map((block) => (
                <div key={block.eyebrow} className="flex flex-col gap-1">
                  <p className="text-[12px] uppercase tracking-[1px] text-[rgba(0,0,0,0.5)]">{block.eyebrow}</p>
                  <p className="text-[14px] font-medium leading-[1.7] text-[rgba(0,0,0,0.5)]">
                    {block.segments.map((seg, i) =>
                      seg.italic ? (
                        <span key={i} className="italic text-[rgba(0,0,0,0.71)]">{seg.text}</span>
                      ) : (
                        <span key={i}>{seg.text}</span>
                      ),
                    )}
                  </p>
                </div>
              ))}
            </div>
          ) : call.meetingNotes.approachSections && call.meetingNotes.approachSections.length > 0 ? (
            <div className="flex flex-col gap-4">
              {call.meetingNotes.approachSections.map(({ label, text }) => (
                <div key={label}>
                  <p className="mb-1 text-[10.5px] font-semibold uppercase tracking-widest text-slate-400">{label}</p>
                  <p className="text-[13px] leading-relaxed text-slate-700">{text}</p>
                </div>
              ))}
            </div>
          ) : approachTurn ? (
            <p className="text-[13px] leading-relaxed text-slate-700">{approachTurn.text}</p>
          ) : (
            <p className="text-[13px] italic text-slate-400">No approach notes available.</p>
          )}
        </div>
      )}

      {activeTab === "Questions" && (
        <div className="flex-1 min-h-0 overflow-y-auto">
          {questions.length > 0 ? (
            <div className="flex flex-col gap-3">
              {questions.map((q, i) => (
                <div key={i} className="flex gap-2.5">
                  <span className="mt-1 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-[9px] font-bold text-blue-500">{i + 1}</span>
                  <p className="text-[13px] font-semibold leading-snug text-slate-900">{q.question}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] italic text-slate-400">No questions defined.</p>
          )}
        </div>
      )}
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
  const lead = call.conversationRecap.panelLead ?? call.conversationRecap.summary;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-[14px] font-normal leading-[1.7] text-[rgba(0,0,0,0.5)]">{lead}</p>

      <div className="flex flex-col overflow-hidden rounded-xl bg-white">
        {messages.map((r, i) => {
          const initial = r.person.trim()[0]?.toUpperCase() ?? "?";
          const color = avatarColor(r.person);
          return (
            <div key={i} className={cn("px-3 py-3.5", i > 0 && "border-t border-black/[0.08]")}>
              <div className="flex items-start gap-3">
                <div className={cn("mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white", color)}>
                  {initial}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <GmailIcon className="h-[13px] w-[13px] flex-shrink-0" />
                    <p className="text-[13px] font-semibold text-slate-900">{r.person}</p>
                    <span className="ml-auto flex-shrink-0 text-[11.5px] text-slate-500">{r.timestamp}</span>
                  </div>
                  <p className="mt-0.5 text-[11.5px] text-slate-500">{r.email}</p>
                  <div className="mt-2.5 flex flex-col gap-2 border-t border-black/[0.06] pt-2.5">
                    {r.note.split("\n\n").map((para, pi) => (
                      <p key={pi} className="whitespace-pre-line text-[13px] leading-relaxed text-slate-700">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
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
      <ul className="flex flex-col gap-6">
        {call.relatedNews.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-[14px] leading-relaxed text-[rgba(0,0,0,0.5)]">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-black/35" aria-hidden />
            <span className="min-w-0 flex-1">{item.headline}</span>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-[3px] inline-flex shrink-0 items-center gap-1 rounded-full bg-[rgba(0,0,0,0.08)] px-2 py-0.5 text-[10px] font-medium text-[rgba(0,0,0,0.5)] transition-colors hover:bg-black/[0.12]"
            >
              <LinkedInIcon className="h-2.5 w-2.5 text-[#0a66c2]" />
              View source
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Geo presence card — Related Work › Geographical Presence (Figma split card) ─
function GeoPresenceCardBlock({ card }: { card: GeoPresenceCard }) {
  const proj = card.project;
  const detailRows = [
    { key: "Problem", text: proj.problem },
    { key: "What we built", text: proj.whatWeBuilt },
    { key: "Outcome", text: proj.outcome },
    { key: "Why this matters", text: proj.whyItMatters },
  ] as const;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0px_2px_12px_rgba(0,0,0,0.06)]">
      {/* Top ribbon — pale cool gray */}
      <div className="flex flex-col gap-2 bg-[#f8fafc] px-4 py-4">
        <div className="flex min-w-0 items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-[rgba(0,0,0,0.35)]" aria-hidden />
          <p className="text-[14px] font-semibold tracking-[-0.2px] text-[rgba(0,0,0,0.9)]">{card.location}</p>
        </div>
        <div className="flex flex-col gap-1 pl-[1.375rem] sm:pl-6">
          <p className="text-[12px] leading-[1.45] text-[rgba(0,0,0,0.5)]">{card.projectLine}</p>
          <p className="text-[12px] leading-[1.45] text-[rgba(0,0,0,0.5)]">{card.clientDescriptor}</p>
        </div>
      </div>

      {/* Detail stack */}
      <div className="border-t border-black/[0.08] bg-white px-4 pb-4 pt-4">
        <div className="mb-4 flex w-full items-center gap-3">
          {proj.thumbnailSrc ? (
            <a
              href={proj.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative h-[20px] max-w-[96px] shrink-0 overflow-hidden rounded-[5px] mix-blend-exclusion"
            >
              <img alt="" src={proj.thumbnailSrc} className="h-full max-w-[96px] object-cover object-left" />
            </a>
          ) : null}
          <a
            href={proj.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View case study${proj.title ? `: ${proj.title}` : ""}`}
            className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-[32px] border border-black/[0.12] bg-white px-3.5 py-2 text-[14px] font-medium text-[rgba(0,0,0,0.9)] transition-colors hover:bg-black/[0.02] active:scale-[0.98]"
          >
            View
            <ArrowUpRight className="size-[17px] shrink-0 text-[rgba(0,0,0,0.9)] opacity-90" strokeWidth={1.75} />
          </a>
        </div>
        <div className="flex flex-col gap-4">
          {detailRows.map(({ key, text }) => (
            <div key={key} className="flex flex-col gap-1">
              <span className="text-[12px] font-normal uppercase tracking-[1px] text-[rgba(0,0,0,0.5)]">
                {key}
              </span>
              <p className="text-[14px] font-normal leading-[1.5] text-[rgba(0,0,0,0.5)]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Related Work › Suggested Expert — split header / body to match geographical presence rhythm */
function SuggestedExpertPanelBlock({ match, onCompose }: { match: InternalMatch; onCompose: () => void }) {
  const first = match.name.split(" ")[0] ?? match.name;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0px_2px_12px_rgba(0,0,0,0.06)]">
      <div className="flex flex-col gap-3 bg-[#f8fafc] px-4 py-4">
        <div className="min-w-0 flex flex-col gap-2">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
            <p className="min-w-0 text-[16px] font-semibold leading-[22px] tracking-[-0.2px] text-[rgba(0,0,0,0.9)]">{match.name}</p>
            <button
              type="button"
              onClick={onCompose}
              className="inline-flex shrink-0 items-center gap-2 rounded-[32px] bg-[rgba(0,0,0,0.9)] px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-black active:scale-[0.98]"
            >
              <Mail className="h-3.5 w-3.5" />
              Draft email
            </button>
          </div>
          <p className="text-[14px] leading-5 text-[rgba(0,0,0,0.5)]">{match.role}</p>
          {match.matchTags && match.matchTags.length > 0 && (
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {match.matchTags.map((t) => (
                <span
                  key={t}
                  className="shrink-0 rounded-[20px] bg-[rgba(0,0,0,0.08)] px-2 py-px text-[14px] font-medium leading-[18px] text-[rgba(0,0,0,0.7)]"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-5 border-t border-black/[0.08] bg-white px-4 py-4">
        {match.reasoning && (
          <div className="flex flex-col gap-1">
            <p className="text-[12px] font-normal uppercase tracking-[1px] text-[rgba(0,0,0,0.5)]">Why {first}</p>
            <p className="text-[14px] font-normal leading-[1.5] text-[rgba(0,0,0,0.5)]">{match.reasoning}</p>
          </div>
        )}

        {match.contextNote && (
          <div className="flex gap-2.5 rounded-xl border border-black/[0.06] bg-[#f8fafc] px-3.5 py-3">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[rgba(0,0,0,0.35)]" aria-hidden />
            <p className="text-[14px] font-normal italic leading-[1.5] text-[rgba(0,0,0,0.5)]">{match.contextNote}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Compose email modal ───────────────────────────────────────────────────────
function ComposeEmailModal({ match, onClose }: { match: InternalMatch; onClose: () => void }) {
  const [subject, setSubject] = useState(match.emailSubject ?? "");
  const [body, setBody] = useState(match.emailBody ?? "");
  const [sent, setSent] = useState(false);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailConnecting, setGmailConnecting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  function handleConnectGmail() {
    setGmailConnecting(true);
    setTimeout(() => {
      setGmailConnecting(false);
      setGmailConnected(true);
    }, 1200);
  }

  function handleSend() {
    setSent(true);
    setTimeout(() => onClose(), 2000);
  }

  if (!mounted) return null;

  const modal = (
    <>
      <div className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-[3px]" onClick={onClose} />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto w-full max-w-lg mx-4 rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <p className="text-[15px] font-bold text-slate-900">New Message</p>
            <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Gmail connect banner */}
          {!gmailConnected ? (
            <div className="flex items-center justify-between gap-3 bg-slate-50 px-5 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                {/* Gmail G logo */}
                <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <p className="text-[12.5px] text-slate-600">
                  Connect Gmail to send directly from your inbox
                </p>
              </div>
              <button
                onClick={handleConnectGmail}
                disabled={gmailConnecting}
                className="flex-shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11.5px] font-semibold text-slate-700 transition-all hover:border-blue-300 hover:text-blue-700 disabled:opacity-60"
              >
                {gmailConnecting ? "Connecting…" : "Connect Gmail"}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 bg-emerald-50 px-5 py-2.5 border-b border-emerald-100">
              <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <p className="text-[12px] font-semibold text-emerald-700">Gmail connected</p>
              <span className="text-[11px] text-emerald-500">· hassan.malik@tkxel.com</span>
            </div>
          )}

          {/* Fields */}
          <div className="flex flex-col divide-y divide-slate-100">
            {/* To */}
            <div className="flex items-center gap-3 px-5 py-3">
              <span className="w-14 flex-shrink-0 text-[11px] font-semibold uppercase tracking-widest text-slate-400">To</span>
              <p className="text-[13px] text-slate-500">{match.emailTo}</p>
            </div>
            {/* Subject */}
            <div className="flex items-center gap-3 px-5 py-3">
              <span className="w-14 flex-shrink-0 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Subject</span>
              <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="flex-1 text-[13px] text-slate-900 outline-none placeholder:text-slate-300"
              />
            </div>
            {/* Body */}
            <div className="px-5 py-4">
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={10}
                className="w-full resize-none text-[13px] leading-relaxed text-slate-700 outline-none placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
            <p className="text-[11.5px] italic text-slate-400">✨ AI drafted · Edit freely before sending</p>
            <button
              onClick={handleSend}
              disabled={sent}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-semibold transition-all",
                sent
                  ? "bg-emerald-50 text-emerald-700 cursor-default"
                  : "bg-slate-900 text-white hover:bg-slate-800",
              )}
            >
              {sent ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Sent to {match.name.split(" ")[0]} {match.name.split(" ")[1]}
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Send
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </>
  );

  return createPortal(modal, document.body);
}

// ── Related work panel ────────────────────────────────────────────────────────
const RELATED_WORK_TABS = [
  "Relevant Project",
  "Geographical Presence",
  "Suggested Expert",
] as const;
type RelatedWorkTab = typeof RELATED_WORK_TABS[number];

function relatedWorkListingBody(item: RelatedWorkItem): string {
  if (item.panelSummary?.trim()) return item.panelSummary.trim();
  const parts = [item.problem, item.solution].filter(Boolean);
  const merged = parts.join(" ").replace(/\s+/g, " ").trim();
  return merged || item.label;
}

function RelatedWorkListingBlock({ item }: { item: RelatedWorkItem }) {
  const body = relatedWorkListingBody(item);
  return (
    <div className="flex flex-col gap-[7px]">
      <div className="flex w-full items-center justify-between gap-3">
        {item.thumbnailSrc ? (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-[20px] max-w-[96px] shrink-0 overflow-hidden rounded-[5px] mix-blend-exclusion"
          >
            <img alt="" src={item.thumbnailSrc} className="h-full max-w-[96px] object-cover object-left" />
          </a>
        ) : (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-[min(100%,16rem)] truncate text-[12px] font-medium leading-[20px] text-[rgba(0,0,0,0.7)] underline-offset-2 hover:underline"
          >
            {item.label}
          </a>
        )}
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 opacity-90 transition-opacity hover:opacity-100"
          aria-label={`Open ${item.label}`}
        >
          <ArrowUpRight className="size-[17px] shrink-0 text-[rgba(0,0,0,0.9)]" strokeWidth={1.75} />
        </a>
      </div>
      <p
        className="line-clamp-4 text-[14px] font-normal leading-[1.4] text-[rgba(0,0,0,0.5)]"
        title={body}
      >
        {body}
      </p>
    </div>
  );
}

function initialRelatedWorkTab(call: CallData): RelatedWorkTab {
  if (call.geoPresence && call.geoPresence.length > 0) return "Geographical Presence";
  return "Relevant Project";
}

function RelatedWorkPanel({ call }: { call: CallData }) {
  const [activeTab, setActiveTab] = useState<RelatedWorkTab>(() => initialRelatedWorkTab(call));
  const [showCompose, setShowCompose] = useState(false);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      {/* Figma 1958:41799 — 4px between tabs; active underline 1.5px; no container bottom rule */}
      <div className="flex shrink-0 flex-wrap gap-1">
        {RELATED_WORK_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "relative whitespace-nowrap px-2 py-3 text-[14px] font-medium leading-[16px] transition-colors",
              activeTab === tab ? "text-[rgba(0,0,0,0.9)]" : "text-[rgba(0,0,0,0.5)] hover:text-[rgba(0,0,0,0.65)]",
            )}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute inset-x-0 bottom-0 h-[1.5px] rounded-full bg-[rgba(0,0,0,0.9)]" />
            )}
          </button>
        ))}
      </div>

      {/* Figma focus-area-card: 24px between tab block content and stacks; stacks use 7px title-to-body */}
      <div className="min-h-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/10 [&::-webkit-scrollbar-track]:bg-transparent">
      {activeTab === "Relevant Project" && (
        <div className="flex flex-col gap-6">
          {call.relatedWork.map((w, i) => (
            <RelatedWorkListingBlock key={`${w.label}-${i}`} item={w} />
          ))}
        </div>
      )}

      {activeTab === "Geographical Presence" && (
        <div className="flex flex-col gap-6">
          {call.geoPresence && call.geoPresence.length > 0 ? (
            call.geoPresence.map((card, idx) => (
              <GeoPresenceCardBlock key={idx} card={card} />
            ))
          ) : (
            <p className="text-[14px] italic text-[rgba(0,0,0,0.35)]">
              No geographical presence data available for this call.
            </p>
          )}
        </div>
      )}

      {activeTab === "Suggested Expert" && call.internalMatch && (
        <SuggestedExpertPanelBlock match={call.internalMatch} onCompose={() => setShowCompose(true)} />
      )}

      {activeTab === "Suggested Expert" && !call.internalMatch && (
        <p className="text-[14px] italic text-[rgba(0,0,0,0.35)]">No presales expert match available for this call.</p>
      )}
      </div>

      {showCompose && call.internalMatch && (
        <ComposeEmailModal match={call.internalMatch} onClose={() => setShowCompose(false)} />
      )}
    </div>
  );
}

// ── About the client (stack / vendors / signals) ───────────────────────────────
function TechIntelligencePanel({ call }: { call: CallData }) {
  const ti = call.techIntelligence;
  if (!ti) {
    return <p className="text-[14px] italic text-[rgba(0,0,0,0.35)]">No client technology insights available for this call.</p>;
  }
  const synthesisBrief = ti.synthesis.split(/(?<=[.!?])\s+/)[0];
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-2">
        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[rgba(0,0,0,0.35)]" aria-hidden />
        <p className="text-[14px] font-normal leading-[1.7] text-[rgba(0,0,0,0.5)]">{synthesisBrief}</p>
      </div>

      <div className="h-px bg-black/[0.08]" />

      <div>
        <p className="mb-3 text-[12px] font-normal uppercase tracking-[1px] text-[rgba(0,0,0,0.5)]">
          Existing vendors
        </p>
        <div className="flex flex-col overflow-hidden rounded-xl bg-white px-3">
          {ti.vendors.map((v, i) => (
            <div key={i} className={cn("py-3", i > 0 && "border-t border-black/[0.12]")}>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <p className="text-[14px] font-medium text-black">{v.name}</p>
                <span className="rounded-[20px] bg-[rgba(0,0,0,0.08)] px-2 py-0.5 text-[14px] font-medium leading-[18px] text-[rgba(0,0,0,0.7)]">
                  {v.category}
                </span>
              </div>
              <p className="text-[14px] leading-[1.5] text-[rgba(0,0,0,0.5)]">{v.signal}</p>
            </div>
          ))}
        </div>
      </div>

      {ti.hiringSignals && ti.hiringSignals.length > 0 && (
        <div>
          <p className="mb-3 text-[12px] font-normal uppercase tracking-[1px] text-[rgba(0,0,0,0.5)]">
            Hiring signals
          </p>
          <div className="flex flex-col gap-2">
            {ti.hiringSignals.map((signal, i) => (
              <div key={i} className="flex items-start gap-2">
                <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[rgba(0,0,0,0.35)]" aria-hidden />
                <p className="text-[14px] leading-[1.5] text-[rgba(0,0,0,0.5)]">{signal}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Panel drawer ─────────────────────────────────────────────────────────────
const DRAWER_CONFIG: Record<string, { icon: React.ElementType; title: string; accent: string }> = {
  stakeholders: { icon: Users,         title: "Stakeholders", accent: "text-violet-500"  },
  opportunity:  { icon: BarChart2,     title: "Opportunity Analysis", accent: "text-rose-500"    },
  meeting:      { icon: Flag,          title: "Sales Play",            accent: "text-blue-500"    },
  recap:        { icon: MessageCircle, title: "Conversation recap",   accent: "text-emerald-500" },
  work:         { icon: BookOpen,      title: "Related Work",         accent: "text-teal-500"    },
  news:         { icon: Newspaper,     title: "Conversation opener", accent: "text-amber-500"   },
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
            <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-slate-900" />
          )}
        </button>
      ))}
    </div>
  );
}

// ── Stakeholder drawer ────────────────────────────────────────────────────────
/** Expander rail: reuse the grid Stakeholders focus card so expand shows the same Figma-aligned layout (+ Tkxel block). */
function DrawerStakeholders({ call }: { call: CallData }) {
  return (
    <div className="px-6 py-6 pb-8">
      <StakeholdersPanel key={call.id} call={call} />
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
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{item.headline}</p>
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
  const DrawerIcon = cfg.icon;

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
      const answer = `Based on the ${cfg.title.toLowerCase()} for ${call.company}: ${q.endsWith("?") ? "" : "regarding your question, "}this is specific prep context generated from what we know about ${call.person} and their situation. The agent would surface the most relevant detail from this section to answer your question directly.`;
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
        className="fixed inset-0 z-40 bg-[rgba(15,23,42,0.14)] backdrop-blur-[4px]"
        onClick={onClose}
      />
      {/* Drawer — Figma-aligned rail (min-h-0 so flex-1 body scrolls and shows stakeholder content). */}
      <div className="fixed inset-y-0 right-0 z-50 flex h-svh max-h-full min-h-0 w-full max-w-[520px] flex-col bg-white shadow-[-24px_0_64px_rgba(15,23,42,0.14)]">
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-black/[0.08] px-6 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#f7f7f7]">
            <DrawerIcon className={cn("h-[18px] w-[18px]", cfg.accent)} strokeWidth={1.75} />
          </div>
          <h2 className="flex-1 text-[16px] font-semibold leading-[22px] tracking-[-0.2px] text-[rgba(0,0,0,0.9)]">{cfg.title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[rgba(0,0,0,0.4)] transition-colors hover:bg-black/[0.05] hover:text-[rgba(0,0,0,0.72)]"
            aria-label="Close"
          >
            <X className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          {panelId === "stakeholders" && <DrawerStakeholders call={call} />}
          {panelId === "opportunity" && <DrawerOpportunity call={call} />}
          {panelId === "meeting"     && <DrawerMeeting call={call} />}
          {panelId === "recap"       && <DrawerRecap call={call} />}
          {panelId === "work"        && <DrawerWork call={call} />}
          {panelId === "news"        && <DrawerNews call={call} />}
        </div>

        {/* AI ask bar — sticky bottom */}
        <div className="shrink-0 border-t border-black/[0.08] bg-white px-6 pb-6 pt-4">
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
          <div className="flex items-center gap-3 rounded-[32px] border border-black/[0.08] bg-[#f7f7f7] px-4 py-2.5 shadow-[0px_2px_8px_rgba(0,0,0,0.04)] focus-within:border-black/[0.12] focus-within:bg-white focus-within:ring-2 focus-within:ring-black/[0.04] transition-all">
            <Sparkles className="h-[18px] w-[18px] shrink-0 text-[rgba(0,0,0,0.35)]" aria-hidden />
            <input
              value={drawerInput}
              onChange={(e) => setDrawerInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleDrawerSend(); } }}
              placeholder={`Ask anything about ${cfg.title.toLowerCase()}...`}
              className="flex-1 bg-transparent text-[14px] font-light leading-5 text-[rgba(0,0,0,0.65)] outline-none placeholder:text-[rgba(0,0,0,0.35)]"
            />
            <button
              type="button"
              disabled={!drawerInput.trim() || drawerThinking}
              onClick={handleDrawerSend}
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(0,0,0,0.9)] text-white transition-all shadow-sm",
                "disabled:cursor-not-allowed disabled:opacity-30 enabled:active:scale-95 enabled:hover:bg-black",
              )}
              aria-label="Send question"
            >
              <Menu className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Agent response card ───────────────────────────────────────────────────────
// Looks identical to PanelCard. Shows skeleton while thinking, then typewriter.
function AgentResponseCard({
  card,
  onAIFeedbackSubmitted,
}: {
  card: AgentCard;
  onAIFeedbackSubmitted?: () => void;
}) {
  const [typedText, setTypedText] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const feedbackTitle = card.title ?? "Insphere Agent";

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
      className="relative flex h-full flex-col overflow-hidden rounded-[32px] bg-[#f7f7f7] p-5"
      data-panel-card
    >
      <div className="relative flex flex-shrink-0 items-center gap-3">
        <div className="flex shrink-0 items-center justify-center">
          {card.thinking ? (
            <div className="relative">
              <Sparkles className="h-4 w-4 animate-pulse text-[rgba(0,0,0,0.45)]" />
              <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 animate-ping rounded-full bg-black/25" />
            </div>
          ) : (
            <Icon className="h-3.5 w-3.5 text-[rgba(0,0,0,0.45)]" />
          )}
        </div>
        <span className="min-w-0 flex-1 text-[16px] font-semibold leading-[22px] tracking-[-0.2px] text-[rgba(0,0,0,0.9)]">
          {card.thinking ? "Thinking…" : (card.title ?? "Insphere Agent")}
        </span>
        <div className="flex shrink-0 items-center gap-1 print:hidden">
          <div className="drag-handle flex h-8 w-8 cursor-grab items-center justify-center rounded-md text-[rgba(0,0,0,0.25)] transition-colors hover:bg-black/[0.04] hover:text-[rgba(0,0,0,0.45)] active:cursor-grabbing">
            <GripVertical className="size-[14px] shrink-0 text-[rgba(0,0,0,0.35)] opacity-80" strokeWidth={1.75} />
          </div>
          <PanelAIFeedbackMenu
            widgetId={card.id}
            widgetTitle={feedbackTitle}
            onSubmitted={onAIFeedbackSubmitted}
          />
        </div>
      </div>

      {/* Body */}
      <div className="relative mt-4 flex-1 overflow-y-auto pr-1">
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
              <span className="ml-0.5 inline-block animate-[blink_0.9s_steps(2)_infinite] text-[rgba(0,0,0,0.5)]">▋</span>
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
    <div className="fixed bottom-6 left-1/2 z-50 max-w-[min(90vw,22rem)] -translate-x-1/2 animate-[fadeUp_0.25s_ease_both] rounded-2xl border border-slate-200 bg-slate-900 px-4 py-2.5 text-center shadow-xl">
      <p className="text-[13px] font-medium leading-snug text-white">{message}</p>
    </div>
  );
}
