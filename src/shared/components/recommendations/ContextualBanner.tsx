'use client';

/**
 * Contextual Banner Component
 *
 * Displays contextual recommendations and suggestions based on the current page context.
 */

import { ArrowRight, Lightbulb, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { RelatedContentCard } from './RelatedContentCard';

interface Recommendation {
  id: string;
  title: string;
  slug: string;
  docType: 'role_profile' | 'roadmap' | 'training' | 'capability_doc';
  similarity: number;
  reason: string;
  tags?: string[] | null;
  relevanceLevel?: string | null;
}

interface ContextualBannerProps {
  tenantSlug: string;
  documentId?: string;
  documentType?: 'role_profile' | 'roadmap' | 'training' | 'capability_doc';
  skillNames?: string[];
  tags?: string[];
  limit?: number;
  variant?: 'default' | 'compact' | 'expanded';
}

export function ContextualBanner({
  tenantSlug,
  documentId,
  documentType,
  skillNames = [],
  tags = [],
  limit = 5,
  variant = 'default',
}: ContextualBannerProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const skillNamesString = useMemo(() => skillNames.join(','), [skillNames]);
  const tagsString = useMemo(() => tags.join(','), [tags]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (documentId) params.append('documentId', documentId);
        if (documentType) params.append('documentType', documentType);
        if (skillNames.length > 0) params.append('skills', skillNamesString);
        if (tags.length > 0) params.append('tags', tagsString);
        params.append('limit', limit.toString());

        const response = await fetch(`/api/tenants/${tenantSlug}/recommendations?${params.toString()}`);
        if (response.ok) {
          const data = (await response.json()) as { recommendations?: Recommendation[] };
          setRecommendations(data.recommendations || []);
        }
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [tenantSlug, documentId, documentType, skillNamesString, tagsString, limit, skillNames.length, tags.length]);

  if (isLoading || recommendations.length === 0) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <div className="recommendation-banner rounded-xl shadow-md p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-foreground">
              {recommendations.length} related {recommendations.length === 1 ? 'document' : 'documents'} found
            </span>
          </div>
          <Link href={`/t/${tenantSlug}/knowledge?related=${documentId || ''}`}>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              View all
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendation-banner rounded-xl shadow-md p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary">
          <Lightbulb className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-base mb-1 text-foreground">Recommended for you</h3>
          <p className="text-sm text-muted-foreground">
            {documentId
              ? 'Related documents you might find useful'
              : skillNames.length > 0
                ? `Based on your skills: ${skillNames.slice(0, 3).join(', ')}`
                : 'Content tailored to your interests'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.slice(0, variant === 'expanded' ? 6 : 3).map((rec) => (
          <RelatedContentCard
            key={rec.id}
            id={rec.id}
            title={rec.title}
            slug={rec.slug}
            docType={rec.docType}
            tenantSlug={tenantSlug}
            similarity={rec.similarity}
            tags={rec.tags}
            relevanceLevel={rec.relevanceLevel}
          />
        ))}
      </div>

      {recommendations.length > (variant === 'expanded' ? 6 : 3) && (
        <div className="mt-4 text-center">
          <Link href={`/t/${tenantSlug}/knowledge?related=${documentId || ''}`}>
            <Button variant="outline" size="sm">
              View all {recommendations.length} recommendations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
