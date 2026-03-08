'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';

const FAQ_ITEMS = [
  {
    q: 'Is Next.js SaaS AI Template free to try?',
    a: 'Yes! The demo environment is fully functional with no payment required. Explore every feature with sample data.',
  },
  {
    q: 'What data do I need to get started?',
    a: 'Just your team roster. You can import from CSV, connect HRIS integrations (BambooHR, Deel), or add members manually. Skills taxonomy can be bootstrapped with AI.',
  },
  {
    q: 'Does it work with our existing tools?',
    a: 'Next.js SaaS AI Template integrates with Slack, GitHub, GitLab, Google Workspace, LinkedIn, BambooHR, Deel, Lattice, Small Improvements, and ResourceGuru. More integrations are coming.',
  },
  {
    q: 'How does the AI assistant work?',
    a: "The AI uses your organization's skill taxonomy, role profiles, and individual data to give personalized career guidance, generate quizzes, recommend learning paths, and suggest recognitions.",
  },
  {
    q: 'Is my data secure?',
    a: "Absolutely. Next.js SaaS AI Template is multi-tenant by design — each organization's data is fully isolated. We use enterprise-grade authentication (Auth.js) and role-based access control.",
  },
  {
    q: 'Can managers see everything?',
    a: "No. Visibility is permission-based, not role-based. Managers see only their direct reports' data. 1:1 facilitators have read-only access to their people's projects and performance.",
  },
];

export function PricingFAQ() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
      {FAQ_ITEMS.map((item, i) => (
        <AccordionItem key={i} value={`faq-${i}`}>
          <AccordionTrigger className="text-left text-base font-medium">{item.q}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
