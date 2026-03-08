import { Rocket, Settings2, TrendingUp } from 'lucide-react';

const STEPS = [
  {
    step: 1,
    icon: Settings2,
    title: 'Set up your org',
    description: 'Create your tenant, define skills taxonomy, invite your team, and configure roles.',
  },
  {
    step: 2,
    icon: Rocket,
    title: 'Discover & assess',
    description: 'Members assess their skills, AI processes CVs, and the people finder goes live.',
  },
  {
    step: 3,
    icon: TrendingUp,
    title: 'Grow together',
    description: 'Track OKRs, run 1:1s, give feedback, assign learning paths, and celebrate wins.',
  },
];

export function HowItWorks() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {STEPS.map((step) => {
        const Icon = step.icon;
        return (
          <div key={step.step} className="relative text-center">
            {/* Connector line (hidden on mobile and last item) */}
            {step.step < 3 && (
              <div
                className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px border-t-2 border-dashed border-primary/20"
                aria-hidden
              />
            )}
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-4 relative">
              <Icon className="h-7 w-7 text-primary" />
              <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {step.step}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">{step.description}</p>
          </div>
        );
      })}
    </div>
  );
}
