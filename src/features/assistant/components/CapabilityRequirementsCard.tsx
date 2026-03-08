'use client';

/**
 * CapabilityRequirementsCard Component
 *
 * Compact capability display for AI chat responses.
 * Shows the capability name, requirements inline, and action links.
 */

import { ExternalLink, Star, Target } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';

import type { DetectedCapability } from '../utils/pattern-detectors';

interface CapabilityRequirementsCardProps {
  capability: DetectedCapability;
  className?: string;
  capabilityId?: string;
  tenantSlug?: string;
  onFindCandidates?: () => void;
  onViewDetails?: () => void;
}

export function CapabilityRequirementsCard({
  capability,
  className,
  capabilityId: _capabilityId,
  tenantSlug,
}: CapabilityRequirementsCardProps) {
  const t = useTranslations('genui');
  const hasRequirements = capability.requirements && capability.requirements.length > 0;
  const capabilitiesUrl = tenantSlug ? `/t/${tenantSlug}/capabilities` : undefined;

  return (
    <div className={cn('rounded-lg border bg-muted/20 overflow-hidden', className)}>
      {/* Header row */}
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 border-b">
        <div className="p-1 rounded bg-purple-500/15 shrink-0">
          <Target className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
        </div>
        <span className="font-medium text-sm truncate">{capability.name}</span>
        {hasRequirements && (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 ml-auto shrink-0">
            {capability.requirements!.length} {t('requirements').toLowerCase()}
          </Badge>
        )}
        {capabilitiesUrl && (
          <Link
            href={capabilitiesUrl}
            className="ml-auto shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={t('viewDetails')}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {/* Requirements list */}
      {hasRequirements && (
        <div className="px-3 py-2 flex flex-wrap gap-1.5">
          {capability.requirements!.map((req, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-[10px] gap-1 px-2 py-0.5 bg-purple-500/10 text-purple-700 dark:text-purple-300 border-0"
            >
              {req.skill}
              <span className="flex items-center gap-0.5 opacity-80">
                <Star className="h-2 w-2 fill-current" />
                {req.level}+
              </span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
