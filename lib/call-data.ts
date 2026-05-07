// ── Types ─────────────────────────────────────────────────────────────────────
export type CallType = "disco" | "predc";
export type Readiness = "complete" | "in-progress" | "gap-flagged" | "not-started";

export interface Stakeholder {
  name: string;
  role: string;
  initials: string;
  color: string;
  linkedin?: string;
  // Drawer-only fields
  technicalLevel?: "Technical" | "Semi Technical" | "Non Technical";
  summary?: string;
  education?: { degree: string; institution: string; year?: string }[];
  previousCompanies?: { name: string; role: string; duration?: string }[];
  keyInsights?: string[];
}

export interface RelatedWorkItem {
  label: string;
  href: string;
  problem?: string;
  solution?: string;
  aiRelevance?: string;
}

export interface AgentTurn {
  label: string;
  text: string;
  relatedWork?: RelatedWorkItem[];
}

export interface CallData {
  id: string;
  company: string;
  person: string;
  role: string;
  type: CallType;
  readiness: Readiness;
  /** Call quality/priority rating out of 5 */
  rating: number;
  verdict: string;
  snapshot: string;
  /** Full prose description shown in the detail page hero */
  description?: string;
  website: string;
  datetime: string;
  remaining: string;
  section: "today" | "tomorrow";
  companyDetails: {
    employees: string;
    revenue: string;
    industry: string;
    website?: string;
    /** Pipeline / deal value */
    tcv?: string;
    /** Number of active services / engagements */
    services?: string;
    /** Days/weeks since last touch */
    lastEngagement?: string;
    /** CRM health score label */
    accountHealth?: string;
  };
  stakeholders: Stakeholder[];
  opportunityAnalysis: {
    // Panel card fields (unchanged)
    recap: string;
    roadblock: string;
    nextMilestone: string;
    upsell: string;
    // Drawer-only fields
    whyTalkingToUs: string;
    problemInTheirWords: string;
    whatTheyHaveTried: string;
    whatWinLooksLike: string;
    unlockQuestion: string;
    dealRisk: string;
    whatToAvoid: string[];
  };
  meetingNotes: {
    // Panel card fields (unchanged)
    goals: string[];
    discussionTopics: string[];
    // Drawer-only fields
    callGoalOneSentence: string;
    howToOpen: string;
    discoveryArc: { question: string; purpose: string }[];
    pivotMoment: { signal: string; pivot: string };
    howToClose: string;
    thingsGoWrong: { scenario: string; response: string }[];
  };
  conversationRecap: {
    // Panel card fields (unchanged)
    summary: string;
    subject: string;
    recent: { person: string; email: string; timestamp: string; note: string }[];
    // Drawer-only fields
    whatHasBeenSaid: string;
    mostImportantThing: string;
    commitmentsMade: string;
    communicationStyle: string;
    oneThing: string;
  };
  relatedNews: {
    items: {
      headline: string;
      source: string;
      href: string;
      context: string;
      howToUse: string;
    }[];
    whatNotToDo: string;
    tkxelSignals?: string;
  };
  relatedWork: RelatedWorkItem[];
  turns: AgentTurn[];
}

// ── Q&A Bank ─────────────────────────────────────────────────────────────────
export const QA_BANK = [
  {
    keywords: ["avoid", "not say", "should not", "shouldnt", "warn"],
    response:
      "The single thing not to say is anything that positions Tkxel as a vendor. The moment you reference deliverables, timelines, or pricing unprompted, you break the frame. Keep the conversation in their world — their problems, their constraints — until they ask you to shift it.",
  },
  {
    keywords: ["proof point", "project", "built", "case study", "reference", "done"],
    response:
      "The strongest proof point is the document processing pipeline we built for an insurance advisory firm — three-day due diligence reports down to four hours. Use it as a question, not a story: 'What is the part of your process that costs you the most time?' Let them describe it. Then mirror it back.",
  },
  {
    keywords: ["competitor", "competition", "alternative"],
    response:
      "Do not deflect and do not trash competitors. Acknowledge briefly, then pivot: 'Most tools give you data. What we do is build the infrastructure that makes your team faster at using that data.' Then return to their problem.",
  },
  {
    keywords: ["question", "discovery", "ask", "find out"],
    response:
      "Four questions to prioritise: (1) What does your current process look like end-to-end? (2) Where does the most time get lost? (3) Have you worked with a technology partner before? (4) What triggered this conversation — inbound or outreach? That last one tells you where they are in the buying process.",
  },
  {
    keywords: ["close", "next step", "end", "follow up", "wrap"],
    response:
      "Close directly. Give them a binary choice: 'The logical next step is a 45-minute technical scoping call. Does Thursday or Friday work?' Make it easy to say yes. Do not ask open-ended questions at the close.",
  },
  {
    keywords: ["stakeholder", "who", "room", "attendee", "people"],
    response:
      "Based on the profile, expect the primary contact and possibly one or two operational colleagues. Establish who is in the room in the first two minutes — ask directly. The level of technical seniority in the room should change how you present Tkxel's capabilities.",
  },
  {
    keywords: ["price", "cost", "budget", "fee", "investment"],
    response:
      "Do not discuss pricing in a discovery call. If they raise it, acknowledge it and park it: 'That's definitely a conversation we'll have — once we understand the scope, we can put a number on it that actually makes sense for you.' Then redirect to their problem.",
  },
];

// ── Data ──────────────────────────────────────────────────────────────────────
export const CALLS: CallData[] = [
  {
    id: "andy",
    company: "NewCo Risk",
    person: "Andy Harbut",
    role: "Co-Founder",
    type: "disco",
    readiness: "complete",
    rating: 4,
    verdict:
      "Not buying a platform — buying a force multiplier. Lead with outcomes. He will be moved by whether you understand his world, not by credentials.",
    snapshot: "Insurance & risk advisory · PE firms · 6 employees · $5M revenue",
    description:
      "NewCo Risk is a 6-person boutique providing insurance and risk exposure assessment to PE firms during acquisitions. Andy founded it after 20 years at Symphony Risk Solutions and is exploring whether automation can scale their due diligence capacity.",
    website: "newcorisk.com",
    datetime: "Today · 3:00 PM",
    remaining: "2h 14m",
    section: "today",
    companyDetails: {
      employees: "6",
      revenue: "$5M",
      industry: "Insurance & Risk Advisory",
      website: "https://newcorisk.com",
      tcv: "New",
      services: "0",
      lastEngagement: "First call",
      accountHealth: "New",
    },
    stakeholders: [
      {
        name: "Andy Harbut",
        role: "Co-Founder",
        initials: "AH",
        color: "bg-blue-600",
        linkedin: "#",
        technicalLevel: "Non Technical",
        summary: "Andy Harbut co-founded NewCo Risk after 20 years at Symphony Risk Solutions, where he led the firm's PE advisory practice. He built NewCo to run a boutique focused on depth over scale — six analysts, all sector-specialist. His background is entirely commercial and domain-driven; he evaluates technology through the lens of client outcomes, not architectural elegance. He responds well to expertise and directness, poorly to pitches.",
        education: [
          { degree: "MBA, Finance", institution: "Wharton School, University of Pennsylvania", year: "2002" },
          { degree: "BA, Economics", institution: "Georgetown University", year: "1998" },
        ],
        previousCompanies: [
          { name: "Symphony Risk Solutions", role: "Head of PE Advisory", duration: "14 years" },
          { name: "Marsh & McLennan", role: "Senior Risk Consultant", duration: "4 years" },
          { name: "Aon", role: "Risk Analyst", duration: "2 years" },
        ],
        keyInsights: [
          "Evaluates vendors on domain credibility first — credentials second.",
          "Built NewCo specifically to avoid the operational overhead of larger firms; automation that adds process will not land.",
          "Mentioned 'force multiplier' in prior communication — mirror this framing.",
          "Decision-maker and budget holder; Rachel Torres may co-sign on operational fit.",
        ],
      },
      {
        name: "Rachel Torres",
        role: "Head of Operations",
        initials: "RT",
        color: "bg-violet-500",
        technicalLevel: "Semi Technical",
        summary: "Rachel Torres oversees day-to-day operations at NewCo Risk, including workflow management, analyst resourcing, and vendor coordination. She is the person most directly affected by the doc review bottleneck — her team absorbs the manual overhead on every mandate. She has exposure to operational tooling and understands automation in principle, though her background is not engineering.",
        education: [
          { degree: "BSc, Business Administration", institution: "NYU Stern", year: "2011" },
        ],
        previousCompanies: [
          { name: "NewCo Risk", role: "Head of Operations", duration: "3 years" },
          { name: "AIG", role: "Operations Manager", duration: "5 years" },
        ],
        keyInsights: [
          "Likely the most important stakeholder for implementation decisions post-sale.",
          "If Andy is warm but Rachel has reservations, the scoping call will stall.",
          "Ask Andy who else would join the scoping call — Rachel's name should come up.",
        ],
      },
      {
        name: "James Okafor",
        role: "Senior Risk Analyst",
        initials: "JO",
        color: "bg-teal-500",
        technicalLevel: "Non Technical",
        summary: "James Okafor is a senior member of the NewCo risk team with deep domain expertise in insurance exposure for PE acquisitions. He is unlikely to be a decision-maker in this conversation but will be an end-user of any automation deployed. His buy-in matters for adoption — solutions that change his workflow without improving his output will face resistance.",
        education: [
          { degree: "MSc, Risk Management", institution: "Cass Business School", year: "2015" },
        ],
        previousCompanies: [
          { name: "NewCo Risk", role: "Senior Risk Analyst", duration: "2 years" },
          { name: "Willis Towers Watson", role: "Risk Analyst", duration: "4 years" },
        ],
        keyInsights: [
          "End-user perspective — any tool needs to visibly reduce his workload, not add reporting overhead.",
          "Not expected to be on today's call; relevant for scoping and implementation.",
        ],
      },
    ],
    opportunityAnalysis: {
      recap:
        "NewCo Risk handles insurance and risk exposure assessment for PE firms pre-acquisition. Andy is exploring whether a technology partner can reduce the manual overhead in their due diligence workflow.",
      roadblock:
        "No current tech partner. All due diligence reporting is manual — takes 3 days per report. Andy is sceptical of generic SaaS tools.",
      nextMilestone:
        "Discovery call → establish credibility → propose 45-min technical scoping call with Andy and Rachel.",
      upsell:
        "Ongoing pipeline maintenance contract once initial automation is deployed. Potential expansion to client-facing reporting dashboard.",
      whyTalkingToUs:
        "A referral from Raheel Siddiqui — a mutual PE contact — put Andy on Hassan's radar. The trigger was not a product search; it was a frustration Andy had been voicing about the doc review bottleneck during a busy acquisition season. He replied to the outreach quickly, which signals the pain is live. He is coming into this call to find out whether Tkxel understands his world well enough to be trusted, not to evaluate a demo.",
      problemInTheirWords:
        "\"We're in the middle of a busy season and the doc review bottleneck is a real pain point right now.\"",
      whatTheyHaveTried:
        "Andy founded NewCo Risk after 20 years at Symphony Risk Solutions. He has seen large-firm tooling and left it behind deliberately — he built a boutique because he wanted to win on depth. The implied history is that generic SaaS tools were either too broad, too slow to configure, or not trusted by PE clients. No explicit prior vendor is mentioned, but his scepticism of \"generic\" tools is baked into how he describes the firm's identity.",
      whatWinLooksLike:
        "Andy walks away believing Tkxel has done this before for a firm like his, understands the PE due diligence context without needing to be educated, and has a clear proposed first step that does not require him to manage a vendor. A win is a committed date for a scoping call — not a follow-up email.",
      unlockQuestion:
        "What does the three-day report process actually look like end-to-end — where does most of the time go?",
      dealRisk:
        "Andy does not chase. If you leave without a committed next step and a date, the conversation ends here — he will not follow up on vague promises. Competitor risk is real: the first firm to demonstrate genuine domain understanding wins the framing. The biggest internal risk is that Hassan has oversold Tkxel in the introduction, leaving Andy with inflated expectations that today's call cannot meet.",
      whatToAvoid: [
        "Do not bring up pricing or timelines unprompted — any mention before he has confirmed the problem breaks the frame",
        "Do not position Tkxel as a SaaS product or platform — he chose boutique specifically to avoid platform overhead",
        "Do not reference company size — Andy does not think of NewCo Risk as small; it is depth-focused, not undersized",
        "Do not over-reference his LinkedIn activity — quoting his posts reads as surveillance, not preparation",
        "Do not pitch before he has described the problem in his own words — the credibility you build in the first half is what earns you the right to present",
      ],
    },
    meetingNotes: {
      goals: [
        "Establish credibility through domain understanding, not credentials",
        "Surface the bottleneck in their due diligence cycle",
        "Agree a concrete next step before the call ends",
      ],
      discussionTopics: [
        "Current state of their due diligence workflow — where time is lost",
        "The document processing pipeline we built for a comparable insurance advisory firm",
        "What a force multiplier looks like for a 6-person boutique",
        "Who else is involved in evaluating technology decisions",
      ],
      callGoalOneSentence:
        "Leave the call with Andy's confirmation of the specific bottleneck and a committed date for a 45-minute scoping call.",
      howToOpen:
        "\"Andy, Raheel mentioned you've been thinking about this for a while — I don't want to assume I know what the problem looks like from the inside. Can you walk me through what a busy week actually looks like for your team when a new deal comes in?\"",
      discoveryArc: [
        {
          question: "What does the due diligence process look like end-to-end when a new mandate comes in?",
          purpose: "Maps the full workflow before you identify the break point. Shows you understand there is a process — not just a pain.",
        },
        {
          question: "Where does the most time go — and whose time is it?",
          purpose: "Locates the bottleneck and tells you whether it is an analyst problem or a founder problem. Changes who you pitch the solution to.",
        },
        {
          question: "Have you looked at ways to address this before, internally or with outside help?",
          purpose: "Surfaces prior attempts. If he has tried something and it failed, that failure is the real objection. Name it before he does.",
        },
        {
          question: "What does a deal look like when the doc review goes well versus when it doesn't?",
          purpose: "Gets him talking about the cost of failure in concrete terms. Creates the contrast you will return to when you introduce Tkxel.",
        },
        {
          question: "Who else is involved when you evaluate something like this — is Rachel looped in?",
          purpose: "Identifies the decision structure before you propose the scoping call. Avoids proposing a next step to the wrong person.",
        },
      ],
      pivotMoment: {
        signal:
          "Andy describes the bottleneck in specific terms — he says something like 'it takes three days' or 'Rachel ends up doing most of it' — and pauses. That pause means he has said the thing he came to say.",
        pivot:
          "\"That's exactly the scenario we built a solution for — not for a firm like yours in the abstract, but for an insurance advisory team doing PE due diligence specifically. Can I show you what we built for them? It will take five minutes and you can tell me if the problem is the same.\"",
      },
      howToClose:
        "\"Based on what you've described, the logical next step is a 45-minute technical scoping call where we map your current workflow and show you what automation looks like inside it. Does Thursday or Friday work for you and Rachel?\" Give the binary choice. Do not say 'let's find time.'",
      thingsGoWrong: [
        {
          scenario: "Andy shuts down early — becomes brief, stops asking questions",
          response:
            "Do not push. Name it directly: \"I get the sense I'm not landing this in a way that's useful — can I ask what's missing?\" Let him redirect you. Trying harder with the same approach after he has disengaged will cost you the credibility you have built.",
        },
        {
          scenario: "Andy asks about competitors or alternative tools",
          response:
            "Don't deflect and don't compare. \"Most tools give you a dashboard. What we build is the infrastructure that makes your team faster at using their own judgment. The difference is that it's built around your workflow, not a generic one.\" Return to his problem immediately after.",
        },
        {
          scenario: "Andy says he needs to think about it",
          response:
            "This is not a no — it is a missing reason to say yes. Ask: \"What would make this an easier yes?\" If he names something specific, address it. If he is vague, give him the binary close again with a specific date. Do not leave the call with 'I'll send something over.'",
        },
      ],
    },
    conversationRecap: {
      summary:
        "NewCo Risk was introduced via Hassan Malik following a referral from a mutual contact in the PE space. Andy agreed to a discovery call after a brief email exchange. No prior commercial relationship with Tkxel.",
      subject: "RE: Introducing Tkxel — AI-powered workflows for advisory firms",
      whatHasBeenSaid:
        "Hassan reached out cold via referral from Raheel Siddiqui, framing Tkxel around scaling due diligence without adding headcount. Andy replied the same day with a confirmed availability for a call and named the doc review bottleneck unprompted. Hassan sent the calendar invite this morning with a three-point agenda. Three messages total, all business — no small talk, no objections, no questions about Tkxel's credentials.",
      mostImportantThing:
        "\"We're in the middle of a busy season and the doc review bottleneck is a real pain point right now.\" — Andy volunteered this without being asked. He named the problem before he knew what we were selling.",
      commitmentsMade:
        "Hassan committed to a three-point agenda: (1) walk through the current workflow, (2) show the insurance advisory case study, (3) assess fit. Andy is expecting all three. Do not skip the case study — he has been primed for it.",
      communicationStyle:
        "Andy replied within six hours of the initial outreach and kept his message short — three sentences. He answered the implicit ask (availability for a call) and volunteered a pain point in the same breath. This is a high-engagement, low-ceremony communicator. He will not respond well to long preambles or rapport-building small talk. Get to the point fast and mirror his directness.",
      oneThing:
        "Andy needs to hear that Tkxel has done this for an insurance advisory firm specifically — not 'a firm like yours.' The case study from the comparable firm is the credibility moment this call turns on. If it does not come up, the call ends without him believing we understand his world.",
      recent: [
        {
          person: "Hassan Malik",
          email: "hassan@tkxel.com",
          timestamp: "Mon, Apr 28 · 9:14 AM",
          note: "Hi Andy,\n\nI came across NewCo Risk through a mutual contact in the PE space — Raheel Siddiqui mentioned you've been thinking about how to scale the due diligence process without growing headcount.\n\nWe've helped a couple of boutique advisory firms do exactly that — I'd love to share a quick example if you have 20 minutes this week.\n\nBest,\nHassan",
        },
        {
          person: "Andy Blackwood",
          email: "andy@newcorisk.com",
          timestamp: "Tue, Apr 29 · 3:51 PM",
          note: "Hassan,\n\nThanks for reaching out. Raheel mentioned you as well — good timing. We're in the middle of a busy season and the doc review bottleneck is a real pain point right now.\n\nHappy to jump on a call. What does your schedule look like Thursday afternoon?\n\nAndy",
        },
        {
          person: "Hassan Malik",
          email: "hassan@tkxel.com",
          timestamp: "Today · 8:30 AM",
          note: "Andy,\n\nPerfect — I've sent a calendar invite for today at 3:00 PM. Agenda is straightforward:\n\n1. Current state of your due diligence workflow\n2. A 5-min walkthrough of what we built for a comparable insurance advisory firm\n3. Whether there's a fit worth exploring further\n\nNo prep needed on your end. Looking forward to it.\n\nHassan",
        },
      ],
    },
    relatedNews: {
      whatNotToDo:
        "Do not surface every signal you found. Pick one, use it naturally, and move on. If you reference too many data points about Andy's online activity it reads as surveillance, not preparation — and he will notice immediately. One well-placed observation is credibility. Three signals in the first five minutes is a liability.",
      tkxelSignals:
        "Tkxel recently completed a document automation engagement for a mid-market insurance advisory firm — three-day due diligence reports reduced to under four hours. That story is the most relevant social proof available. Do not lead with it. If Andy describes the bottleneck, that is the moment: 'That is almost exactly the scenario we built a solution for — not for a firm like yours in the abstract, but for an insurance advisory team doing PE due diligence specifically.'",
      items: [
        {
          headline: "You posted about using AI to match enterprise throughput without hiring",
          source: "LinkedIn",
          href: "#",
          context:
            "Andy posted about scaling output without growing headcount — the exact framing of the force-multiplier argument. This is not background context; it is a direct signal that he is actively thinking about this problem. He has already done the mental work of imagining the solution.",
          howToUse:
            "Open with it as a genuine observation, not a flattery line: \"I saw you posted about scaling throughput without headcount — that framing is exactly how we think about what we build.\" Then let him respond. Do not follow it immediately with a pitch.",
        },
        {
          headline: "NewCo Risk shared a post on growing complexity of insurance exposure in mid-market PE deals",
          source: "LinkedIn",
          href: "#",
          context:
            "Andy's firm is positioning itself as a thought leader in a market getting more complex. This tells you he wants to be seen as ahead of the problem — he is building an expertise-based reputation, not just selling a service.",
          howToUse:
            "Use it to validate the timing: \"The complexity you're writing about in PE insurance exposure is exactly why manual doc review is becoming a bottleneck at that tier of deal.\" It connects his market view to his operational problem without you having to make the leap explicitly.",
        },
        {
          headline: "You mentioned boutique firms win on depth, not breadth",
          source: "LinkedIn",
          href: "#",
          context:
            "This is his competitive positioning and his identity. He left a large firm to build a depth-focused boutique. Any solution that looks like it adds process, overhead, or generic capability will land as contradicting who he is.",
          howToUse:
            "Mirror it back when describing Tkxel: \"We're a specialist team — we don't sell a platform, we build the specific infrastructure your workflow needs.\" Do not say 'enterprise.' Do not say 'platform.' Say specialist.",
        },
        {
          headline: "What made you decide to go independent from Symphony Risk Solutions?",
          source: "LinkedIn",
          href: "#",
          context:
            "Andy left a President-level role to start a boutique. That is a meaningful choice — it signals autonomy, conviction, and a deliberate rejection of the institutional model. Understanding that motivates the depth-over-breadth identity.",
          howToUse:
            "Only use if it comes up naturally. Ask it as a genuine question, not a flattery opener: \"What made you go independent?\" Then listen fully. The answer will tell you what he values and what he is afraid of.",
        },
      ],
    },
    relatedWork: [
      {
        label: "Due Diligence Pipeline — FinServ Client",
        href: "#",
        problem: "A financial services client needed to review 400+ documents per deal across scattered data rooms, causing weeks of manual analyst work per transaction.",
        solution: "Built an automated ingestion and classification pipeline that cut review time by 65%, surfacing risk flags directly in the analyst's existing workflow.",
        aiRelevance: "This is the closest analogue to NewCo Risk's workflow. Andy's team reviews insurance exposure documents across PE acquisition data rooms — same document volume problem, same time pressure, same analyst bottleneck. Lead with this project. The '65% reduction' is a number that will land for a 6-person firm where every analyst hour matters. Frame it as a question: ask Andy how long a typical document review takes his team per deal, then mirror the outcome back.",
      },
      {
        label: "Insurance Doc Automation — Case Study",
        href: "#",
        problem: "A boutique insurer was manually extracting policy terms and exposure data from PDF submissions, creating a 3-day lag before underwriters could act.",
        solution: "Deployed an LLM-based extraction layer integrated into their quoting tool, reducing turnaround from 3 days to under 4 hours with 94% accuracy.",
        aiRelevance: "The insurance domain match is strong — Andy will recognise the problem immediately. The '3 days to 4 hours' outcome is the specific proof point to reference. Do not lead with this one; use it as validation after the due diligence pipeline story has landed. It reinforces that we have done this more than once in his specific sector.",
      },
    ],
    turns: [
      {
        label: "The Verdict",
        text: "Andy Harbut, Co-Founder at NewCo Risk. Insurance and risk advisory for PE firms — 20 years in the space, over 1,000 deals. He is an operator, not a thought leader. He will not be moved by credentials. He will be moved by whether you understand his world. Medium priority call — he has authority but the firm is small.",
      },
      {
        label: "The Company Read",
        text: "NewCo Risk serves PE firms during acquisitions. Their job is identifying insurance and risk exposure before a deal closes. Six employees, five million in revenue. This is a boutique. They are not buying a platform. They are buying something that makes their small team look bigger and smarter. Frame Tkxel as a force multiplier.",
      },
      {
        label: "The Relevance Bridge",
        text: "We built a document processing pipeline for an insurance advisory firm that cut their due diligence report time from three days to four hours. Lead with it as a question: ask him what the bottleneck is that costs him the most time in a due diligence cycle. Let him describe the problem, then mirror it back with what we built.",
        relatedWork: [
          { label: "Due Diligence Pipeline — FinServ Client", href: "#" },
          { label: "Insurance Doc Automation — Case Study", href: "#" },
        ],
      },
      {
        label: "The Approach",
        text: "Open without pitching. Andy has twenty years in this industry — he will lose respect for you the moment you start selling. In the middle, let him talk. Avoid referencing company size. Close directly: ask for the next step, do not wait for him to offer it.",
      },
      {
        label: "Hooks",
        text: "Andy left a President-level role at Symphony Risk Solutions to start NewCo. Ask what made him decide to go independent — not as a compliment, but as a real question. Precision will build more credibility with him than personality.",
      },
      {
        label: "Open Questions",
        text: "What tools they currently use; whether they have worked with a technology partner before; who else will be in the room; and what triggered this conversation. That last one matters most — if they came to us, Andy already has a problem in mind.",
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
    rating: 5,
    verdict:
      "Strong fit — do not undersell it. She needs a direct line from what we do to how her team operates better. Lead with outcomes, not capabilities.",
    snapshot: "Logistics & operations consultancy · 300 employees · $40M revenue",
    description:
      "Avant Garde Solutions is a 300-person logistics and operations consultancy scaling faster than their internal processes can handle. Sarah is leading an initiative to identify automation opportunities across their highest-volume workflows.",
    website: "avantgarde-solutions.net",
    datetime: "Today · 9:00 PM",
    remaining: "4m",
    section: "today",
    companyDetails: {
      employees: "300",
      revenue: "$40M",
      industry: "Logistics & Operations",
      website: "https://avantgarde.io",
      tcv: "TBD",
      services: "1",
      lastEngagement: "3 days",
      accountHealth: "Active",
    },
    stakeholders: [
      {
        name: "Sarah Chen",
        role: "VP of Operations",
        initials: "SC",
        color: "bg-rose-500",
        linkedin: "#",
        technicalLevel: "Semi Technical",
        summary: "Sarah Chen joined Avant Garde three years ago to lead operational transformation across their retail and logistics verticals. She was brought in specifically because of her track record turning high-volume manual processes into structured automation pipelines. She is the originator of this initiative — she identified the bottleneck, scoped the problem, and initiated vendor conversations. She has budget influence but not final authority.",
        education: [
          { degree: "MBA, Operations Management", institution: "INSEAD", year: "2016" },
          { degree: "BSc, Industrial Engineering", institution: "University of Michigan", year: "2009" },
        ],
        previousCompanies: [
          { name: "McKinsey & Company", role: "Operations Consultant", duration: "5 years" },
          { name: "DHL Supply Chain", role: "Process Improvement Manager", duration: "3 years" },
        ],
        keyInsights: [
          "She owns the pain — make sure she feels heard before moving to solution.",
          "Likely to be your champion; keep her informed even when Marcus is the gatekeeper.",
          "Process-first mindset: present automation outcomes in workflow terms, not technical specs.",
          "Watch for over-promising — she will remember every commitment made on this call.",
        ],
      },
      {
        name: "Marcus Webb",
        role: "CTO",
        initials: "MW",
        color: "bg-indigo-600",
        technicalLevel: "Technical",
        summary: "Marcus Webb is the technical authority at Avant Garde, and his sign-off is required for any external integration. He is a pragmatic engineer — sceptical of over-engineered solutions and allergic to vendor lock-in. He joined Avant Garde from a SaaS infrastructure background, which means he will probe on architecture, security posture, and data handling. He is unlikely to be hostile, but he will need to be satisfied technically before he will co-sign with Sarah.",
        education: [
          { degree: "MEng, Computer Science", institution: "Imperial College London", year: "2008" },
        ],
        previousCompanies: [
          { name: "Cloudflare", role: "Infrastructure Architect", duration: "4 years" },
          { name: "Shopify", role: "Senior Engineer", duration: "3 years" },
        ],
        keyInsights: [
          "Will likely ask about API architecture, data residency, and rollback options.",
          "Avoid feature-listing — speak to system reliability and edge-case handling.",
          "If he asks a question you cannot answer, commit to a written technical brief after the call.",
        ],
      },
      {
        name: "Priya Nair",
        role: "Director of Process Excellence",
        initials: "PN",
        color: "bg-amber-500",
        technicalLevel: "Semi Technical",
        summary: "Priya Nair oversees process standards across Avant Garde's operational teams. She is an internal auditor of change — her role is to ensure that any automation introduced does not create new failure points or compliance gaps. She is not an obstacle; she is a safeguard. If she is satisfied, the implementation path is smoother. If she is not included, she can slow things down post-sale.",
        education: [
          { degree: "MSc, Operations Research", institution: "LSE", year: "2013" },
        ],
        previousCompanies: [
          { name: "Deloitte", role: "Process Consulting Manager", duration: "4 years" },
          { name: "GE Capital", role: "Process Analyst", duration: "2 years" },
        ],
        keyInsights: [
          "Less likely to be vocal in the call but will raise concerns post-meeting.",
          "Address compliance and auditability proactively — do not wait to be asked.",
          "Recommend including her in the scoping call if she is not already on the invite.",
        ],
      },
    ],
    opportunityAnalysis: {
      recap:
        "Avant Garde is scaling faster than their internal processes can support. Sarah is leading an initiative to identify automation opportunities across her team's highest-volume workflows.",
      roadblock:
        "Distributed decision-making — Sarah has influence but the CTO will likely need to co-sign. No single budget holder identified yet.",
      nextMilestone:
        "Pre-DC → close to a structured 30-minute technical scoping call with Sarah and Marcus (CTO).",
      upsell:
        "Expand from one workflow automation to a full process intelligence layer. Potential multi-team rollout across logistics, retail, and manufacturing verticals.",
      whyTalkingToUs:
        "Sarah's team found Tkxel through a logistics automation case study on the website — inbound, self-qualified. The trigger is operational scaling pain: hundreds of shipments a day, team still largely manual. She reached out herself, which means the pain is front-of-mind enough to act on without a sales nudge. She wants to understand whether there is a fit before looping in Ravi (CTO), so this call is really about her deciding whether it is worth his time.",
      problemInTheirWords:
        "\"We're processing hundreds of shipments daily and our ops team is still largely manual.\"",
      whatTheyHaveTried:
        "A hybrid WMS and spreadsheet setup. The WMS handles structure; the gaps are filled manually. This tells us the problem is not a missing system — it is that the system does not cover the high-volume edge cases. Any pitch framing a replacement will land badly. This needs to be positioned as an automation layer on top of what they have.",
      whatWinLooksLike:
        "Sarah leaves the call with a clear enough picture of what automation could look like for her specific workflow to take it to Ravi. She does not need a proposal — she needs a tangible example that maps to her reality. A win is her saying 'this is worth 30 minutes with our CTO.'",
      unlockQuestion:
        "Which part of the fulfilment process do your analysts spend the most time on that you feel should not require a human?",
      dealRisk:
        "Sarah has influence but not final sign-off — Marcus (CTO) is the technical gatekeeper and could slow things down if he has architectural concerns you cannot address in real time. The bigger risk is that Sarah over-represents internal urgency. 'Keen to move fast' may mean she personally is ready, but the organisation is not. If Marcus gets pulled in late and feels blindsided, momentum shifts against you. The secondary risk is Priya Nair: if she is not included and raises compliance concerns post-sale, the implementation stalls regardless of what was agreed in this call.",
      whatToAvoid: [
        "Do not pitch a replacement for their WMS — it must be framed as an automation layer on top of existing systems or you will lose Marcus immediately",
        "Do not ignore Priya Nair — if she is excluded and raises compliance concerns after the sale, the implementation stalls",
        "Do not over-promise ROI figures without qualifying their specific shipment volume and process structure",
        "Do not let the conversation become a Marcus-led architecture review — you are here to qualify the operational case first",
        "Do not treat 'keen to move fast' as a commitment — ask what 'fast' means to her before assuming urgency",
      ],
    },
    meetingNotes: {
      goals: [
        "Qualify operational pain with enough specificity to build a proof-of-concept proposal",
        "Introduce the throughput framing — not tech, capacity",
        "Identify Marcus's involvement and get a path to a joint scoping call",
      ],
      discussionTopics: [
        "The highest-volume manual process in Sarah's team",
        "How fast-growing ops teams solve problems that didn't exist six months ago",
        "The document processing proof point positioned as operational capacity gain",
        "What a 30-min technical scoping call with her CTO would look like",
      ],
      callGoalOneSentence:
        "Leave with a specific description of the highest-volume manual process and Sarah's commitment to loop in Ravi for a scoping call.",
      howToOpen:
        "\"Sarah, you came in through the logistics case study — which part of it actually resonated? I want to make sure we spend the time on what's relevant to you, not a generic overview.\"",
      discoveryArc: [
        {
          question: "Walk me through what happens from the moment a shipment order comes in to when it closes — what does your team actually touch?",
          purpose: "Maps the end-to-end process before you speculate about where the pain is. Shows you think in workflows, not features.",
        },
        {
          question: "Where in that process does manual work slow things down the most — or create the most errors?",
          purpose: "Locates the break point in her specific terms. This is what you will reference when you introduce the automation layer.",
        },
        {
          question: "You mentioned the team is still largely manual — have you looked at ways to change that, or is this a newer conversation?",
          purpose: "Surfaces prior attempts and tells you how far along the internal conversation is. Changes your urgency framing.",
        },
        {
          question: "You mentioned Ravi might join — how involved is he in evaluating this kind of initiative?",
          purpose: "Maps the decision structure. If Ravi is the sign-off, you need to give Sarah something she can take to him. Tells you how to close.",
        },
        {
          question: "If you could get your analysts 90 minutes a day back from this process, what would you want them doing with it?",
          purpose: "Shifts the framing from cost to capacity. Sarah thinks in throughput — this question lives in her language.",
        },
      ],
      pivotMoment: {
        signal:
          "Sarah describes a specific manual process with enough detail that she mentions a role, a step, or a time cost. That specificity means she has taken ownership of the problem. She is ready.",
        pivot:
          "\"That's almost exactly the scenario we automated for a logistics client last year — same hybrid WMS setup, same volume problem. Can I walk you through what we built? It's faster to show it than describe it.\"",
      },
      howToClose:
        "\"Based on what you've described, the right next step is a 30-minute technical scoping call with you and Ravi together — we'd map your current process and show you what the automation layer looks like in practice. Does next week work for both of you?\" Name Ravi explicitly. Make the invite joint.",
      thingsGoWrong: [
        {
          scenario: "Ravi joins the call and redirects the conversation to technical architecture",
          response:
            "Let him. Engage the technical framing — ask what their current WMS integration looks like and whether they have an API layer. Then bridge back: 'The reason I ask is that the automation we build sits on top of what you already have — no rip-and-replace.' Show you can operate in his register.",
        },
        {
          scenario: "Sarah says they are already evaluating other vendors",
          response:
            "Don't compete on features. 'That makes sense — can I ask what the shortlist looks like? We find the fit question is usually less about what tools do and more about whether they're built for your specific process.' Refocus on process fit, not product comparison.",
        },
        {
          scenario: "The call stays high-level and she won't commit to next steps",
          response:
            "Name it: 'I want to make sure this is useful to you — is there something specific you'd need to see before looping Ravi in?' If she cannot answer, you have a qualification problem. Offer to send the logistics case study before a follow-up call rather than pushing for a commitment she is not ready to make.",
        },
      ],
    },
    conversationRecap: {
      summary:
        "Avant Garde reached out through the website after reading a Tkxel case study on logistics automation. Sarib Imtiaz handled initial qualification. Sarah confirmed interest in a pre-discovery call.",
      subject: "RE: Website Inquiry — Logistics Automation Case Study",
      whatHasBeenSaid:
        "Sarah's team submitted an inbound form after reading the logistics automation case study. Sarib responded with three qualification questions about fulfilment scale, tech stack, and decision-makers. Sarah answered all three directly, confirmed Ravi (CTO) as a potential attendee, and confirmed the 2:00 PM call today. Four messages total over six days.",
      mostImportantThing:
        "\"We're keen to move fast if there's a clear ROI story.\" — Sarah flagged urgency and made the close condition explicit without being asked. She knows what she needs to bring to the exec conversation.",
      commitmentsMade:
        "Sarib framed the call as a 30-minute exploratory conversation with no prep needed. No specific deliverables were promised. However, the logistics case study was the trigger for the inbound — it should be referenced specifically in the call.",
      communicationStyle:
        "Sarah replied to three qualification questions with four answers and a timeline commitment in a single message. Short, factual, structured. She included Ravi without being asked — proactive. She closes messages with action items. This is someone who manages upward efficiently. Mirror her pace: no preamble, answer questions directly, propose concrete next steps.",
      oneThing:
        "The ROI story. Sarah flagged this herself — 'if there's a clear ROI story.' The call will turn on whether you can translate the logistics case study into her specific numbers. Come ready with the dwell-time and time-saved figures, and be prepared to map them to her fulfilment volume.",
      recent: [
        {
          person: "Avant Garde (web form)",
          email: "contact@avantgarde.io",
          timestamp: "Thu, Apr 24 · 11:02 AM",
          note: "Hi,\n\nI just read your case study on logistics automation and it resonated a lot with where we are right now. We're processing hundreds of shipments daily and our ops team is still largely manual. Would love to understand if there's a fit.\n\n— Sarah Chen, Head of Operations, Avant Garde",
        },
        {
          person: "Sarib Imtiaz",
          email: "sarib@tkxel.com",
          timestamp: "Mon, Apr 28 · 10:15 AM",
          note: "Hi Sarah,\n\nGreat to hear from you — the logistics case study is one of our favourites to share. A few quick questions to make sure we use the call time well:\n\n• How many fulfilment locations are you operating from?\n• Are you using a WMS today, or largely spreadsheet-driven?\n• Who besides yourself would be in the decision loop?\n\nI'll set up a 30-minute pre-discovery call once I hear back.\n\nSarib",
        },
        {
          person: "Sarah Chen",
          email: "sarah@avantgarde.io",
          timestamp: "Today · 9:05 AM",
          note: "Sarib,\n\nAnswers: 3 fulfilment centres, hybrid WMS + spreadsheets, and our CTO Ravi may join — I've cc'd him here. We're keen to move fast if there's a clear ROI story.\n\nSee you at 2:00 PM today. Ravi might be a few minutes late.\n\nSarah",
        },
      ],
    },
    relatedNews: {
      whatNotToDo:
        "Do not arrive with a list of her LinkedIn posts as conversation starters — she will see through it. Pick one signal, use it to frame one question, then move on. Signal research is for framing, not for demonstrating how much prep you did.",
      tkxelSignals:
        "Tkxel recently automated a fulfilment exception-handling workflow for a mid-size logistics operator — the outcome was a 40% reduction in manual touches per order. Wait until Sarah describes her highest-volume manual process. If it resembles exception handling or shipment status updates, that is the story to reach for.",
      items: [
        {
          headline: "You posted about your ops team doubling in the last year — how are manual workflows holding up at that scale?",
          source: "LinkedIn",
          href: "#",
          context:
            "Sarah posted about scaling their ops team significantly — which signals that headcount has been the current answer to volume growth. When headcount is the solution, process debt accumulates. She is coming into this call with both operational awareness and personal investment in finding a better answer.",
          howToUse:
            "\"You mentioned your ops team has been growing quickly — that's the pattern we see just before clients start exploring automation. Is the team scaling to absorb new volume, or are you still catching up with existing demand?\"",
        },
        {
          headline: "Avant Garde shared a post on expanding into three new logistics verticals — how is the team absorbing that growth operationally?",
          source: "LinkedIn",
          href: "#",
          context:
            "Growth across new verticals with a manual team is a compounding problem. Each new vertical adds process variation that manual systems cannot standardise efficiently — and if the core workflow is already stretched, expansion makes the gaps worse proportionally.",
          howToUse:
            "\"The expansion into new verticals is useful context — does the ops team run the same process across all three, or does each vertical have its own workflow? That usually determines how much of any automation is reusable versus custom.\"",
        },
        {
          headline: "What's the highest-volume manual process your team runs today?",
          source: "LinkedIn",
          href: "#",
          context:
            "This is a diagnostic question framed as a conversation starter. The answer Sarah gives will tell you where the bottleneck actually is versus where she assumes it is. Do not pre-answer it — let her describe it in her own words before you reach for any analogy.",
          howToUse:
            "Ask mid-call after she has described the end-to-end workflow: \"Which of those steps would you say is highest volume on a given day — the one your team touches the most?\"",
        },
        {
          headline: "If you could get 90 minutes back per analyst per day, what would they do with it?",
          source: "LinkedIn",
          href: "#",
          context:
            "This question moves the conversation from cost to capacity — the language Sarah used in her outreach. The activity she names tells you how she is thinking about the business case internally. If she gives a specific answer, she has already done the ROI math in her own head.",
          howToUse:
            "Use this after you have introduced the automation layer: \"If your analysts got 90 minutes back per day from this process, what would you want them doing with it?\" It reframes the investment as capacity gain, not cost avoidance.",
        },
      ],
    },
    relatedWork: [
      { label: "Process Automation — Logistics Client", href: "#", aiRelevance: "Sarah's team faces the same pattern: high-volume manual workflows that haven't scaled with headcount. The logistics client was processing 800+ shipment records per day with a 4-person ops team. Lead with this one — frame it as a capacity gain, not an automation project. Ask Sarah what her team's highest-volume daily task is before referencing this." },
      { label: "Operational Throughput Dashboard", href: "#", aiRelevance: "Relevant for the post-automation visibility angle. Once we address Sarah's bottleneck, the dashboard work shows her what operational transparency looks like in practice. Better suited for a second conversation after the workflow pain is confirmed." },
      { label: "Workflow Intelligence Platform — Retail", href: "#", aiRelevance: "The retail vertical overlap is useful context if Avant Garde's retail clients come up. Do not lead with it — Avant Garde's primary pain is logistics and ops, not retail. Mention it only if she asks about multi-vertical experience." },
    ],
    turns: [
      {
        label: "The Verdict",
        text: "Sarah Chen, VP of Operations at Avant Garde Solutions Ltd. Mid-size logistics and operations consultancy — scaling fast, operationally stretched. She is pragmatic and detail-oriented. This is a strong fit call. Do not undersell it.",
      },
      {
        label: "The Company Read",
        text: "Avant Garde serves enterprise clients across logistics, retail, and manufacturing. Three hundred employees, $40M revenue. Decision-making is distributed; Sarah has influence but she is not the only sign-off. Expect a second conversation with her CTO.",
      },
      {
        label: "The Relevance Bridge",
        text: "Position our work not as a technology project but as an operational capacity gain. Ask her what the highest-volume manual process in her team is. That is your entry point.",
        relatedWork: [
          { label: "Process Automation — Logistics Client", href: "#" },
          { label: "Operational Throughput Dashboard", href: "#" },
        ],
      },
      {
        label: "The Approach",
        text: "Open with the operational pressure framing — acknowledge that fast-growing operations teams are solving problems that did not exist six months ago. Close by proposing a 30-minute technical scoping call with her and the CTO.",
      },
      {
        label: "Hooks",
        text: "Sarah moved from senior analyst to VP in eighteen months — unusually fast. She will respect efficiency in the conversation. She is active on LinkedIn around operational excellence.",
      },
      {
        label: "Open Questions",
        text: "Who the CTO is and how technical they are; what tools they currently use; whether they have a budget; and whether this came top-down or Sarah identified the need independently.",
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
    rating: 3,
    verdict:
      "Gap: unknown who else is on this call. Resolve before opening or you risk pitching at the wrong level. Conservative buyer — credibility comes from precision, not warmth.",
    snapshot: "Real estate investment & advisory · 400 employees · long buying cycles",
    description:
      "Amherst is a 400-person firm operating across real estate investment, property technology, and advisory services. Technology investment here is conservative and ROI-driven, with long institutional buying cycles.",
    website: "amherst.com",
    datetime: "Tomorrow · 11:00 AM",
    remaining: "14h 4m",
    section: "tomorrow",
    companyDetails: {
      employees: "400",
      revenue: "Undisclosed",
      industry: "Real Estate & PropTech",
      website: "https://amherst.com",
      tcv: "TBD",
      services: "0",
      lastEngagement: "1 week",
      accountHealth: "New",
    },
    stakeholders: [
      {
        name: "Sidra Masood",
        role: "Director",
        initials: "SM",
        color: "bg-emerald-600",
        linkedin: "#",
        technicalLevel: "Non Technical",
        summary: "Sidra Masood is a Director at Amherst with cross-functional responsibility over portfolio operations and reporting infrastructure. Her response to a cold LinkedIn outreach — naming portfolio reporting as a specific pain unprompted — signals that she is genuinely exploring solutions, not just taking exploratory calls. At a firm with Amherst's institutional culture, that level of responsiveness is notable. She is not a technical buyer; she is an outcomes buyer.",
        education: [
          { degree: "MBA, Real Estate Finance", institution: "Columbia Business School", year: "2012" },
          { degree: "BA, Finance", institution: "University of Texas at Austin", year: "2007" },
        ],
        previousCompanies: [
          { name: "Blackstone", role: "Associate, Portfolio Strategy", duration: "3 years" },
          { name: "JP Morgan", role: "Real Estate Analyst", duration: "2 years" },
        ],
        keyInsights: [
          "She named the problem herself — do not oversell, let the problem lead.",
          "Institutional buyers at Amherst move slowly; this call is about qualification, not closing.",
          "Unknown attendee on the invite — ask who else will join early in the call.",
          "Frame any proposal around reporting accuracy and time savings — avoid tech-forward language.",
        ],
      },
      {
        name: "Unknown",
        role: "Attendee — TBC",
        initials: "?",
        color: "bg-slate-300",
        technicalLevel: "Non Technical",
        summary: "A second attendee is confirmed on the invite but their identity is not yet known. Given Amherst's structure, this is likely either a member of Sidra's team or a senior stakeholder she has looped in to evaluate fit. Either way, prepare for the possibility that this person has more authority than expected and calibrate accordingly.",
        keyInsights: [
          "Ask Sidra at the start of the call who has joined, and acknowledge them directly.",
          "Do not pitch harder because of an unknown audience — read the room first.",
        ],
      },
    ],
    opportunityAnalysis: {
      recap:
        "Amherst operates across real estate investment, property technology, and advisory services. Technology investment is conservative and ROI-driven. This call is as much about qualification as about pitching.",
      roadblock:
        "Unknown who else is attending. Sidra's decision-making authority is unclear. Long institutional buying cycle anticipated.",
      nextMilestone:
        "Establish fit and identify decision-making structure. If positive — propose a follow-up with the relevant technical stakeholder.",
      upsell:
        "If Sidra's team is the beachhead, potential to expand to other Amherst verticals — PropTech platform, investment data infrastructure.",
      whyTalkingToUs:
        "Sarib initiated this through a targeted LinkedIn outreach referencing Amherst's expansion into multi-family and industrial portfolios. Sidra replied to a cold message, which at an institutional firm like Amherst means the pain is real enough to warrant exploration. She named portfolio reporting as the specific area of interest unprompted. She is coming into this call with one question: is this firm structured enough and credible enough to bring further into our process?",
      problemInTheirWords:
        "\"The portfolio reporting angle is actually something we've been discussing internally — our current process is slow and quite manual.\"",
      whatTheyHaveTried:
        "No prior technology partner or vendor is mentioned. The phrasing 'discussing internally' suggests the conversation about fixing this is ongoing but no solution has been evaluated yet. This is an early-stage opportunity. The risk is a long institutional cycle, not competition from an incumbent.",
      whatWinLooksLike:
        "Sidra leaves the call having decided Amherst should explore this further — and that 'further' means a second conversation with a technical or commercial stakeholder. A win is not a proposal. It is Sidra agreeing to a structured follow-up and confirming who should be in the room for it.",
      unlockQuestion:
        "What does the current portfolio reporting process look like — how does data get from your assets into a format your advisors can actually use?",
      dealRisk:
        "The most serious risk is the unknown attendee. If a procurement officer or technical lead joins without preparation, the conversation can shift from qualification to vendor evaluation — and you are not ready for that mode. The second risk is Amherst's institutional culture: if this call feels like a sales pitch rather than a genuine diagnostic, Sidra will not advance it internally. Move too fast and you lose the one thing that matters most at this firm — credibility. There is no recovering from a call that felt rushed at an institution like this.",
      whatToAvoid: [
        "Do not open with a company overview or a pitch — Sidra replied to a cold message, which means she already knows enough. She is here to qualify you",
        "Do not make assumptions about the unknown attendee — introduce yourself, ask their role, and adapt your register accordingly",
        "Do not use technology-forward language like 'AI-powered' or 'intelligent automation' — Amherst evaluates ROI and operational outcomes, not innovation",
        "Do not try to close anything on this call — the win is a structured follow-up with the right stakeholder, not an agreement",
        "Do not stay high-level if she goes specific — match her level of precision at every point in the conversation or you lose credibility",
      ],
    },
    meetingNotes: {
      goals: [
        "Find out who else is on the call in the first two minutes",
        "Establish credibility through precision and structure — not personality",
        "Qualify whether there is an active budget or this is exploratory",
      ],
      discussionTopics: [
        "The most time-consuming reporting process Sidra's team runs",
        "The data aggregation and reporting work we did for a property advisory firm — 60% time reduction",
        "How technology investment is evaluated and approved at Amherst",
        "What prompted this conversation",
      ],
      callGoalOneSentence:
        "Confirm there is an active reporting problem, understand who owns the budget, and agree a structured follow-up with the right stakeholder.",
      howToOpen:
        "\"Sidra, before we get into it — is it just you today, or is anyone else joining? I want to make sure the conversation is calibrated for the right audience.\" Ask this first. The answer changes everything about how you run the next 28 minutes.",
      discoveryArc: [
        {
          question: "Can you walk me through what the portfolio reporting process looks like today — from data source to final output?",
          purpose: "Maps the workflow without assuming where the pain is. Sidra thinks in process — this question speaks her language.",
        },
        {
          question: "Where does the most time go in that process — and is that a team problem or a data problem?",
          purpose: "Distinguishes whether the fix is automation, data infrastructure, or both. Changes the scope of the solution and the size of the engagement.",
        },
        {
          question: "You mentioned it's been a topic of internal discussion — how long has it been on the radar, and what has held it back?",
          purpose: "Surfaces whether there is a budget, a champion, and organisational will. 'On the radar' with no action usually means no sponsor. You need to know.",
        },
        {
          question: "How does Amherst typically evaluate and approve technology investments of this type?",
          purpose: "Maps the procurement process without asking 'are you the decision-maker.' Tells you how long the cycle is and who else you need to meet.",
        },
        {
          question: "If this were to go forward, what would the internal case for it need to look like?",
          purpose: "Gets Sidra to articulate the buy criteria in her own words. This is what you will structure a proposal around if she is qualified.",
        },
      ],
      pivotMoment: {
        signal:
          "Sidra describes the reporting process with specific friction — she mentions a step that takes too long or a type of data that is hard to consolidate. Specific friction from an institutional contact means the problem has executive visibility. She is ready.",
        pivot:
          "\"We worked through a very similar scenario with a property advisory firm — portfolio data across multiple asset classes, manual consolidation, slow to the client. Can I show you what we built? I want to check whether the problem is the same before we go any further.\"",
      },
      howToClose:
        "\"Based on what you've described, the most useful next step would be a 45-minute structured session where we map your reporting workflow and show you what an automation layer would look like inside it. Who else should be in that conversation on your side?\" Let her name the stakeholder. Then propose a date.",
      thingsGoWrong: [
        {
          scenario: "Sidra is non-committal and keeps the call surface-level",
          response:
            "Do not push harder. Summarise what you have heard precisely: 'From what you've described, it sounds like portfolio reporting is a real friction point and there's internal appetite to address it — but the timing or budget may not be confirmed yet. Is that a fair read?' Let her correct you. Precision is more persuasive than enthusiasm at Amherst.",
        },
        {
          scenario: "Someone from IT or procurement joins unexpectedly",
          response:
            "Treat this as a positive signal — it means the conversation has been shared internally. Introduce yourself, ask what their specific interest is, and adjust the conversation to include the technical or procurement angle. Do not try to bring it back to Sidra only.",
        },
        {
          scenario: "Sidra says the budget cycle is later in the year",
          response:
            "Do not disappear. 'That's useful to know — the most productive use of the time before that cycle opens is usually to have the scope defined so you're not starting from scratch when budget is confirmed. Would a short mapping session make sense in the next few weeks?' Keep the momentum without pretending urgency exists.",
        },
      ],
    },
    conversationRecap: {
      summary:
        "Amherst was contacted via Sarib Imtiaz through a LinkedIn outreach campaign targeting real estate advisory firms. Sidra agreed to a pre-discovery call. Context on internal structure is thin.",
      subject: "RE: Real estate analytics — exploring a potential fit",
      whatHasBeenSaid:
        "Sarib opened with a LinkedIn outreach message that referenced Amherst's expansion into new real estate categories. Sidra replied within a business day, confirmed the portfolio reporting pain point, and set a call time herself. Sarib confirmed with a calendar invite. Three messages over three days — short, professional, no friction.",
      mostImportantThing:
        "\"The portfolio reporting angle is actually something we've been discussing internally.\" — 'Discussing internally' at an institution like Amherst means this has been a boardroom or leadership conversation, not just an analyst observation. The pain has organisational visibility.",
      commitmentsMade:
        "Sarib described this as a 30-minute exploratory call with no prep required. No deliverables were promised. The risk is that the low-pressure framing has left Sidra without a specific expectation — be prepared to create structure in the first two minutes.",
      communicationStyle:
        "Sidra's replies are short, complete, and action-oriented. She answered the implicit question in Sarib's outreach (is there a problem worth talking about?) with a sentence and a calendar suggestion. No pleasantries, no questions about Tkxel. This is an institutional contact who evaluates quickly and moves slowly. Do not mistake her brevity for warmth or urgency — it is efficiency. Match her register exactly.",
      oneThing:
        "Decision-making structure. We do not know who else is in the room, whether there is a budget, or who the sponsor is. This call should end with clarity on all three. If it does not, you have a discovery call with no path forward.",
      recent: [
        {
          person: "Sarib Imtiaz",
          email: "sarib@tkxel.com",
          timestamp: "Fri, Apr 25 · 2:30 PM",
          note: "Hi Sidra,\n\nI noticed Amherst has been expanding its advisory coverage into multi-family and industrial portfolios — congrats on the growth.\n\nWe've been working with a couple of real estate firms on automating their market data aggregation and portfolio reporting. Thought it might be worth a quick conversation to see if there's any overlap with what you're building.\n\nSarib",
        },
        {
          person: "Sidra Malik",
          email: "sidra@amherstadvisory.com",
          timestamp: "Mon, Apr 28 · 9:22 AM",
          note: "Sarib,\n\nThanks for the note. The portfolio reporting angle is actually something we've been discussing internally — our current process is slow and quite manual. Happy to jump on a short call.\n\nMornings work best for me. Does tomorrow at 11 work?\n\nSidra",
        },
        {
          person: "Sarib Imtiaz",
          email: "sarib@tkxel.com",
          timestamp: "Mon, Apr 28 · 11:47 AM",
          note: "Sidra,\n\nTomorrow at 11 is perfect. I've sent a calendar invite — it's a 30-minute exploratory call, no agenda or prep needed from your side.\n\nLooking forward to learning more about what you're working on.\n\nSarib",
        },
      ],
    },
    relatedNews: {
      whatNotToDo:
        "Do not mention multiple signals in one breath. Amherst contacts evaluate credibility through precision, not preparation volume. Pick the signal most directly connected to the pain she named — the portfolio expansion — and use it once as a framing device. Everything else stays in your notes.",
      tkxelSignals:
        "Tkxel completed a data aggregation and reporting automation project for a property advisory firm managing seven asset classes — manual consolidation time was cut by 60%. If Sidra describes a multi-asset reporting problem, this is the analogy to reach for. Frame it as a process question, not a case study: \"That's actually close to a scenario we worked through recently — can I ask what the data sources look like on your side?\"",
      items: [
        {
          headline: "Congratulations on the Head of Analytics role — what's the top priority you're walking into?",
          source: "LinkedIn",
          href: "#",
          context:
            "Sidra's role carries reporting infrastructure responsibility — which means she is not just describing a pain, she owns the system that needs to change. This signal acknowledges her accountability without framing it as a problem you are pointing out.",
          howToUse:
            "\"You've been in this role for a while now — what's the part of the reporting process that you've been meaning to address but haven't had the bandwidth for?\"",
        },
        {
          headline: "Amherst posted about expanding its advisory coverage across new real estate categories — how is the analytics team keeping pace with that scope?",
          source: "LinkedIn",
          href: "#",
          context:
            "Portfolio growth across new real estate categories directly increases reporting complexity. More assets, more data sources, more consolidation overhead — and if the process is already slow, growth compounds the problem proportionally. This is the most relevant signal for this call.",
          howToUse:
            "\"The expansion into new categories is useful context for what you described — does the reporting process scale linearly with portfolio size, or does complexity compound as you add new asset types?\"",
        },
        {
          headline: "What's the most time-consuming reporting process your team runs right now?",
          source: "LinkedIn",
          href: "#",
          context:
            "Sidra has publicly referenced data visibility as critical to client advisory quality. She has thought about this. This question is designed to confirm where the specific bottleneck sits — let her name it in her own words before you offer any framing.",
          howToUse:
            "\"You mentioned data visibility being critical to advising clients well — what's the part of the current process that makes that hardest to achieve consistently?\"",
        },
        {
          headline: "You mentioned data visibility being critical to advising clients well — where are the biggest gaps today?",
          source: "LinkedIn",
          href: "#",
          context:
            "This probe moves from describing the problem to quantifying it. At Amherst, where investment decisions are ROI-driven, Sidra will respond best to a conversation that leads toward a measurable gap — not a general inefficiency.",
          howToUse:
            "\"Where in the current process does the data fail you most often — is it freshness, completeness, or how long it takes to consolidate from source to output?\"",
        },
      ],
    },
    relatedWork: [
      { label: "Data Aggregation & Reporting — Property Advisory Firm", href: "#", aiRelevance: "This is the most directly relevant project for Sidra. A property advisory firm with manual portfolio reporting — same institutional context, same pain. The outcome (60% reduction in reporting time, 90 minutes per analyst per day saved) is the number to reference. Sidra will evaluate this through an ROI lens: quantify it in analyst hours and cost before the call." },
      { label: "PropTech Analytics Platform — Case Study", href: "#", aiRelevance: "Useful for demonstrating sector depth rather than a specific proof point. Sidra may ask how familiar we are with PropTech — this answers that. Do not lead with it; it is context, not evidence." },
    ],
    turns: [
      {
        label: "The Verdict",
        text: "Sidra Masood, Director at Amherst. Institutional clients, long decision cycles. Credibility comes from preparation and precision, not warmth. Critical gap: unknown who else will be on this call.",
      },
      {
        label: "The Company Read",
        text: "Amherst operates across real estate investment, property technology, and advisory services. Roughly 400 employees. Technology investment here tends to be conservative and ROI-driven. This call is about qualification.",
      },
      {
        label: "The Relevance Bridge",
        text: "Data aggregation and reporting work for a property advisory firm — reduced manual reporting time by 60%, gave analysts 90 minutes a day back. Ask her what the most time-consuming reporting process her team runs is.",
        relatedWork: [
          { label: "Data Aggregation & Reporting — Property Advisory Firm", href: "#" },
          { label: "PropTech Analytics Platform — Case Study", href: "#" },
        ],
      },
      {
        label: "The Approach",
        text: "Open formally. Introduce the call with an agenda. Use precise questions rather than open-ended ones. Avoid vague language like 'solutions' and 'partnerships.' Close by summarising what you heard and proposing a concrete next step with a timeline.",
      },
      {
        label: "Hooks",
        text: "Sidra has a finance background — investment banking to real estate. She thinks in ROI, payback periods, and risk. Frame every capability in those terms. Match her register. Do not rush the conversation.",
      },
      {
        label: "Open Questions",
        text: "Critical gap: who else is attending. Ask directly in the first two minutes. Also: what prompted this conversation, current technology stack, and whether there is an active budget.",
      },
    ],
  },
  // ── Acme ──────────────────────────────────────────────────────────────────
  {
    id: "acme",
    company: "Acme",
    person: "Tim",
    role: "Head of Digital Design",
    type: "predc",
    readiness: "complete",
    rating: 4,
    verdict:
      "Executive approval is the final gate. Address remaining concerns, reinforce ROI, and come prepared with upsell options to maximise deal value.",
    snapshot: "VR retail & design · 42 employees · $1.8M TCV",
    description:
      "Acme, a 42-employee company, is exploring VR for retail and design. We've been working with them since 2023, with a proposal under review for expanding their VR capabilities.",
    website: "acme.com",
    datetime: "Tomorrow · 10:00 AM",
    remaining: "18h 30m",
    section: "tomorrow",
    companyDetails: {
      employees: "42",
      revenue: "$1.8M",
      industry: "Retail & Design",
      website: "https://acme.design",
      tcv: "$1.8M",
      services: "3",
      lastEngagement: "2 weeks",
      accountHealth: "Good",
    },
    stakeholders: [
      {
        name: "Mark Lecroce",
        role: "Head of Digital Design",
        initials: "ML",
        color: "bg-rose-500",
        linkedin: "#",
        technicalLevel: "Semi Technical",
        summary: "Mark Lecroce leads digital design strategy at Acme, and is the internal champion driving the VR retail initiative. He has been managing the exec approval process carefully and has positioned this project as a design differentiation play rather than a technology investment. He is enthusiastic but cautious — he does not want to over-promise to his leadership before the deal is signed.",
        education: [
          { degree: "BA, Interaction Design", institution: "Rhode Island School of Design", year: "2007" },
        ],
        previousCompanies: [
          { name: "IDEO", role: "Design Lead", duration: "5 years" },
          { name: "Nike Digital", role: "Senior Designer", duration: "3 years" },
        ],
        keyInsights: [
          "Your internal champion — keep him equipped with materials that make his internal pitch easier.",
          "He is working the exec sign-off this week; the call needs to give him something concrete.",
          "Respond to the ROI framing — he will need to translate VR outcomes into exec language.",
        ],
      },
      {
        name: "Colleen Elaine",
        role: "Global Chief Digital Officer",
        initials: "CE",
        color: "bg-violet-500",
        linkedin: "#",
        technicalLevel: "Non Technical",
        summary: "Colleen Elaine is the executive sponsor at Acme and the final decision-maker on this initiative. She is unlikely to attend the current call but is the target of Mark's internal advocacy. She evaluates technology investment through brand impact and revenue lift, not implementation complexity. Her primary concern will be whether this pilot can scale globally across Acme's retail footprint without becoming a liability.",
        education: [
          { degree: "MBA, Marketing", institution: "Harvard Business School", year: "2000" },
        ],
        previousCompanies: [
          { name: "L'Oréal", role: "Chief Digital Officer, Americas", duration: "6 years" },
          { name: "Publicis", role: "Digital Strategy Director", duration: "4 years" },
        ],
        keyInsights: [
          "Not expected on today's call, but everything Mark needs is for her sign-off.",
          "Prepare a one-page exec brief Mark can forward internally — ROI model, brand positioning, global scalability.",
          "Do not over-engineer the pitch for her; she will decide based on confidence, not detail.",
        ],
      },
      {
        name: "Leslie Alexander",
        role: "Director of Product",
        initials: "LA",
        color: "bg-blue-500",
        linkedin: "#",
        technicalLevel: "Technical",
        summary: "Leslie Alexander oversees Acme's product and platform layer, including integrations with third-party partners. She will be involved in any technical scoping post-approval and will evaluate the integration model, support SLAs, and content update workflow. She is rigorous and detail-oriented — if she is on the call, expect specific questions about the integration timeline and ongoing content management.",
        education: [
          { degree: "BSc, Computer Science", institution: "Stanford University", year: "2010" },
        ],
        previousCompanies: [
          { name: "Apple Retail", role: "Senior Product Manager", duration: "4 years" },
          { name: "Salesforce", role: "Product Lead, Commerce Cloud", duration: "3 years" },
        ],
        keyInsights: [
          "Technical gatekeeper for integration — her buy-in is required before any deployment.",
          "Prepare for questions on content update frequency, API reliability, and rollback procedures.",
          "If she raises a concern the team cannot answer in real time, offer a post-call technical brief.",
        ],
      },
      {
        name: "Ky (Vesta Labs)",
        role: "VR Integration Lead",
        initials: "KY",
        color: "bg-teal-500",
        technicalLevel: "Technical",
        summary: "Ky is the VR Integration Lead from Vesta Labs — Insphere's partner on this deployment. He will be responsible for the technical implementation of the VR retail experience and is attending the call to provide technical reassurance to the Acme team. He is a subject-matter expert, not a commercial stakeholder. Do not let the conversation shift to a deep technical discussion in this call — reserve that for a dedicated scoping session.",
        education: [
          { degree: "MEng, Human-Computer Interaction", institution: "Georgia Tech", year: "2017" },
        ],
        previousCompanies: [
          { name: "Vesta Labs", role: "VR Integration Lead", duration: "3 years" },
          { name: "Magic Leap", role: "Software Engineer", duration: "2 years" },
        ],
        keyInsights: [
          "Partner stakeholder — ensure his role is clear to the Acme team before the call starts.",
          "Let him handle technical depth; your role is commercial and strategic.",
          "If Acme raises a technical blocker, let Ky respond rather than attempting to bridge it.",
        ],
      },
    ],
    opportunityAnalysis: {
      recap:
        "Acme is exploring the integration of VR into their retail channels and design studio workflows. The recent proposal outlines customization options, pricing, and ROI benefits, with Tim's team expressing interest in moving forward.",
      roadblock:
        "Pending executive approval and final alignment on customization details.",
      nextMilestone:
        "Immersive VR Retail Expansion → Finalize executive approval and commence VR integration in retail test stores.",
      upsell:
        "Content personalization, multilingual VR expansions, and ongoing user engagement audits to maximize the impact of Acme's VR integration.",
      whyTalkingToUs:
        "This is not a discovery call — it is a close call. The proposal has been shared, the team's initial reaction is positive, and Tim is working the exec sign-off internally. He has been managing the conversation carefully: positive but not committing. The risk going into this call is not objection — it is delay. Tim is being asked by his exec team to justify the spend, and he may not have everything he needs to do that. This call exists to give him that.",
      problemInTheirWords:
        "\"The main sticking point is executive sign-off, which I'm working on this week.\"",
      whatTheyHaveTried:
        "The HoloTech acquisition (referenced in LinkedIn activity) suggests Acme has been building internal VR capability. Tim's team is not starting from zero — they have explored the space. The proposal from Vesta Labs is being evaluated against what they could do in-house or with the acquired capability. The exec objection may be 'why do we need an external partner?'",
      whatWinLooksLike:
        "Tim walks away with a one-pager he can put in front of the exec team that answers the ROI question in their language — not Tim's. A win is Tim saying 'this is what I needed' and committing to bring the exec decision this week, not 'I'll keep you posted.'",
      unlockQuestion:
        "What is the exec team's main hesitation — is it the ROI model, the implementation risk, or something about the timing?",
      dealRisk:
        "Tim is a strong internal champion but he does not have final authority. The risk is not Tim — it is the exec team making a decision based on whatever brief Tim gives them, without you in the room. If Tim forwards the proposal without a dedicated exec summary, the decision will be made on the wrong framing. The secondary risk is the HoloTech acquisition: if the exec team has interpreted that as 'we now have this capability in-house,' external partners face a build-vs-buy objection that Tim may not be equipped to handle on his own. A deal this close can still slip if it is not closed this week.",
      whatToAvoid: [
        "Do not assume the exec objection is ROI — it could be implementation risk, timing, or the build-vs-buy question from HoloTech. Ask first",
        "Do not let Tim leave without a specific next action and a date — 'I'll keep you posted' is how this deal dies",
        "Do not go deep on implementation detail in this call — that belongs in a dedicated scoping session with Leslie post-approval",
        "Do not present the proposal as a feature list — the exec audience thinks in revenue impact and brand differentiation, not functionality",
        "Do not undersell urgency — the pilot slot deadline is real, and Tim needs to feel the cost of delay without it sounding manufactured",
      ],
    },
    meetingNotes: {
      goals: [
        "Close the sale by addressing final concerns and highlighting ROI, while identifying upsell opportunities.",
      ],
      discussionTopics: [
        "Review of the customization options proposed in the recent proposal.",
        "Localization options for expanding into new markets with VR integration.",
        "Opportunities to enhance user engagement through interactive elements.",
      ],
      callGoalOneSentence:
        "Identify the exec team's specific objection, address it with concrete material, and get Tim's commitment to a decision date — not a follow-up.",
      howToOpen:
        "\"Tim, before I get into the one-pager — I want to make sure I've understood the exec team's specific concern. You mentioned sign-off is the sticking point. Is the hesitation about ROI, implementation risk, or something else? Because what I've prepared changes depending on the answer.\"",
      discoveryArc: [
        {
          question: "What has the exec team's reaction been to the proposal — is there a specific concern, or is it more of a timing question?",
          purpose: "Identifies whether this is an ROI objection, a risk objection, or a 'not now' delay. Each has a different response. Do not guess.",
        },
        {
          question: "Who specifically needs to sign off — is this one person or a committee?",
          purpose: "Maps the approval path. If it is a committee, you need materials for multiple audiences. If it is one exec, you need to know their priorities.",
        },
        {
          question: "What does success look like for the exec team at the end of the first 90 days of the pilot?",
          purpose: "Anchors the conversation in their outcomes, not yours. The exec team is not buying VR — they are buying the dwell time uplift and the design studio efficiency. Name it in their terms.",
        },
        {
          question: "Has the HoloTech acquisition changed the internal conversation about external partnerships for this kind of work?",
          purpose: "Surfaces the build-vs-buy question before the exec does. Naming it shows awareness and prevents you being blindsided.",
        },
      ],
      pivotMoment: {
        signal:
          "Tim names a specific exec concern — either the ROI number, the implementation timeline, or the in-house capability question. Specificity means he is advocating internally and needs ammunition, not reassurance.",
        pivot:
          "\"Good — that's exactly what I've prepared for. Let me walk you through the one-pager. It's structured around that specific question and it's written for an exec audience, not an ops audience.\"",
      },
      howToClose:
        "\"Tim, you said you'd have clarity by Thursday — what do you need from me before then to make that happen? I can have anything you need to you within the hour.\" Do not offer to 'check in.' Ask for the specific gap and fill it immediately.",
      thingsGoWrong: [
        {
          scenario: "Tim says the exec has decided to explore the in-house option via HoloTech",
          response:
            "Do not panic. 'That makes sense — can I ask what the HoloTech capability covers? The reason I ask is that most firms find the integration layer — connecting VR to the retail workflow — is where an external partner adds the most value, even if the content is built internally.' Position Vesta Labs as complementary, not competitive.",
        },
        {
          scenario: "Tim asks for a lower price point to get the deal through",
          response:
            "Do not discount without understanding what it buys you. 'I want to find a way to make this work. Can you tell me what number would make this an easy yes for the exec team?' Then consider whether a phased rollout — starting with one store rather than three — gets you to that number without eroding margin.",
        },
        {
          scenario: "Tim says he still doesn't have an answer and needs more time",
          response:
            "Name the cost of delay: 'I understand — I want to be transparent that we're holding the pilot slot through Friday. If the timing doesn't work for this cycle, I'd rather have that conversation now so we can plan accordingly.' Give him a real deadline and let him decide.",
        },
      ],
    },
    conversationRecap: {
      summary:
        "Vesta Labs has responded within 2 hours on average, and the last contact was yesterday between Emy and Tim from Acme. Conversations have centred around the opportunity for Acme to adopt VR in their retail channels and design studio work.",
      subject: "RE: VR Pilot Proposal — Vesta Labs × Acme",
      whatHasBeenSaid:
        "Emy sent the full proposal on Friday — three tiers, phased rollout, and a projected 22% dwell-time uplift. Tim replied Monday saying the team's reaction was positive but exec sign-off was the remaining gate. Emy followed up this morning holding the pilot slot and offering to produce an exec one-pager. Three messages over a week — professional, warm, and increasingly time-pressured.",
      mostImportantThing:
        "\"The main sticking point is executive sign-off, which I'm working on this week.\" — Tim is not the blocker. He is the internal advocate. He is managing upward on Vesta Labs' behalf. This call is not about convincing Tim — it is about arming him.",
      commitmentsMade:
        "Emy committed to holding the pilot slot through end of week and offered to produce a one-pager for the exec audience. Tim is expecting both. Come to the call with the one-pager ready. Do not make him ask again.",
      communicationStyle:
        "Tim's replies are measured and consistently positive in tone but non-committal on timeline. He shares internal status ('working on it this week') without naming dates. He does not ask questions — he reports. This is someone managing upward carefully. He may not have full executive control of this decision. Do not mistake his positivity for authority.",
      oneThing:
        "The exec objection. Tim has not named what the exec team's specific concern is — ROI, implementation risk, or the in-house option via HoloTech. Until you know that, you are preparing for the wrong conversation. The first two minutes of this call must identify it.",
      recent: [
        {
          person: "Emy Laurent",
          email: "emy@vestalabs.io",
          timestamp: "Fri, Apr 25 · 4:10 PM",
          note: "Hi Tim,\n\nAs promised, I've attached the full proposal for the VR pilot — it covers three customisation tiers, a phased rollout plan, and an ROI model based on your current retail footprint.\n\nThe short version: we're projecting a 22% uplift in in-store dwell time within 90 days of launch, based on comparable deployments. Happy to walk through the numbers live.\n\nEmy",
        },
        {
          person: "Tim Horton",
          email: "tim@acme.com",
          timestamp: "Mon, Apr 28 · 10:45 AM",
          note: "Emy,\n\nThank you — the proposal looks strong. I've shared it with our retail and design leads and the initial reaction is positive. The main sticking point is executive sign-off, which I'm working on this week.\n\nI'll keep you posted. Should have clarity by Thursday.\n\nTim",
        },
        {
          person: "Emy Laurent",
          email: "emy@vestalabs.io",
          timestamp: "Today · 9:00 AM",
          note: "Tim,\n\nJust checking in — any update from the exec side? We're holding the pilot slot through end of week, but I want to make sure you have everything you need to make the case internally.\n\nIf it helps, I can put together a one-pager tailored for the executive audience. Let me know.\n\nEmy",
        },
      ],
    },
    relatedNews: {
      whatNotToDo:
        "Do not reference the HoloTech acquisition as a threat or a complication unless Tim raises it first. If you bring it up and the exec team had not seen it as a conflict, you have just created an objection. Let Tim bring it in — then engage it directly.",
      tkxelSignals:
        "Tkxel has supported two immersive retail deployments where the integration layer — connecting VR content to live inventory and pricing data — was the primary differentiator. That is precisely where internal VR capability typically stops short. If the build-vs-buy question surfaces, this is the proof point to use: \"The content itself is often not the gap — the integration into the live retail workflow is where most internal teams run out of runway.\"",
      items: [
        {
          headline: "Tim, you framed VR as the core engagement layer going forward — what does that look like operationally for your team?",
          source: "LinkedIn",
          href: "#",
          context:
            "Tim has positioned VR publicly as the future of Acme's retail engagement model — not as an experiment. This means he has already done the internal framing work and needs the exec team to match his conviction, not be introduced to the concept from scratch.",
          howToUse:
            "\"You've been positioning this as the engagement layer, not just a pilot — has that framing landed with the exec team, or is there still an 'it's too early' concern to address?\"",
        },
        {
          headline: "Acme posted about the HoloTech acquisition — how does this reshape the roadmap for your immersive retail initiative?",
          source: "LinkedIn",
          href: "#",
          context:
            "The HoloTech acquisition can mean two things: either Acme is doubling down on immersive and wants an external partner to accelerate it — or the exec team believes the acquisition reduces the need for external help. You need to know which framing the exec is operating under before you walk into the approval conversation.",
          howToUse:
            "\"Has the HoloTech acquisition changed the internal conversation about external partners at all? I want to make sure the exec summary addresses the right question.\"",
        },
        {
          headline: "You shared a post on building retail experiences that feel native to the customer journey — how far along is Acme in that vision?",
          source: "LinkedIn",
          href: "#",
          context:
            "Tim has been selling this concept internally as brand differentiation, not operational efficiency. This tells you the exec audience responds to design-forward language and customer experience framing — not ROI models and implementation timelines.",
          howToUse:
            "\"The exec summary I've prepared leads with the brand differentiation angle rather than the ROI model — based on what you've seen of their reaction, is that the right hook, or does the approval hinge more on the numbers?\"",
        },
        {
          headline: "What's the one thing that would make the biggest difference to how your team delivers immersive experiences right now?",
          source: "LinkedIn",
          href: "#",
          context:
            "This question probes for the gap between where Acme is now and where Tim wants the team to be. In a close call, this surfaces the last unstated objection — what the proposal does not fully address that is still on Tim's mind.",
          howToUse:
            "\"Before we get into the one-pager — is there anything you felt the proposal didn't fully address that's still on your mind? I want to make sure we're closing the right gap, not just the most obvious one.\"",
        },
      ],
    },
    relatedWork: [
      { label: "VR Retail Integration — Acme Proposal", href: "#", aiRelevance: "This is the active proposal — already in the exec's hands. The AI relevance here is not discovery but close support. Prepare a one-paragraph ROI summary that Mark can copy-paste into an internal email to Colleen. Frame it around brand impact and scalability, not implementation specs." },
      { label: "Immersive Design Studio Concept Deck", href: "#", aiRelevance: "Use this to show Acme what Phase 2 looks like before Phase 1 is signed. If exec hesitation is about scope, showing a roadmap signals confidence and reduces perceived risk. Present it as 'here's where clients typically go after the initial retail deployment.'" },
      { label: "Multilingual VR — Localization Case Study", href: "#", aiRelevance: "Acme's brand is global. If global scalability is a concern in the exec conversation, this case study directly addresses it. Reference it only if Mark surfaces the international expansion question." },
    ],
    turns: [
      {
        label: "The Verdict",
        text: "Acme is at the close stage. Executive approval is the final gate. Your job in this call is to address the last objections, reinforce ROI, and surface upsell options to maximise deal value before the contract is signed.",
      },
      {
        label: "The Company Read",
        text: "Acme is a 42-employee company investing in VR for retail channels and design studio workflows. They've been a client since 2023 — three active services, $1.8M TCV. Account health is Good. This is a growth account with strong expansion potential.",
      },
      {
        label: "The Relevance Bridge",
        text: "The proposal already covers customization options, pricing, and ROI. Tim's team is positive. The blocker is executive alignment. Come prepared with a concise one-page ROI summary they can take directly to the C-suite.",
        relatedWork: [
          { label: "VR Retail Integration — Acme Proposal", href: "#" },
          { label: "ROI Summary Deck — Retail VR",          href: "#" },
        ],
      },
      {
        label: "The Approach",
        text: "Open by acknowledging the progress made since the proposal. Reference the document directly. Ask what outstanding questions the executive team has — don't assume you know the objections. Close with a clear next step: approval or a defined timeline.",
      },
      {
        label: "Hooks",
        text: "Acme recently made an acquisition. Ask how the new addition fits into their VR strategy — it signals ambition and opens the door to expanded scope. HoloTech entering the market creates competitive urgency you can reference without being heavy-handed.",
      },
      {
        label: "Open Questions",
        text: "What specific concerns does the executive team have? Who is the final decision maker? Is there a deadline driving the approval timeline? What would make this an easy yes for their board?",
      },
    ],
  },
];
