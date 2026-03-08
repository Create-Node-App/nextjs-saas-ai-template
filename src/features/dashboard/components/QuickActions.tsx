'use client';

/**
 * Quick Actions Component
 *
 * Grid of common actions with beautiful hover effects and i18n support.
 */

import { ClipboardCheck, Heart, MessageSquare, TrendingUp, Upload } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';

interface QuickActionsProps {
  tenantSlug: string;
  showOnboarding?: boolean;
  pendingSkillsCount?: number;
  hasInterests?: boolean;
}

export function QuickActions({
  tenantSlug,
  showOnboarding = true,
  pendingSkillsCount = 0,
  hasInterests = false,
}: QuickActionsProps) {
  const t = useTranslations('dashboard');
  const tEvidence = useTranslations('evidence');
  const tAssistant = useTranslations('assistant');

  const actions = useMemo(
    () => [
      {
        href: `/t/${tenantSlug}/onboarding/cv`,
        icon: Upload,
        label: tEvidence('uploadCV'),
        description: t('aiAssistedOnboarding'),
        show: showOnboarding,
        iconBg: 'bg-violet-500/10',
        iconColor: 'text-violet-500',
        badge: null,
      },
      {
        href: `/t/${tenantSlug}/self-assessment`,
        icon: ClipboardCheck,
        label: t('selfAssessment'),
        description: t('rateYourSkills'),
        show: true,
        iconBg: 'bg-green-500/10',
        iconColor: 'text-green-500',
        badge: pendingSkillsCount > 0 ? `${pendingSkillsCount} pending` : null,
      },
      {
        href: `/t/${tenantSlug}/profile?tab=interests`,
        icon: Heart,
        label: t('interests'),
        description: t('declareSkillInterests'),
        show: !hasInterests,
        iconBg: 'bg-rose-500/10',
        iconColor: 'text-rose-500',
        badge: null,
      },
      {
        href: `/t/${tenantSlug}/growth`,
        icon: TrendingUp,
        label: t('growthPaths'),
        description: t('exploreCareerDevelopment'),
        show: true,
        iconBg: 'bg-blue-500/10',
        iconColor: 'text-blue-500',
        badge: null,
      },
      {
        href: `/t/${tenantSlug}/assistant`,
        icon: MessageSquare,
        label: tAssistant('title'),
        description: t('getPersonalizedHelp'),
        show: true,
        iconBg: 'bg-amber-500/10',
        iconColor: 'text-amber-500',
        badge: null,
      },
    ],

    [tenantSlug, showOnboarding, pendingSkillsCount, hasInterests, t, tEvidence, tAssistant],
  );

  return (
    <Card data-tutorial="quick-actions" className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">{t('quickActions')}</CardTitle>
        <CardDescription>{t('commonTasks')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {actions
          .filter((a) => a.show)
          .map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                'group relative flex items-center gap-4 p-4 rounded-xl border bg-card',
                'transition-shadow duration-200 hover:shadow-md',
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center w-12 h-12 rounded-xl',
                  'transition-transform duration-300 group-hover:scale-110',
                  action.iconBg,
                  action.iconColor,
                )}
              >
                <action.icon className="h-5 w-5" />
              </div>

              {/* Text content */}
              <div className="relative z-10 text-left flex-1">
                <p className="font-semibold group-hover:text-primary transition-colors">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>

              {/* Badge for pending items */}
              {action.badge && (
                <span className="relative z-10 text-xs bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200 px-2 py-1 rounded-full font-medium">
                  {action.badge}
                </span>
              )}
            </Link>
          ))}
      </CardContent>
    </Card>
  );
}
