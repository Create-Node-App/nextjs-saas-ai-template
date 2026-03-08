'use client';

/**
 * SkillInlineCard Component
 *
 * Inline skill display with level indicator for AI chat responses.
 */

import { Code, Search, Star } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Badge } from '@/shared/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/shared/components/ui/hover-card';
import { StarRating } from '@/shared/components/ui/star-rating';
import { cn } from '@/shared/lib/utils';

import type { DetectedSkill } from '../utils/pattern-detectors';

interface SkillInlineCardProps {
  skill: DetectedSkill;
  className?: string;
  tenantSlug?: string;
  onFindPeople?: () => void;
}

export function SkillInlineCard({ skill, className, tenantSlug, onFindPeople }: SkillInlineCardProps) {
  const t = useTranslations('genui');
  const peopleUrl = tenantSlug ? `/t/${tenantSlug}/people?skill=${encodeURIComponent(skill.name)}` : undefined;

  const content = (
    <Badge
      variant="secondary"
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 cursor-pointer transition-all',
        'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20',
        'hover:bg-blue-500/20 hover:border-blue-500/40',
        className,
      )}
    >
      <Code className="h-3 w-3" />
      <span className="font-medium">{skill.name}</span>
      {skill.level !== undefined && (
        <span className="flex items-center gap-0.5 text-xs opacity-80">
          <Star className="h-2.5 w-2.5 fill-current" />
          {skill.level}
        </span>
      )}
    </Badge>
  );

  if (!peopleUrl && !onFindPeople) {
    return content;
  }

  const findPeopleButton = peopleUrl ? (
    <Link
      href={peopleUrl}
      className="w-full flex items-center justify-center gap-1.5 text-xs text-primary hover:bg-primary/5 rounded-md py-1.5 transition-colors"
    >
      <Search className="h-3 w-3" />
      {t('findPeopleWithSkill')}
    </Link>
  ) : (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onFindPeople?.();
      }}
      className="w-full flex items-center justify-center gap-1.5 text-xs text-primary hover:bg-primary/5 rounded-md py-1.5 transition-colors"
    >
      <Search className="h-3 w-3" />
      {t('findPeopleWithSkill')}
    </button>
  );

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>{content}</HoverCardTrigger>
      <HoverCardContent className="w-56" side="top" align="center">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-blue-500/10">
              <Code className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-sm">{skill.name}</p>
              {skill.level !== undefined && (
                <div className="flex items-center gap-1 mt-0.5">
                  <StarRating value={skill.level} size="sm" readonly />
                  <span className="text-xs text-muted-foreground">Lv. {skill.level}</span>
                </div>
              )}
            </div>
          </div>
          {findPeopleButton}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

/**
 * SkillInlineList Component
 *
 * Renders a list of skills inline with proper spacing.
 */
interface SkillInlineListProps {
  skills: DetectedSkill[];
  className?: string;
  tenantSlug?: string;
  onFindPeople?: (skill: DetectedSkill) => void;
}

export function SkillInlineList({ skills, className, tenantSlug, onFindPeople }: SkillInlineListProps) {
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {skills.map((skill, index) => (
        <SkillInlineCard
          key={`${skill.name}-${index}`}
          skill={skill}
          tenantSlug={tenantSlug}
          onFindPeople={onFindPeople ? () => onFindPeople(skill) : undefined}
        />
      ))}
    </div>
  );
}
