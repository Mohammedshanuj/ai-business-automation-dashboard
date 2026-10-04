// Mock data layer. Shapes mirror the planned Supabase tables so the UI can be
// wired to real queries later by swapping these exports for data fetchers.

export type LeadCategory = "HOT" | "WARM" | "COLD";
export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "LOST";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  lead_score: number;
  lead_category: LeadCategory;
  ai_summary: string;
  recommended_action: string;
  status: LeadStatus;
  source: string;
  created_at: string;
  updated_at: string;
}

export type TicketCategory = "Billing" | "Technical" | "Sales" | "General";
export type TicketPriority = "Critical" | "High" | "Normal";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "WAITING_CUSTOMER" | "RESOLVED" | "CLOSED";

export interface SupportTicket {
  id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  message: string;
  category: TicketCategory;
  priority: TicketPriority;
  ai_summary: string;
  needs_human: boolean;
  suggested_reply: string;
  status: TicketStatus;
  source: string;
  gmail_message_id: string;
  created_at: string;
  updated_at: string;
}

export const leads: Lead[] = [
  {
    id: "lead-001",
    name: "Sarah Mitchell",
    email: "sarah.mitchell@nexora.io",
    phone: "+1 (415) 555-0132",
    company: "Nexora Logistics",
    message:
      "We're a 120-person logistics company drowning in manual order processing. We need end-to-end business automation — intake, routing, invoicing. Budget approved for this quarter. Can we get a demo this week?",
    lead_score: 94,
    lead_category: "HOT",
    ai_summary:
      "High-intent enterprise buyer with approved budget and urgent timeline. Clear pain point (manual order processing), company size fits ICP, and requested a demo within the week.",
    recommended_action: "Call within 24 hours and book a demo. Assign to senior sales rep.",
    status: "NEW",
    source: "Website Form",
    created_at: "2026-10-02T09:14:00Z",
    updated_at: "2026-10-02T09:14:00Z",
  },
  {
    id: "lead-002",
    name: "David Okafor",
    email: "d.okafor@brightpath.com",
    phone: "+1 (212) 555-0177",
    company: "BrightPath Retail",
    message:
      "Exploring AI chatbots for our customer support. We get about 2,000 tickets a month and want to cut response times. Not sure about budget yet — looking for ballpark pricing and case studies.",
    lead_score: 68,
    lead_category: "WARM",
    ai_summary:
      "Genuine interest in AI support automation with a clear volume metric (2k tickets/month), but budget is unconfirmed. Mid-funnel prospect asking for pricing and proof points.",
    recommended_action: "Send pricing overview and two relevant case studies. Follow up in 3 days.",
    status: "CONTACTED",
    source: "LinkedIn",
    created_at: "2026-10-01T15:42:00Z",
    updated_at: "2026-10-02T10:05:00Z",
  },
  {
    id: "lead-003",
    name: "Emily Zhang",
    email: "emily.z@studymail.com",
    phone: "+1 (646) 555-0119",
    company: "—",
    message:
      "Hi, I'm a grad student researching AI adoption in small businesses. Would someone be willing to answer a few questions about your platform for my thesis?",
    lead_score: 12,
    lead_category: "COLD",
    ai_summary:
      "Academic research enquiry, not a buying signal. No company, no budget, no business pain point. Politely redirect to public resources.",
    recommended_action: "Send a polite reply with links to public documentation. No sales follow-up.",
    status: "LOST",
    source: "Website Form",
    created_at: "2026-09-28T11:20:00Z",
    updated_at: "2026-09-29T08:30:00Z",
  },
  {
    id: "lead-004",
    name: "Marcus Webb",
    email: "mwebb@sterlingfinserv.com",
    phone: "+1 (312) 555-0148",
    company: "Sterling Financial Services",
    message:
      "Enterprise enquiry: we need AI document processing across 14 regional offices, ~40k documents/month. Compliance (SOC 2, GDPR) is mandatory. Please send your enterprise deck and security whitepaper.",
    lead_score: 91,
    lead_category: "HOT",
    ai_summary:
      "Large enterprise opportunity with concrete volume (40k docs/month), multi-office rollout, and explicit compliance requirements. Strong fit for enterprise tier.",
    recommended_action: "Route to enterprise sales immediately. Prepare security documentation before the call.",
    status: "QUALIFIED",
    source: "Referral",
    created_at: "2026-09-30T14:05:00Z",
    updated_at: "2026-10-01T09:12:00Z",
  },
  {
    id: "lead-005",
    name: "Priya Raman",
    email: "priya.raman@carepointhealth.org",
    phone: "+1 (617) 555-0163",
    company: "CarePoint Health",
    message:
      "Our support team of 8 handles 500+ patient enquiries weekly. Interested in automating triage and FAQs. What's the typical implementation timeline?",
    lead_score: 77,
    lead_category: "WARM",
    ai_summary:
      "Solid mid-market prospect with a defined use case (support triage automation) and real volume. Timeline question suggests active evaluation. Healthcare compliance may apply.",
    recommended_action: "Schedule discovery call. Prepare healthcare-relevant implementation plan.",
    status: "CONTACTED",
    source: "Webinar",
    created_at: "2026-09-29T17:33:00Z",
    updated_at: "2026-10-01T13:40:00Z",
  },
  {
    id: "lead-006",
    name: "Tom Keller",
    email: "tkeller@kellerbros.com",
    phone: "+1 (206) 555-0191",
    company: "Keller Bros Construction",
    message:
      "Saw your ad. What does this AI stuff actually do? We run a small construction firm, maybe 15 people.",
    lead_score: 31,
    lead_category: "COLD",
    ai_summary:
      "Very early-stage curiosity with no defined use case or urgency. Small team size below typical ICP. Low conversion probability.",
    recommended_action: "Add to nurture newsletter. Re-engage if they interact with content.",
    status: "NEW",
    source: "Paid Ads",
    created_at: "2026-10-03T08:51:00Z",
    updated_at: "2026-10-03T08:51:00Z",
  },
  {
    id: "lead-007",
    name: "Aisha Bello",
    email: "aisha@urbanestate.co",
    phone: "+1 (929) 555-0125",
    company: "UrbanEstate Realty",
    message:
      "We want to automate lead follow-up for our 40 agents. Currently losing deals because responses take days. Ready to move fast if the fit is right — can you integrate with our CRM (HubSpot)?",
    lead_score: 88,
    lead_category: "HOT",
    ai_summary:
      "Strong buying intent with quantified pain (lost deals from slow follow-up), 40-seat rollout, and a specific integration requirement (HubSpot, which is supported).",
    recommended_action: "Book a technical demo highlighting the HubSpot integration. Fast-track to proposal.",
    status: "QUALIFIED",
    source: "Website Form",
    created_at: "2026-10-02T19:27:00Z",
    updated_at: "2026-10-03T09:02:00Z",
  },
  {
    id: "lead-008",
    name: "Jonas Lindqvist",
    email: "jonas.l@nordicfashion.se",
    phone: "+46 8 555 0142",
    company: "Nordic Fashion Group",
    message:
      "Comparing three AI vendors for our e-commerce operations. Send me your feature list and pricing. Decision expected within 6 weeks.",
    lead_score: 72,
    lead_category: "WARM",
    ai_summary:
      "Active vendor evaluation with a defined decision window (6 weeks). Competitive situation — differentiation and responsive follow-up will matter.",
    recommended_action: "Send comparison-ready feature sheet and schedule a tailored walkthrough within the week.",
    status: "CONTACTED",
    source: "Google Search",
    created_at: "2026-10-01T10:18:00Z",
    updated_at: "2026-10-02T16:44:00Z",
  },
  {
    id: "lead-009",
    name: "Rachel Kim",
    email: "rachel.kim@flowstack.dev",
    phone: "+1 (408) 555-0158",
    company: "FlowStack",
    message:
      "We're a 30-person SaaS startup. Need to automate customer onboarding emails and in-app guidance. Do you have a startup plan or free tier?",
    lead_score: 55,
    lead_category: "WARM",
    ai_summary:
      "Early-stage startup with a clear but modest use case. Price-sensitive (asking about free tier). Could grow into a larger account.",
    recommended_action: "Offer startup pricing and a self-serve onboarding path. Low-touch follow-up.",
    status: "NEW",
    source: "Product Hunt",
    created_at: "2026-10-03T13:36:00Z",
    updated_at: "2026-10-03T13:36:00Z",
  },
  {
    id: "lead-010",
    name: "Henrik Bauer",
    email: "h.bauer@bauerindustrie.de",
    phone: "+49 30 555 0176",
    company: "Bauer Industrie GmbH",
    message:
      "Manufacturing firm, 400 employees. We need AI-driven quality inspection reporting integrated with our ERP. This is a board-approved initiative for Q1 2027.",
    lead_score: 85,
    lead_category: "HOT",
    ai_summary:
      "Board-approved enterprise initiative with a fixed timeline (Q1 2027) and a technical ERP integration requirement. High-value, long-cycle deal.",
    recommended_action: "Engage solutions engineering for ERP scoping. Set up executive intro call.",
    status: "NEW",
    source: "Trade Show",
    created_at: "2026-10-03T16:09:00Z",
    updated_at: "2026-10-03T16:09:00Z",
  },
];

export const tickets: SupportTicket[] = [
  {
    id: "ticket-001",
    customer_name: "Laura Chen",
    customer_email: "laura.chen@acmecorp.com",
    subject: "Charged twice for October invoice",
    message:
      "Hi, I just checked our company card and we were charged twice for our October subscription — once on the 1st and again on the 2nd. Both charges are $499. Please refund the duplicate ASAP and confirm it won't happen again. Our invoice number is INV-2026-1042.",
    category: "Billing",
    priority: "High",
    ai_summary:
      "Customer reports a duplicate $499 charge for the October subscription (invoice INV-2026-1042). Requests a refund and assurance it won't recur. Verified billing issue requiring a refund action.",
    needs_human: true,
    suggested_reply:
      "Hi Laura,\n\nThank you for flagging this, and I'm sorry for the duplicate charge. I've escalated invoice INV-2026-1042 to our billing team to process a refund of the second $499 charge — you should see it back on your card within 3–5 business days.\n\nWe're also reviewing why the duplicate occurred and will confirm once the underlying issue is fixed so it doesn't happen again.\n\nBest regards,\nSupport Team",
    status: "OPEN",
    source: "Gmail",
    gmail_message_id: "gmail-18f2a91c",
    created_at: "2026-10-03T07:52:00Z",
    updated_at: "2026-10-03T07:52:00Z",
  },
  {
    id: "ticket-002",
    customer_name: "Miguel Torres",
    customer_email: "miguel.t@quickship.io",
    subject: "Can't log in — password reset not arriving",
    message:
      "I've tried resetting my password four times today and the reset email never arrives. Checked spam too. I'm locked out of my account and we have shipments to process today. Email on the account is miguel.t@quickship.io.",
    category: "Technical",
    priority: "Critical",
    ai_summary:
      "Customer is fully locked out: password reset emails are not arriving (checked spam). Business-critical impact — they process shipments daily. Likely an email delivery issue on our side.",
    needs_human: true,
    suggested_reply:
      "Hi Miguel,\n\nI'm sorry you're locked out — I understand how disruptive this is with shipments to process.\n\nI've flagged this to our engineering team as a priority, since reset emails not arriving points to a delivery issue on our side. In the meantime, I've manually triggered a password reset for miguel.t@quickship.io — please check for an email from no-reply@ within the next few minutes.\n\nIf it still doesn't arrive, reply here and I'll set up a temporary access link directly.\n\nBest regards,\nSupport Team",
    status: "IN_PROGRESS",
    source: "Gmail",
    gmail_message_id: "gmail-18f2b044",
    created_at: "2026-10-03T09:15:00Z",
    updated_at: "2026-10-03T10:02:00Z",
  },
  {
    id: "ticket-003",
    customer_name: "Anna Petrova",
    customer_email: "anna.p@stellarstudio.co",
    subject: "Question about annual pricing discount",
    message:
      "We're on the monthly Pro plan and considering switching to annual. Your site mentions a discount for annual billing but doesn't say how much. Could you share the annual pricing for a team of 12?",
    category: "Sales",
    priority: "Normal",
    ai_summary:
      "Existing customer on monthly Pro asking about annual pricing for 12 seats. Expansion/retention opportunity — no issue to fix, just needs pricing information.",
    needs_human: false,
    suggested_reply:
      "Hi Anna,\n\nGreat question! Annual billing on the Pro plan saves you 20% compared to monthly. For a team of 12, that works out to $4,608/year instead of $5,760 — a saving of $1,152.\n\nYou can switch to annual anytime from Settings → Billing, and the change takes effect at your next renewal. If you'd like, I can also connect you with our team to walk through it.\n\nBest regards,\nSupport Team",
    status: "RESOLVED",
    source: "Gmail",
    gmail_message_id: "gmail-18f1e7a2",
    created_at: "2026-10-01T12:40:00Z",
    updated_at: "2026-10-01T15:22:00Z",
  },
  {
    id: "ticket-004",
    customer_name: "James Whitfield",
    customer_email: "jwhitfield@meridianretail.com",
    subject: "API returning 500 errors since this morning",
    message:
      "Our integration has been getting intermittent 500 errors from the /v2/orders endpoint since about 6am UTC. Roughly 30% of requests fail. This is blocking our order sync. Error IDs attached: err_9f21, err_9f34, err_9f58.",
    category: "Technical",
    priority: "Critical",
    ai_summary:
      "Production incident: ~30% of requests to /v2/orders are failing with 500 errors since 06:00 UTC, blocking the customer's order sync. Error IDs provided for investigation. Escalate to engineering immediately.",
    needs_human: true,
    suggested_reply:
      "Hi James,\n\nThank you for the detailed report and the error IDs — that helps a lot.\n\nI've escalated this to our engineering team as a critical incident affecting the /v2/orders endpoint. They're investigating the failures now and I'll update you within the hour with a status.\n\nYou can also follow real-time updates on our status page. Apologies for the disruption to your order sync.\n\nBest regards,\nSupport Team",
    status: "IN_PROGRESS",
    source: "Gmail",
    gmail_message_id: "gmail-18f2c118",
    created_at: "2026-10-03T08:31:00Z",
    updated_at: "2026-10-03T09:47:00Z",
  },
  {
    id: "ticket-005",
    customer_name: "Fatima Al-Sayed",
    customer_email: "fatima@greenleafmarket.com",
    subject: "How do I add a team member?",
    message:
      "I want to give our marketing manager access to the dashboard but can't find where to invite her. Is there a limit on team members for the Starter plan?",
    category: "General",
    priority: "Normal",
    ai_summary:
      "Simple how-to question about inviting a team member and seat limits on the Starter plan. Answerable from documentation — no human review needed.",
    needs_human: false,
    suggested_reply:
      "Hi Fatima,\n\nYou can invite your marketing manager from Settings → Team → Invite Member — just enter her email and she'll get an invitation link.\n\nThe Starter plan includes up to 5 team members, so you're all set. If you ever need more seats, the Pro plan includes unlimited members.\n\nBest regards,\nSupport Team",
    status: "CLOSED",
    source: "Gmail",
    gmail_message_id: "gmail-18f0d3b7",
    created_at: "2026-09-29T14:08:00Z",
    updated_at: "2026-09-30T09:15:00Z",
  },
  {
    id: "ticket-006",
    customer_name: "Robert Hayes",
    customer_email: "rhayes@blueridgemfg.com",
    subject: "Slack integration stopped syncing",
    message:
      "Our Slack integration stopped posting notifications two days ago. I've disconnected and reconnected it but notifications still aren't coming through. Workspace: blueridgemfg.slack.com. Channel: #ops-alerts.",
    category: "Technical",
    priority: "High",
    ai_summary:
      "Slack integration silently stopped delivering notifications two days ago; reconnecting didn't fix it. Likely a token or webhook issue. Needs technical investigation.",
    needs_human: true,
    suggested_reply:
      "Hi Robert,\n\nThanks for the details. Since reconnecting didn't restore notifications, this is likely a webhook or permissions issue on our side rather than a configuration problem.\n\nI've opened a ticket with our integrations team to check the delivery logs for your workspace. I'll follow up within one business day with what they find.\n\nAs a temporary workaround, you can enable email notifications in Settings → Notifications so you don't miss alerts.\n\nBest regards,\nSupport Team",
    status: "OPEN",
    source: "Gmail",
    gmail_message_id: "gmail-18f2a55e",
    created_at: "2026-10-02T16:44:00Z",
    updated_at: "2026-10-02T16:44:00Z",
  },
  {
    id: "ticket-007",
    customer_name: "Nina Kowalski",
    customer_email: "nina.k@vantageconsulting.com",
    subject: "Need a copy of our invoices for accounting",
    message:
      "Our accountant needs PDF copies of all invoices from January to September 2026 for our books. Can you send these over or tell me where to download them?",
    category: "Billing",
    priority: "Normal",
    ai_summary:
      "Routine request for invoice PDFs (Jan–Sep 2026) for accounting purposes. Self-serve answer available — invoices are downloadable from the billing page.",
    needs_human: false,
    suggested_reply:
      "Hi Nina,\n\nYou can download PDF copies of all your invoices anytime from Settings → Billing → Invoice History — each invoice has a Download PDF button.\n\nIf you'd prefer, I can also have our billing team email you a bundled archive of January through September 2026. Just let me know!\n\nBest regards,\nSupport Team",
    status: "WAITING_CUSTOMER",
    source: "Gmail",
    gmail_message_id: "gmail-18f19c04",
    created_at: "2026-09-30T11:26:00Z",
    updated_at: "2026-10-01T08:12:00Z",
  },
  {
    id: "ticket-008",
    customer_name: "Daniel Osei",
    customer_email: "daniel.o@peakfitness.co",
    subject: "Dashboard loads very slowly",
    message:
      "Over the past week the analytics dashboard has gotten really slow — 20+ seconds to load, sometimes it times out. We have about 2 years of data in the account. Browser is Chrome, cleared cache already.",
    category: "Technical",
    priority: "High",
    ai_summary:
      "Performance degradation on the analytics dashboard (20s+ load times) for an account with ~2 years of data. Cache cleared, so it's likely a server-side query performance issue. Needs engineering review.",
    needs_human: true,
    suggested_reply:
      "Hi Daniel,\n\nThanks for reporting this — 20+ second load times definitely aren't acceptable.\n\nGiven the volume of data in your account, this looks like a query performance issue on our side. I've passed your account details to our engineering team to investigate and optimize.\n\nI'll update you as soon as I hear back, expected within 1–2 business days.\n\nBest regards,\nSupport Team",
    status: "OPEN",
    source: "Gmail",
    gmail_message_id: "gmail-18f2b9f1",
    created_at: "2026-10-02T20:03:00Z",
    updated_at: "2026-10-02T20:03:00Z",
  },
  {
    id: "ticket-009",
    customer_name: "Grace Nakamura",
    customer_email: "grace.n@lumenmedia.com",
    subject: "Feature request: export reports to CSV",
    message:
      "Love the platform! One thing missing for us: we'd like to export the weekly analytics reports to CSV for our client presentations. Is this on the roadmap?",
    category: "General",
    priority: "Normal",
    ai_summary:
      "Feature request for CSV export of weekly analytics reports. Positive sentiment, no issue to resolve. Log as product feedback and respond warmly.",
    needs_human: false,
    suggested_reply:
      "Hi Grace,\n\nThanks for the kind words, and great suggestion! CSV export for analytics reports is on our roadmap for this quarter.\n\nI've added your vote to the feature request — we'll notify you as soon as it ships. In the meantime, the print-to-PDF option on any report can work for client presentations.\n\nBest regards,\nSupport Team",
    status: "RESOLVED",
    source: "Gmail",
    gmail_message_id: "gmail-18f1a2c9",
    created_at: "2026-09-28T09:57:00Z",
    updated_at: "2026-09-29T10:31:00Z",
  },
];

export function getLead(id: string) {
  return leads.find((l) => l.id === id);
}

export function getTicket(id: string) {
  return tickets.find((t) => t.id === id);
}
