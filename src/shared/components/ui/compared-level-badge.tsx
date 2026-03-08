'use client';

/**
 * Compared Level Badge
 *
 * Badge showing skill/interest level vs required (target): achieved, exceeded, or not met.
 * Used in LevelIndicator, self-assessment (AssessmentStep, SkillSelector), and anywhere
 * we show "Achieved" / "Exceeded" / "X of Y required".
 */

import { Check, X } from 'lucide-react';

import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';

export interface ComparedLevelBadgeProps {
  /** Current level (0–4 display scale) */
  value: number;
  /** Required/target level (0–4 display scale) */
  target: number;
  /** Shown when value === target (met exactly) */
  achievedLabel?: string;
  /** Shown when value > target */
  exceededLabel?: string;
  /** Shown when value < target; use {value} and {target} placeholders */
  notMetLabel?: string;
  className?: string;
}

const defaultAchievedLabel = 'Achieved';
const defaultExceededLabel = 'Exceeded';
const defaultNotMetLabel = '{value} of {target} required';

export function ComparedLevelBadge({
  value,
  target,
  achievedLabel = defaultAchievedLabel,
  exceededLabel = defaultExceededLabel,
  notMetLabel = defaultNotMetLabel,
  className,
}: ComparedLevelBadgeProps) {
  const isMet = value >= target;
  const isExceeded = value > target;

  const text = isExceeded
    ? exceededLabel
    : isMet
      ? achievedLabel
      : notMetLabel.replace('{value}', String(value)).replace('{target}', String(target));

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-semibold text-xs px-2 py-0.5',
        isMet
          ? 'border-green-500/30 text-green-700 dark:text-green-400'
          : 'border-red-500/30 text-red-700 dark:text-red-400',
        className,
      )}
    >
      <span className="flex items-center gap-1.5">
        {text}
        {isMet ? (
          <Check className="h-3 w-3 text-green-600 dark:text-green-400" aria-hidden />
        ) : (
          <X className="h-3 w-3 text-red-600 dark:text-red-400" aria-hidden />
        )}
      </span>
    </Badge>
  );
}
