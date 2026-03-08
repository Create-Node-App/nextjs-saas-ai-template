'use client';

/**
 * Contextual Tips Component
 *
 * Shows relevant tips and suggestions based on user's profile state.
 */

import { ArrowRight, Lightbulb, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

interface Tip {
  id: string;
  title: string;
  description: string;
  href?: string;
  actionLabel?: string;
  type: 'info' | 'action' | 'success';
}

interface ContextualTipsProps {
  tenantSlug: string;
  profileCompletion: number;
  skillsCount: number;
  evidenceCount: number;
  pendingSkillsCount?: number;
  className?: string;
}

export function ContextualTips({
  tenantSlug,
  profileCompletion,
  skillsCount,
  evidenceCount,
  pendingSkillsCount = 0,
  className,
}: ContextualTipsProps) {
  const [dismissedTips, setDismissedTips] = useState<Set<string>>(new Set());

  const dismissTip = useCallback((tipId: string) => {
    setDismissedTips((prev) => new Set([...prev, tipId]));
  }, []);

  // Generate tips based on user state
  const tips: Tip[] = [];

  // New user - hasn't uploaded anything
  if (profileCompletion < 20 && skillsCount === 0) {
    tips.push({
      id: 'welcome',
      title: 'Welcome to A8n Hub! 🎉',
      description: 'Get started by uploading your CV. Our AI will extract your skills automatically.',
      href: `/t/${tenantSlug}/onboarding/cv`,
      actionLabel: 'Upload CV',
      type: 'action',
    });
  }

  // Has pending skills to review
  if (pendingSkillsCount > 0) {
    tips.push({
      id: 'pending-skills',
      title: `You have ${pendingSkillsCount} skills to review`,
      description: 'Review and confirm your skill levels to complete your profile.',
      href: `/t/${tenantSlug}/profile?tab=evidence`,
      actionLabel: 'Review Skills',
      type: 'action',
    });
  }

  // Has skills but no self-assessment
  if (skillsCount > 0 && skillsCount < 5) {
    tips.push({
      id: 'add-more-skills',
      title: 'Expand your skill profile',
      description: 'Add more skills through self-assessment to get better role matching.',
      href: `/t/${tenantSlug}/self-assessment`,
      actionLabel: 'Self-assess',
      type: 'info',
    });
  }

  // No evidence uploaded
  if (evidenceCount === 0 && skillsCount > 0) {
    tips.push({
      id: 'upload-evidence',
      title: 'Add evidence to your skills',
      description: 'Upload documents, certificates, or links to validate your skills.',
      href: `/t/${tenantSlug}/profile?tab=evidence`,
      actionLabel: 'Add Evidence',
      type: 'info',
    });
  }

  // Profile completion milestone
  if (profileCompletion >= 80 && profileCompletion < 100) {
    tips.push({
      id: 'almost-complete',
      title: 'Almost there! 🚀',
      description: 'Complete a few more items to reach 100% profile completion.',
      href: `/t/${tenantSlug}/profile`,
      actionLabel: 'View Profile',
      type: 'success',
    });
  }

  // Filter dismissed tips
  const visibleTips = tips.filter((tip) => !dismissedTips.has(tip.id));

  if (visibleTips.length === 0) {
    return null;
  }

  return (
    <div data-tutorial="contextual-tips" className={cn('space-y-3', className)}>
      {visibleTips.slice(0, 2).map((tip) => (
        <div
          key={tip.id}
          className={cn(
            'relative flex items-start gap-4 p-4 rounded-lg border-0 shadow-md transition-all bg-card',
            tip.type === 'action' && 'ring-1 ring-primary/20',
            tip.type === 'info' && 'ring-1 ring-blue-500/20',
            tip.type === 'success' && 'ring-1 ring-green-500/20',
          )}
        >
          <div
            className={cn(
              'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
              tip.type === 'action' && 'bg-primary/10 text-primary',
              tip.type === 'info' && 'bg-blue-500/10 text-blue-500',
              tip.type === 'success' && 'bg-green-500/10 text-green-500',
            )}
          >
            {tip.type === 'action' ? (
              <Sparkles className="h-5 w-5" />
            ) : tip.type === 'success' ? (
              <Lightbulb className="h-5 w-5" />
            ) : (
              <Lightbulb className="h-5 w-5" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground">{tip.title}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{tip.description}</p>
            {tip.href && tip.actionLabel && (
              <Button asChild size="sm" variant="link" className="p-0 h-auto mt-2">
                <Link href={tip.href}>
                  {tip.actionLabel}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            )}
          </div>

          <button
            onClick={() => dismissTip(tip.id)}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss tip"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
