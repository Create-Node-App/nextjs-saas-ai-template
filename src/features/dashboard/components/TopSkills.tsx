'use client';

/**
 * Top Skills Component
 *
 * Displays the user's highest-rated skills with beautiful visual indicators.
 * Supports both list and radar chart views.
 */

import { Award, Crown, List, Medal, Radar, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadarChart,
  Radar as RechartsRadar,
  ResponsiveContainer,
} from 'recharts';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { StarRating } from '@/shared/components/ui/star-rating';
import { cn } from '@/shared/lib/utils';

import type { SkillSummary } from '../types';

interface TopSkillsProps {
  skills: SkillSummary[];
  emptyMessage?: string;
  tenantSlug?: string;
  totalSkillsCount?: number;
}

// Design System compliant: solid colors for rank badges, no gradients
// See DESIGN_SYSTEM.md Section 11.1 - medals use solid colors with shadows
const rankConfig = [
  { icon: Crown, bg: 'bg-amber-500', ring: 'ring-2 ring-amber-400/30 shadow-lg' },
  { icon: Medal, bg: 'bg-slate-400', ring: 'ring-2 ring-slate-300/30 shadow-lg' },
  { icon: Medal, bg: 'bg-amber-600', ring: 'ring-2 ring-amber-600/30 shadow-lg' },
];

export function TopSkills({ skills, emptyMessage, tenantSlug, totalSkillsCount }: TopSkillsProps) {
  const t = useTranslations('dashboard');
  const router = useRouter();
  const finalEmptyMessage = emptyMessage || 'No skills assessed yet';
  const [viewMode, setViewMode] = useState<'list' | 'radar'>('list');

  const skillsHref = tenantSlug ? `/t/${tenantSlug}/profile?tab=skills` : null;
  const isCardClickable = Boolean(skillsHref && skills.length > 0);

  const handleCardClick = () => {
    if (skillsHref) router.push(skillsHref);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isCardClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleCardClick();
    }
  };

  // Prepare radar chart data - use top 8 skills max for readability
  const radarData = skills.slice(0, 8).map((skill) => ({
    skill: skill.name.length > 15 ? `${skill.name.substring(0, 15)}...` : skill.name,
    level: skill.level,
    fullName: skill.name,
  }));

  return (
    <Card
      data-tutorial="top-skills"
      className={cn('border-0 shadow-md', isCardClickable && 'cursor-pointer transition-opacity hover:opacity-95')}
      role={isCardClickable ? 'button' : undefined}
      tabIndex={isCardClickable ? 0 : undefined}
      onClick={isCardClickable ? handleCardClick : undefined}
      onKeyDown={isCardClickable ? handleKeyDown : undefined}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              {t('myTopSkills')}
            </CardTitle>
            <CardDescription>{t('highestRatedSkills')}</CardDescription>
          </div>
          {skills.length > 0 && (
            <div className="flex gap-1 rounded-lg border bg-muted p-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewMode('list');
                }}
                className="h-8 px-3"
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
              <Button
                variant={viewMode === 'radar' ? 'default' : 'ghost'}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewMode('radar');
                }}
                className="h-8 px-3"
              >
                <Radar className="h-4 w-4 mr-1" />
                Radar
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {skills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Star className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <p className="text-muted-foreground">{finalEmptyMessage}</p>
          </div>
        ) : viewMode === 'radar' ? (
          <>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--muted-foreground))" strokeOpacity={0.3} />
                  <PolarAngleAxis
                    dataKey="skill"
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    className="text-xs"
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 5]}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  />
                  <RechartsRadar
                    name="Skill Level"
                    dataKey="level"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            {radarData.length < skills.length && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Showing top {radarData.length} of {skills.length} skills
              </p>
            )}
            {tenantSlug && totalSkillsCount && totalSkillsCount > skills.length && (
              <div className="mt-4 pt-4 border-t">
                <Link href={`/t/${tenantSlug}/profile?tab=skills`}>
                  <Button variant="outline" size="sm" className="w-full">
                    {t('viewAllSkills')} ({totalSkillsCount})
                  </Button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="space-y-3">
              {skills.map((skill, index) => {
                const rank = rankConfig[index];
                const RankIcon = rank?.icon;

                return (
                  <div
                    key={skill.id}
                    className={cn(
                      'flex items-center justify-between p-4 rounded-xl transition-all duration-200',
                      'hover:shadow-md hover:-translate-x-1',
                      'entrance-fade entrance-stagger',
                      index === 0 && 'border border-amber-400/30',
                      index === 1 && 'border border-slate-400/25',
                      index === 2 && 'border border-orange-400/25',
                      index > 2 && 'border border-border/40',
                    )}
                    style={{ '--stagger-index': index } as React.CSSProperties}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank badge — spring entrance for top 3 */}
                      <div
                        className={cn(
                          'flex items-center justify-center w-10 h-10 rounded-full text-white font-bold shadow-lg',
                          rank?.bg || 'bg-muted',
                          rank?.ring,
                        )}
                        style={
                          rank
                            ? {
                                animation: `medal-spring 0.5s ${0.15 + index * 0.15}s cubic-bezier(0.34, 1.56, 0.64, 1) both`,
                              }
                            : undefined
                        }
                      >
                        {RankIcon ? (
                          <RankIcon className="h-5 w-5" />
                        ) : (
                          <span className="text-muted-foreground">{index + 1}</span>
                        )}
                      </div>

                      {/* Skill info */}
                      <div>
                        <p className="font-semibold">{skill.name}</p>
                        {skill.category && <p className="text-xs text-muted-foreground">{skill.category}</p>}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-3">
                      <StarRating value={skill.level} size="sm" readonly />
                      {skill.trend === 'up' && (
                        <div className="flex items-center gap-1 text-green-500 text-xs font-medium">
                          <TrendingUp className="h-3 w-3" />
                          <span>Up</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {tenantSlug && totalSkillsCount && totalSkillsCount > skills.length && (
              <div className="mt-4 pt-4 border-t">
                <Link href={`/t/${tenantSlug}/profile?tab=skills`}>
                  <Button variant="outline" size="sm" className="w-full">
                    {t('viewAllSkills')} ({totalSkillsCount})
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
