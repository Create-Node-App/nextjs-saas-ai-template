'use client';

/**
 * Stats Cards Component
 *
 * Displays key metrics in a grid of cards.
 * Each card links to the page that shows the corresponding data.
 */

import { GraduationCap, MessageSquare, Route, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Card, CardContent } from '@/shared/components/ui/card';
import { useCountUp } from '@/shared/hooks/use-count-up';
import { cn } from '@/shared/lib/utils';

/** Animated number that counts up when visible */
function AnimatedValue({ target }: { target: number }) {
  const { ref, value } = useCountUp(target);
  return <span ref={ref}>{value.toLocaleString()}</span>;
}

interface StatsCardsProps {
  tenantSlug: string;
  catalogSkills: number;
  assessedSkills: number;
  conversationsCount?: number;
  capabilitiesCount?: number;
  growthPathsCount?: number;
  capabilitiesMatched?: number;
  capabilitiesTotal?: number;
}

export function StatsCards({
  tenantSlug,
  catalogSkills,
  assessedSkills,
  conversationsCount = 0,
  capabilitiesCount,
  growthPathsCount = 0,
  capabilitiesMatched,
  capabilitiesTotal,
}: StatsCardsProps) {
  const t = useTranslations('dashboard');
  const base = `/t/${tenantSlug}`;

  // Personal metrics cards (shown first) – each has href to the page for that data
  const personalCards = [
    {
      title: t('mySkills'),
      value: assessedSkills,
      description: t('skillsAssessed'),
      icon: Sparkles,
      accentBorder: 'border-l-green-500',
      iconBg: 'bg-green-500/10 dark:bg-green-500/20',
      iconColor: 'text-green-500',
      href: `${base}/profile?tab=skills`,
    },
    {
      title: t('aiConversations'),
      value: conversationsCount,
      description: t('totalInteractions'),
      icon: MessageSquare,
      accentBorder: 'border-l-amber-500',
      iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
      iconColor: 'text-amber-500',
      href: `${base}/assistant`,
    },
    {
      title: t('myGrowthPaths'),
      value: growthPathsCount,
      description: t('growthPathsActive'),
      icon: Route,
      accentBorder: 'border-l-violet-500',
      iconBg: 'bg-violet-500/10 dark:bg-violet-500/20',
      iconColor: 'text-violet-500',
      href: `${base}/growth`,
    },
    {
      title: t('capabilitiesStatus'),
      value:
        capabilitiesMatched !== undefined && capabilitiesTotal !== undefined
          ? `${capabilitiesMatched}/${capabilitiesTotal}`
          : (capabilitiesCount ?? 0),
      description:
        capabilitiesMatched !== undefined && capabilitiesTotal !== undefined
          ? t('capabilitiesStatusDescription', { matched: capabilitiesMatched, total: capabilitiesTotal })
          : capabilitiesCount
            ? t('capabilitiesMatched')
            : t('completeAssessmentToSee'),
      icon: GraduationCap,
      accentBorder: 'border-l-cyan-500',
      iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
      iconColor: 'text-cyan-500',
      href: `${base}/growth`,
    },
  ];

  const informationalCard = {
    title: t('catalogSkills'),
    value: catalogSkills,
    description: t('skillsAvailable'),
    icon: Sparkles,
    accentBorder: 'border-l-primary',
    iconBg: 'bg-primary/10 dark:bg-primary/20',
    iconColor: 'text-primary',
    href: `${base}/skills`,
  };

  const cards = [...personalCards, informationalCard];

  return (
    <div data-tutorial="stats-cards" className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {cards.map((card, index) => {
        const content = (
          <Card
            className={cn(
              'relative overflow-hidden bg-card shadow-sm transition-shadow hover:shadow-md',
              'border-l-[3px] entrance-fade entrance-stagger',
              card.accentBorder,
              card.href && 'cursor-pointer',
            )}
            style={{ '--stagger-index': index } as React.CSSProperties}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{card.title}</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {typeof card.value === 'string' ? card.value : <AnimatedValue target={card.value} />}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                </div>
                <div className={cn('p-3 rounded-xl', card.iconBg)}>
                  <card.icon className={cn('h-6 w-6', card.iconColor)} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
        return card.href ? (
          <Link
            key={card.title}
            href={card.href}
            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
          >
            {content}
          </Link>
        ) : (
          <div key={card.title}>{content}</div>
        );
      })}
    </div>
  );
}
