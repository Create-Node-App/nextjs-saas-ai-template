'use client';

/**
 * Related Content Card Component
 *
 * Card component for displaying related knowledge documents with similarity scores.
 */

import { ArrowRight, BookOpen, GraduationCap, Map, User } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';

interface RelatedContentCardProps {
  id: string;
  title: string;
  slug: string;
  docType: 'role_profile' | 'roadmap' | 'training' | 'capability_doc';
  tenantSlug: string;
  similarity?: number;
  snippet?: string;
  tags?: string[] | null;
  relevanceLevel?: string | null;
  className?: string;
}

const typeIcons = {
  role_profile: User,
  roadmap: Map,
  training: GraduationCap,
  capability_doc: BookOpen,
};

const typeColors = {
  role_profile: 'bg-primary',
  roadmap: 'bg-emerald-500',
  training: 'bg-primary',
  capability_doc: 'bg-cyan-500',
};

export function RelatedContentCard({
  id: _id,
  title,
  slug,
  docType,
  tenantSlug,
  similarity,
  snippet,
  tags,
  relevanceLevel,
  className,
}: RelatedContentCardProps) {
  const Icon = typeIcons[docType];
  const accentColor = typeColors[docType];

  return (
    <Link href={`/t/${tenantSlug}/knowledge/${slug}`} className={`block group ${className || ''}`}>
      <Card className="shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden border border-border/60">
        <div className={`h-1 ${accentColor} opacity-50 group-hover:opacity-100 transition-opacity`} />
        <CardContent className="pt-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className={`p-1.5 rounded-lg ${accentColor} shrink-0`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors text-sm text-foreground">
                {title}
              </h3>
            </div>
            {similarity !== undefined && (
              <Badge
                variant="outline"
                className="text-xs bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/25 shrink-0"
              >
                {Math.round(similarity * 100)}%
              </Badge>
            )}
          </div>

          {/* Snippet */}
          {snippet && <p className="text-xs text-muted-foreground mt-2 line-clamp-2 italic">{snippet}</p>}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 2 && <span className="text-xs text-muted-foreground">+{tags.length - 2}</span>}
            </div>
          )}

          {/* Relevance Level */}
          {relevanceLevel && (
            <div className="mt-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>Relevance:</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${accentColor}`} style={{ width: `${parseFloat(relevanceLevel) * 100}%` }} />
                </div>
                <span className="font-mono">{Math.round(parseFloat(relevanceLevel) * 100)}%</span>
              </div>
            </div>
          )}

          {/* View Link */}
          <div className="flex items-center text-xs text-primary mt-3 group-hover:gap-2 transition-all">
            View document
            <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
