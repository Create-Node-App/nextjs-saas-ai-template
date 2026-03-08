'use client';

/**
 * Capability Match Card
 *
 * Molecule for "Top Capability Matches" and capability lists: capability name,
 * fit percentage badge, progress bar, and "X of Y required skills" text.
 * Used in ProfileClient (Overview and Capabilities tab).
 */

import { Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';

export interface CapabilityMatchCardProps {
  /** Capability name (e.g. "Data Engineer") */
  name: string;
  /** Number of required skills the user meets */
  matchCount: number;
  /** Total number of required skills for this capability */
  totalRequired: number;
  /** Text for "X of Y required skills" (for i18n). Default: "{matchCount} of {totalRequired} required skills" */
  detailsText?: string;
  /** Badge label: "100%" or "100% match". Default: "{percentage}%" */
  badgeSuffix?: string;
  /** Show graduation cap icon before name */
  showIcon?: boolean;
  /** Compact layout (e.g. for Top Capability Matches list) */
  compact?: boolean;
  /** Optional action (e.g. Radar button) rendered in the header row after the badge */
  action?: ReactNode;
  className?: string;
}

export function CapabilityMatchCard({
  name,
  matchCount,
  totalRequired,
  detailsText,
  badgeSuffix = '',
  showIcon = false,
  compact = false,
  action,
  className,
}: CapabilityMatchCardProps) {
  const percentage = totalRequired > 0 ? Math.round((matchCount / totalRequired) * 100) : 0;
  const details = detailsText ?? `${matchCount} of ${totalRequired} required skills`;
  const badgeLabel = `${percentage}%${badgeSuffix}`;

  return (
    <div className={cn('space-y-1', !compact && 'space-y-2', className)}>
      <div className={cn('flex items-center justify-between', compact ? 'gap-2' : 'mb-3 gap-2')}>
        <span
          className={cn(
            'flex items-center gap-2 font-medium text-foreground min-w-0',
            compact ? 'text-sm' : 'font-semibold',
          )}
        >
          {showIcon && <Sparkles className="h-4 w-4 text-cyan-500 shrink-0" aria-hidden />}
          <span className="truncate">{name}</span>
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant={percentage >= 80 ? 'default' : 'secondary'}
            className={percentage >= 80 ? 'bg-primary border-0 text-white' : ''}
          >
            {badgeLabel}
          </Badge>
          {action}
        </div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            percentage >= 80 && 'bg-primary',
            percentage >= 50 && percentage < 80 && 'bg-primary/80',
            percentage < 50 && 'bg-primary/50',
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className={cn('text-muted-foreground', compact ? 'text-xs' : 'text-sm mt-2')}>{details}</p>
    </div>
  );
}
