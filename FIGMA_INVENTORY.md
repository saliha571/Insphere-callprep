# Insphere V2 — Figma Design Inventory
**File:** Insphere V2 · Page: 🖥️ Web App V3 🟢  
**Node:** `1003:5407`  
**Source:** https://www.figma.com/design/wt1MWmcve8SXcaiZDZifKZ/Insphere-V2?node-id=1003-5407

---

## 1. APP SCREENS / SECTIONS

| Section | Description | Key Screens |
|---------|-------------|-------------|
| **Authentication** | Entry flows | Login, Sign Up (Onboarding), Forgot Password, Reset Password, Check Email, Set New Password |
| **AE Co-pilot** | AI assistant interface | Co-pilot chat, Query list, Detail list |
| **Lead Enrichment** | CRM lead management | Lead list, Lead Details, Lead Editor, Enrich Lead, Bulk Enrichment, Enriched Leads |
| **RFP Response Agent** | Proposal generation | RFP upload, Agent processing, Response output |
| **Prompt Playground** | Prompt template tool | Browse, Test, Save prompts |
| **People Buddy** | HR / recruitment agent | Candidate list, Interview details, Select Candidates |
| **Pitch Deck** | Deck generation | AI-Generated Artifacts, Slide 16:9 |
| **Analytics** | Usage & reporting | Quick Analytics, Centralized log, Audit logs, Export Audit Report |
| **Application Builder** | Agent configuration | Agent settings, Configuration panel |
| **Audit Buddy** | Audit review agent | Audit logs, Audit review, Case Validator |
| **ClaimMate** | Insurance claims agent | Claim Application, Claim Breakdown, Inspection report, Scheduling |

---

## 2. COLOR STYLES

### 2a. Semantic / CSS Variable Colors (Insphere-specific values)

| Token | CSS Variable | Light Value | Notes |
|-------|-------------|-------------|-------|
| Background | `--background` | `#faf9f4` | Warm off-white (NOT pure white) |
| Foreground | `--foreground` | `#020617` | slate/950 |
| Card | `--card` | — | inherits background |
| Popover | `--popover` | `#ffffff` | pure white |
| Popover Foreground | `--popover-foreground` | `#020617` | |
| Primary | `--primary` | `#2563eb` | blue/600 |
| Primary Foreground | `--primary-foreground` | `#f8fafc` | slate/50 |
| Secondary | `--secondary` | `#f1f5f9` | slate/100 |
| Muted Foreground | `--muted-foreground` | `#64748b` | slate/500 |
| Accent Foreground | `--accent-foreground` | `#0f172a` | slate/900 |
| Destructive | `--destructive` | `#dc2626` | red/600 |
| Destructive Foreground | `--destructive-foreground` | `#f8fafc` | |
| Border | `--border` | `#1e293b` | slate/800 |
| Input | `--input` | `#e2e8f0` | slate/200 |
| Ring | `--ring` | — | via Focus State effect |
| Sidebar Primary | `--sidebar-primary` | `#0f172a` | slate/900 |
| Sidebar Border | `--sidebar-border` | `#020617` | slate/950 |
| Radius | `--radius` | `8px` | base radius (not 6.25rem) |

### 2b. Primitive Color Palette (used in Figma)

**Blue (Primary brand)**
| Stop | Hex |
|------|-----|
| blue/50 | `#eff6ff` |
| blue/100 | `#dbeafe` |
| blue/200 | `#bfdbfe` |
| blue/300 | `#93c5fd` |
| blue/400 | `#60a5fa` |
| blue/500 | `#3b82f6` |
| blue/600 | `#2563eb` ← primary |
| blue/700 | `#1d4ed8` |
| blue/800 | `#1e40af` |
| blue/900 | `#1e3a8a` |
| blue/950 | `#19173d` |

**Slate (Neutrals / Text)**
| Stop | Hex |
|------|-----|
| slate/50 | `#f8fafc` |
| slate/100 | `#f1f5f9` |
| slate/200 | `#e2e8f0` |
| slate/300 | `#cbd5e1` |
| slate/400 | `#94a3b8` |
| slate/500 | `#64748b` |
| slate/600 | `#475569` |
| slate/700 | `#334155` |
| slate/800 | `#1e293b` |
| slate/900 | `#0f172a` |
| slate/950 | `#020617` |

**Gray (UI Gray)**
| Stop | Hex |
|------|-----|
| color/gray/50 | `#eff0f3` |
| color/gray/200 | `#b4bbc6` |
| color/gray/300 | `#929cab` |
| color/gray/400 | `#7d899b` |
| color/gray/500 | `#5c6b82` |
| color/gray/600 | `#546176` |
| color/gray/800 | `#333b4c` |
| color/gray/900 | `#272d37` |
| color/gray/950 | `#030712` |

**Status Colors**
| Name | Hex |
|------|-----|
| success | `#16a34a` (green/600) |
| emerald/500 | `#10b981` |
| Error/600 | `#D92D20` |
| red/500 | `#ef4444` |
| red/600 | `#dc2626` |
| amber/500 | `#f59e0b` |
| amber/600 | `#ffb300` |
| cyan/500 | `#06b6d4` |
| purple/500 | `#a855f7` |
| orange/500 | `#f97316` |
| Indigo/500 | `#6366f1` |

**Brand / Accent**
| Name | Hex |
|------|-----|
| brand/500 | `#545bd1` |
| brand/700 | `#3c4194` |
| blue dark/600 | `#155EEF` |
| Blue/blue-500 | `#5C6B82` |
| Blue/blue-700 | `#414C5C` |
| Blue/blue-900 | `#272D37` |

**Base**
| Name | Hex |
|------|-----|
| base/white | `#ffffff` |
| base/black | `#000000` |
| Content/contentPrimary | `#09090b` |
| Content/contentSecondary | `#71717a` |
| Border/borderPrimary | `#e4e4e7` |
| Background/backgroundPrimary | `#ffffff` |

---

## 3. TYPOGRAPHY STYLES

**Font Families**
| Token | Family |
|-------|--------|
| `font-family/font-sans` (primary) | `SF Pro Display` |
| `font/family/sans` (secondary) | `Inter` |
| `md/Regular/Font-Family` | `Satoshi` |
| `font/family/base` | `SF Pro` |

**Type Scale (font-size / line-height)**
| Token | Size | Line Height |
|-------|------|------------|
| text-xs | 12px | 16px (leading-4) |
| text-sm | 14px | 20px (leading-5) |
| text-base | 16px | 24px (leading-6) |
| text-lg | 18px | 28px (leading-7) |
| text-xl | 20px | 28px (leading-7) |
| text-2xl | 24px | 32px (leading-8) |
| text-3xl | 30px | 36px (leading-9) |
| font/size/xs | 10px | 16px |
| font/size/sm | 12px | 20px |
| font/size/base | 14px | 24px |
| font/size/xl | 18px | 28px |

**Font Weights**
| Token | Value |
|-------|-------|
| font-weight/font-normal | 400 |
| font-weight/font-medium | 500 |
| font-weight/font-semibold | 600 |
| font-weight/font-bold | 700 |

**Named Text Styles (composite)**
| Token | Family | Size | Weight | Line Height | Letter Spacing |
|-------|--------|------|--------|------------|---------------|
| text-sm/leading-5/normal | SF Pro | 14 | 400 | 20 | 0 |
| text-sm/leading-5/medium | SF Pro | 14 | 500 | 20 | 0 |
| text-sm/leading-6/medium | SF Pro | 14 | 500 | 24 | 0 |
| text-sm/leading-6/bold | SF Pro | 14 | 700 | 24 | 0 |
| text-sm/leading-none/medium | SF Pro | 14 | 500 | 1 | 0 |
| text-xs/leading-4/medium | SF Pro | 12 | 500 | 16 | 0 |
| text-xs/leading-4/normal | SF Pro | 12 | 400 | 16 | 0 |
| text-xs/leading-5/medium | SF Pro | 12 | 500 | 20 | 0 |
| text-xs/leading-4/semibold | SF Pro | 12 | 600 | 16 | 0 |
| text-base/leading-6/normal | SF Pro | 16 | 400 | 24 | 0 |
| text-base/leading-none/semibold | SF Pro | 16 | 600 | 1 | 0 |
| text-xl/leading-7/semibold | SF Pro | 20 | 600 | 28 | -0.6 |
| text-xl/leading-7/medium | SF Pro | 20 | 500 | 28 | -0.6 |
| text-2xl/leading-8/semibold | SF Pro | 24 | 600 | 32 | -0.6 |
| text-2xl/leading-8/bold | SF Pro | 24 | 700 | 32 | -0.6 |
| text-3xl/leading-9/semibold | SF Pro | 30 | 600 | 36 | -2.5 |
| text-lg/leading-none/semibold | SF Pro | 18 | 600 | 1 | -2.5 |
| text-xs/normal | Inter | 10 | 400 | 16 | 0.2 |
| text-xs/medium | Inter | 10 | 500 | 16 | 0.2 |
| text-sm/normal | Inter | 12 | 400 | 20 | 0.2 |
| text-sm/medium | Inter | 12 | 500 | 20 | 0.2 |
| text-sm/semibold | Inter | 12 | 600 | 20 | 0.2 |
| text-base/normal | Inter | 14 | 400 | 24 | 0.2 |
| text-base/medium | Inter | 14 | 500 | 24 | 0.2 |
| text-base/semibold | Inter | 14 | 600 | 24 | 0.2 |
| text-xl/medium | Inter | 18 | 500 | 28 | 0.2 |
| Paragraph/Small | Inter | 14 | 500 | 20 | 0 |
| Paragraph/Tiny | Inter | 12 | 500 | 16 | 0 |
| md/regular | Satoshi | 16 | 400 | 24 | 0 |

---

## 4. SPACING TOKENS

| Token | Value |
|-------|-------|
| spacing/0 | 0 |
| spacing/0-5 | 2px |
| spacing/1 | 4px |
| spacing/1-5 | 6px |
| spacing/2 | 8px |
| spacing/2-5 | 10px |
| spacing/3 | 12px |
| spacing/3-5 | 14px |
| spacing/4 | 16px |
| spacing/6 | 24px |
| gap-0 | 0 |
| gap-1 | 4px |
| gap-2 | 8px |
| gap-3 | 12px |
| gap-4 | 16px |
| gap-5 | 20px |
| gap-6 | 24px |
| gap-8 | 32px |
| padding/p-0 | 0 |
| padding/p-0,5 | 2px |
| padding/p-1 | 4px |
| padding/p-1,5 | 6px |
| padding/p-2 | 8px |
| padding/p-2,5 | 10px |
| padding/p-3 | 12px |
| padding/p-4 | 16px |
| padding/p-8 | 32px |
| spacing-xxs | 2px |
| spacing-xs | 4px |
| spacing-md | 8px |
| spacing-lg | 12px |
| spacing-xl | 16px |
| spacing-2xl | 20px |
| spacing-3xl | 24px |
| spacing-4xl | 32px |

---

## 5. BORDER RADIUS TOKENS

| Token | Value |
|-------|-------|
| radius/none | 0 |
| rounded-none | 0 |
| radius/DEFAULT | 4px |
| calc(var(--radius) - 4px) | 4px |
| rounded-md / radius/md | 6px |
| calc(var(--radius) - 2px) | 6px |
| rounded-lg / radius/lg | **8px** ← `--radius` base |
| Border Radius/rounded-lg | 8px |
| radius/xl | 12px |
| radius-m | 12px |
| radius-3xl | 20px |
| rounded-full / radius/full | 9999px |
| radius-full | 9999px |

---

## 6. SHADOW / EFFECT TOKENS

| Token | Value |
|-------|-------|
| `shadows/shadow-sm` | DROP_SHADOW `#0000000D` offset(0,1) radius:2 spread:0 |
| `Box Shadow/shadow-sm` | same as above |
| `shadows/shadow` | DROP_SHADOW `#0000001A` offset(0,1) radius:2-3 |
| `shadows/shadow-md` | DROP_SHADOW `#0000000F` (0,2) r:4 + DROP_SHADOW `#0000001A` (0,0) r:15 s:2 |
| `shadows/shadow-lg` | DROP_SHADOW `#0000001A` (0,4) r:6 + `#0000001A` (0,10) r:15 |
| `shadow/md` | DROP_SHADOW `#0000000F` (0,2) r:4 + `#0000001A` (0,0) r:15 |
| `Shadows/shadow-xs` | DROP_SHADOW `#1018280D` (0,1) r:2 spread:0 |
| `Focus State` | Spread:4 Indigo/500 + spread:2 background + drop-shadow sm |
| `05 - Tab / Selected` | INNER_SHADOW `#1589EE` offset(0,-2) r:0 spread:0 |
| `box-shadow/2 - up` | 3-layer drop shadow upwards |

---

## 7. COMPONENTS

### 7a. Atoms (Primitive UI)

| Component | Variants / Notes |
|-----------|-----------------|
| **Button** | Default, Primary (blue), Ghost, Outline, Link, sizes: sm / md / lg, with icon |
| **Icon Button** | Bordered variant (`⚡ Button Icon - Bordered`) |
| **Input** | Default / Focus / Error / Disabled / Hint states; `📝 Input - Gen AI` variant |
| **Textarea** | Multi-line input |
| **Label** | Label 01–08 (various contexts) |
| **Checkbox Base** | `⚡ Checkbox Toggle (left to right)` |
| **Switch Base** | On / Off states |
| **Toggle Group** | Multi-option selection |
| **Select** | Dropdown trigger + content |
| **Combobox** | Search-enabled select |
| **Badge** | Status indicators, colored variants |
| **Avatar** | Image + fallback initials |
| **Skeleton** | Loading placeholder |
| **Tooltip** | Hover info overlay |
| **Chevron** | Direction indicator icon |
| **Divider / Separator** | Horizontal rule |
| **Tab** | Single tab item |

### 7b. Compound / Layout Components

| Component | Sub-parts |
|-----------|-----------|
| **Tabs** | Tab bar + Tab item + content |
| **Dropdown** | Trigger + Menu |
| **Dropdown Menu** | `.baseComponents/DropdownItem`, `.baseComponents/DropdownDivider`, `.baseComponents/DropdownButton` |
| **Global Header** | Logo + Nav links + User avatar + notifications |
| **Global Navigation** | Top nav bar |
| **Sidebar** | SidebarBody + SidebarSection + SidebarItem + SidebarFooter (256px wide) |
| **Sidebar Item** | `.baseComponents/SidebarItem` (icon + label, 36px height) |
| **Table Base** | Table Base / Cell, Table cell — data grid foundation |
| **Card** | Card Title + Card Description + Card Content + Card Container |
| **Breadcrumb** | Breadcrumb + Breadcrumb link |
| **Field / Form Field** | `Field State / Default` — label + input + helper text |

### 7c. Specialized / Feature Components

| Component | Context |
|-----------|---------|
| **`📝 Activity - Call`** | Activity feed entry |
| **`📝 Docked Utility Bar`** | Fixed bottom action bar |
| **`_Activity-content`** | Activity content block |
| **`_Item`** | Generic list item |
| **`action chips`** | Quick-action tag |
| **`filter tab`** | Tab-style filter |
| **`Continue with Google / Left Aligned / Fixed`** | OAuth button variant |
| **`Type`** | Typography display block |

### 7d. Icon Libraries Used

**Lucide Icons** (primary icon set)
`arrow-right` · `badge-check` · `brain-circuit` · `building` · `calendar-days` · `camera` · `chart-pie` · `chevron-down` · `chevron-left` · `chevron-right` · `circle-arrow-out-up-right` · `circle-plus` · `circle-user` · `circle-x` · `clipboard-pen-line` · `cloud-upload` · `database` · `download` · `ellipsis` · `expand` · `file-question` · `file-text` · `files` · `filter` · `folder-closed` · `globe` · `graduation-cap` · `history` · `inbox` · `info` · `lightbulb` · `link` · `log-out` · `mail` · `megaphone` · `message-circle-more` · `message-square-share` · `message-square-text` · `mic` · `moon` · `network` · `panel-left-open` · `paperclip` · `phone` · `plus` · `presentation` · `search` · `settings` · `shield` · `sparkles` · `square-arrow-up-right` · `square-check` · `square-menu` · `square-pen` · `sun` · `thumbs-down` · `thumbs-up` · `trash-2` · `triangle-alert` · `upload` · `user` · `user-round` · `user-round-cog` · `user-search` · `users` · `x`

**Social Icons**
`Figma` · `Gmail` · `Google Docs` · `Google Drive` · `LinkedIn` · `Outlook` · `WhatsApp` · `TikTok` · `Facebook`

**Heroicons (mini)**
`home` · `chevron-up`

**Tabler Icons**
Various (referenced as `Tabler Icons`)

**Utility / Standard Icons**
`Standard Icons / A / account` · `Utility Icons / A / agent_astro`

---

## 8. SIDEBAR NAVIGATION ITEMS

From the live Sidebar frame (node `4767:26146`, 256×840):

| Icon | Label |
|------|-------|
| `heroicons-mini/home` | Home |
| `message-circle-more` | (Co-pilot / Messages) |
| `user-round` | (Profile / People) |
| `message-square-share` | AE Co-pilot |
| `presentation` | (Pitch Deck / RFP) |
| (blank) | — |
| `users` | People Buddy |
| `presentation` | RFP Response Agent |
| `presentation` | Prompt Playground |
| (blank) | — |
| `presentation` | (Content/Campaign) |
| `user-search` | Lead Enrichment |
| `megaphone` | (Marketing) |
| (blank) | — |
| `clipboard-pen-line` | Audit Buddy |
| (blank) | — |
| (blank) | — |
| `chart-pie` | Analytics |
| `user-round-cog` | Settings / Account |
| `sparkles` | AI Agents |

---

## 9. KEY DESIGN DECISIONS (from Figma)

| Decision | Value |
|----------|-------|
| Base radius | **8px** (not 6px/10px) |
| Background | **`#faf9f4`** (warm off-white, not pure white) |
| Primary color | **`#2563eb`** (blue/600) |
| Font stack | **SF Pro Display** → Inter → Satoshi fallback |
| Icon set | **Lucide Icons** (primary) |
| Sidebar width | **256px** |
| Sidebar item height | **36px** |
| Input height | **36–40px** (9–10 spacing units) |
| Focus ring style | Indigo/500 4px spread + 2px background gap |
| Letter spacing (heading) | **-0.6px** for 2xl+, **-2.5px** for 3xl |
