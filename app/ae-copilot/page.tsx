"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowRight,
  Building,
  Database,
  Globe,
  History,
  Mic,
} from "lucide-react";

// ── Figma localhost assets ─────────────────────────────────────────────────────
const imgAvatar =
  "http://localhost:3845/assets/f38480e01909d57a7346fd3bb780c1e3d786d292.png";
const imgEllipseBg =
  "http://localhost:3845/assets/4107989a57f798f804cc8cd53f0b97c3451e67a2.svg";
const imgInsphereLogoGroup =
  "http://localhost:3845/assets/58d073b90954a572cb2d885f1322914dd56c9a35.svg";
const imgAECopilotIcon =
  "http://localhost:3845/assets/b38a0a3828146ac727f7de5ac56956adf133b02b.svg";
const imgTablerBilibili =
  "http://localhost:3845/assets/516ef21f0ca26aa81e755655fa65a991dcff8237.svg";
const imgTablerLayersIntersect =
  "http://localhost:3845/assets/377f641dfa105f0cfb47dff93d10d62123205af2.svg";
const imgChevronUp =
  "http://localhost:3845/assets/fa6ecd9dd434595fd769c3f734bcb7275a5bfdea.svg";

// Chrome web store icon layers
const imgChromeV1 =
  "http://localhost:3845/assets/1024b62b3a353b8874bcb44dc1b7ae465b7de6ce.svg";
const imgChromeV2 =
  "http://localhost:3845/assets/b38a0a3828146ac727f7de5ac56956adf133b02b.svg";
const imgChromeV3 =
  "http://localhost:3845/assets/c00e69a869b95376f30e9c4c8191d4ca550367fc.svg";

// ── Types ─────────────────────────────────────────────────────────────────────

const navItems = [
  { label: "AE Co-pilot", active: true },
  { label: "Lead Enrichment" },
  { label: "RFP Response Agent" },
  { label: "Pitch Deck Generator" },
];

const suggestionChips = [
  { icon: Building, label: "Company Info" },
  { icon: Database, label: "Past Project" },
  { icon: Globe, label: "Web Search" },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function AECopilotPage() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* ── SIDEBAR ────────────────────────────────────────────────────────── */}
      <aside className="flex h-full w-64 flex-shrink-0 flex-col justify-between">
        <div className="flex flex-col gap-2">
          {/* Top section — back button + nav */}
          <div className="flex flex-col gap-5 p-4">
            {/* Back arrow */}
            <button
              className={cn(
                "flex h-7 w-7 items-center justify-center",
                "rounded-full border border-slate-300",
                "transition-colors hover:bg-slate-50",
              )}
            >
              <ArrowLeft className="h-4 w-4 text-slate-700" />
            </button>

            {/* Top nav items */}
            <div className="flex flex-col">
              <SidebarItem
                icon={
                  <img src={imgTablerBilibili} alt="" className="h-5 w-5" />
                }
                label="AI Agents"
              />
              <SidebarItem
                icon={
                  <img
                    src={imgTablerLayersIntersect}
                    alt=""
                    className="h-5 w-5"
                  />
                }
                label="Integration"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="px-4 py-1">
            <div className="h-px w-full bg-[#e4e4e7]" />
          </div>

          {/* Featured agents section */}
          <div className="flex flex-col p-4">
            {/* Section label */}
            <div className="px-2 py-2">
              <span className="text-[12px] font-medium leading-5 text-[#71717a]">
                Featured Agents
              </span>
            </div>

            {/* Nav items */}
            {navItems.map((item) => (
              <SidebarNavItem
                key={item.label}
                label={item.label}
                active={item.active}
              />
            ))}

            {/* Bottom section label */}
            <div className="px-2 py-2">
              <span className="text-[12px] font-medium leading-5 text-[#71717a]">
                Featured Agents
              </span>
            </div>
          </div>
        </div>

        {/* ── SIDEBAR FOOTER ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-2">
          {/* Chrome extension promo */}
          <div className="mx-4 rounded-lg bg-blue-50 p-4">
            <div className="flex items-center gap-3">
              {/* Chrome icon (multi-layer SVG) */}
              <div className="relative h-[33px] w-[38px] flex-shrink-0 drop-shadow-sm">
                <img
                  src={imgChromeV1}
                  alt=""
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold leading-5 text-[#19173d]">
                    Insphere for Chrome
                  </span>
                  <button className="flex items-center justify-center rounded-full p-0.5 transition-colors hover:bg-blue-100">
                    <ArrowUpRight className="h-4 w-4 text-[#19173d]" />
                  </button>
                </div>
                <span className="text-[12px] font-normal leading-4 text-slate-700">
                  Available on Web Store
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="px-4 py-1">
            <div className="h-px w-full bg-[#e4e4e7]" />
          </div>

          {/* User dropdown */}
          <div className="p-4">
            <button className="flex w-full items-center justify-between overflow-hidden rounded-lg px-2 py-2 transition-colors hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <img
                  src={imgAvatar}
                  alt="Erica"
                  className="h-10 w-10 flex-shrink-0 rounded-md object-cover"
                />
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-[14px] font-medium leading-5 text-[#71717a]">
                    Erica
                  </span>
                  <span className="text-[12px] font-medium leading-4 text-[#71717a]">
                    erica@example.com
                  </span>
                </div>
              </div>
              <img src={imgChevronUp} alt="" className="h-5 w-5 flex-shrink-0" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ───────────────────────────────────────────────────── */}
      <main
        className={cn(
          "relative m-2 flex flex-1 flex-col overflow-hidden",
          "rounded-lg border border-slate-200",
          "bg-[#f4f9ff]",
          "shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]",
        )}
      >
        {/* Decorative ellipse background */}
        <div
          className="pointer-events-none absolute"
          style={{ left: 270, top: 315, width: 1204, height: 1204 }}
        >
          <img
            src={imgEllipseBg}
            alt=""
            className="h-full w-full opacity-60"
          />
        </div>

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <header className="relative z-10 flex items-center justify-between border-b border-slate-200/60 px-6 py-3">
          {/* Insphere logo */}
          <div className="h-6 w-[104px]">
            <img src={imgInsphereLogoGroup} alt="Insphere" className="h-full" />
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-2">
            <button
              className={cn(
                "flex min-w-[80px] items-center gap-1 overflow-hidden",
                "rounded-lg bg-white px-4 py-2",
                "shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]",
                "text-[14px] font-medium leading-6 text-[#020617]",
                "transition-colors hover:bg-slate-50",
              )}
            >
              <History className="h-4 w-4" />
              <span className="pl-1">view history</span>
            </button>

            <button
              className={cn(
                "flex min-w-[80px] items-center justify-center",
                "rounded-lg bg-[var(--primary)] px-4 py-2",
                "text-[14px] font-medium leading-6 text-white",
                "transition-colors hover:bg-blue-700",
              )}
            >
              New Chat
            </button>
          </div>
        </header>

        {/* ── CENTER CONTENT ─────────────────────────────────────────────── */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-between pb-6">
          {/* Hero area */}
          <div className="flex w-full flex-col items-center gap-[84px] px-40 pt-[120px]">
            {/* AE Co-pilot title */}
            <div className="flex items-center gap-3">
              <img
                src={imgAECopilotIcon}
                alt=""
                className="h-6 w-6 flex-shrink-0"
              />
              <span
                className={cn(
                  "text-[24px] font-medium leading-none",
                  "tracking-[-0.6px] text-slate-800",
                )}
              >
                AE Co-pilot
              </span>
            </div>

            {/* Greeting + headline */}
            <div className="flex flex-col items-center gap-[21px]">
              <div className="flex flex-col items-center gap-[9px] leading-none">
                <p className="text-center text-[24px] font-light tracking-[-0.6px] text-slate-800">
                  Hi there, Maaz
                </p>
                <p
                  className="whitespace-nowrap text-[42px] font-light tracking-[-1.05px]"
                  style={{
                    background:
                      "linear-gradient(to right, #1e293b 0%, #0924ad 89.46%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  What would you like to know!
                </p>
              </div>

              {/* Suggestion chips */}
              <div className="flex items-center gap-3">
                {suggestionChips.map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className={cn(
                      "flex items-center gap-2 overflow-hidden",
                      "rounded-[20px] border border-slate-300",
                      "px-4 py-1.5",
                      "backdrop-blur-[15px]",
                      "shadow-[0px_3px_11px_0px_rgba(0,0,0,0.04)]",
                      "text-[14px] font-normal leading-6 text-slate-900",
                      "transition-colors hover:bg-white/60",
                    )}
                  >
                    <Icon className="h-4 w-4 text-slate-700" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── CHAT INPUT ─────────────────────────────────────────────── */}
          <div className="flex w-full items-center justify-center px-6">
            <div
              className={cn(
                "relative flex w-[720px] items-center justify-between",
                "rounded-[38px] border border-[#e3edff]",
                "p-2",
                "drop-shadow-[0px_3px_6px_rgba(0,0,0,0.04)]",
              )}
              style={{
                background:
                  "linear-gradient(175.26deg, rgba(255,255,255,0.9) 13.37%, rgba(255,255,255,0.35) 76.16%)",
                backdropFilter: "blur(15.76px)",
              }}
            >
              {/* Input text */}
              <div className="flex flex-1 items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="How i can help you"
                  className={cn(
                    "flex-1 bg-transparent px-3",
                    "text-[14px] font-light leading-normal tracking-[-0.6px]",
                    "text-slate-600 placeholder:text-slate-400",
                    "outline-none",
                  )}
                />
              </div>

              {/* Right actions */}
              <div className="flex flex-shrink-0 items-center gap-2.5">
                {/* Mic button */}
                <button
                  className={cn(
                    "flex h-8 w-8 items-center justify-center",
                    "rounded-[36px] border border-slate-300",
                    "transition-colors hover:bg-white/80",
                  )}
                >
                  <Mic className="h-4 w-4 text-slate-600" />
                </button>

                {/* Send button */}
                <button
                  className={cn(
                    "flex h-8 w-8 items-center justify-center",
                    "rounded-[36px] bg-[#0f172a]",
                    "transition-colors hover:bg-slate-700",
                  )}
                >
                  <ArrowRight className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SidebarItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex w-56 items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-slate-50">
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-[14px] font-medium leading-5 text-[#09090b]">
        {label}
      </span>
    </div>
  );
}

function SidebarNavItem({
  label,
  active,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <div className="relative flex w-56 items-center">
      {/* Active indicator bar */}
      {active && (
        <div className="absolute -left-4 h-5 w-[3px] rounded-full bg-[#09090b]" />
      )}
      <div
        className={cn(
          "flex w-full items-center rounded-lg px-2 py-2",
          "transition-colors",
          active
            ? "bg-slate-100"
            : "hover:bg-slate-50",
        )}
      >
        <span
          className={cn(
            "text-[14px] font-medium leading-5",
            active ? "text-[#09090b]" : "text-[#09090b]",
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
