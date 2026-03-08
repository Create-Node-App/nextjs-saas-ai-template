/**
 * Brand color registry for all integrations.
 * Maps each integration slug to its brand identity (icon, colors, Tailwind classes).
 */

import type { ComponentType } from 'react';

import {
  BambooHRIcon,
  DeelIcon,
  GitHubIcon,
  GitLabIcon,
  GoogleWorkspaceIcon,
  LatticeIcon,
  LinkedInIcon,
  ResourceGuruIcon,
  SlackIcon,
  SmallImprovementsIcon,
  WebhookBrandIcon,
} from './integration-icons';

export interface IntegrationBrand {
  icon: ComponentType<{ className?: string }>;
  color: string;
  bgLight: string;
  bgDark: string;
  borderLight: string;
  borderDark: string;
  textColor: string;
  /** Gradient for detail page header (from -> to) */
  gradientFrom: string;
  gradientTo: string;
}

export const integrationBrands: Record<string, IntegrationBrand> = {
  'resource-guru': {
    icon: ResourceGuruIcon,
    color: '#2ECC71',
    bgLight: 'bg-emerald-50',
    bgDark: 'dark:bg-emerald-950/20',
    borderLight: 'border-emerald-200',
    borderDark: 'dark:border-emerald-800',
    textColor: 'text-emerald-600',
    gradientFrom: 'from-emerald-50',
    gradientTo: 'to-emerald-100/50',
  },
  deel: {
    icon: DeelIcon,
    color: '#0038FF',
    bgLight: 'bg-blue-50',
    bgDark: 'dark:bg-blue-950/20',
    borderLight: 'border-blue-200',
    borderDark: 'dark:border-blue-800',
    textColor: 'text-blue-600',
    gradientFrom: 'from-blue-50',
    gradientTo: 'to-blue-100/50',
  },
  'small-improvements': {
    icon: SmallImprovementsIcon,
    color: '#FF6B35',
    bgLight: 'bg-orange-50',
    bgDark: 'dark:bg-orange-950/20',
    borderLight: 'border-orange-200',
    borderDark: 'dark:border-orange-800',
    textColor: 'text-orange-600',
    gradientFrom: 'from-orange-50',
    gradientTo: 'to-orange-100/50',
  },
  webhooks: {
    icon: WebhookBrandIcon,
    color: '#6366F1',
    bgLight: 'bg-indigo-50',
    bgDark: 'dark:bg-indigo-950/20',
    borderLight: 'border-indigo-200',
    borderDark: 'dark:border-indigo-800',
    textColor: 'text-indigo-600',
    gradientFrom: 'from-indigo-50',
    gradientTo: 'to-indigo-100/50',
  },
  'google-workspace': {
    icon: GoogleWorkspaceIcon,
    color: '#4285F4',
    bgLight: 'bg-sky-50',
    bgDark: 'dark:bg-sky-950/20',
    borderLight: 'border-sky-200',
    borderDark: 'dark:border-sky-800',
    textColor: 'text-sky-600',
    gradientFrom: 'from-sky-50',
    gradientTo: 'to-sky-100/50',
  },
  slack: {
    icon: SlackIcon,
    color: '#4A154B',
    bgLight: 'bg-purple-50',
    bgDark: 'dark:bg-purple-950/20',
    borderLight: 'border-purple-200',
    borderDark: 'dark:border-purple-800',
    textColor: 'text-purple-600',
    gradientFrom: 'from-purple-50',
    gradientTo: 'to-purple-100/50',
  },
  github: {
    icon: GitHubIcon,
    color: '#24292E',
    bgLight: 'bg-gray-50',
    bgDark: 'dark:bg-gray-950/20',
    borderLight: 'border-gray-300',
    borderDark: 'dark:border-gray-700',
    textColor: 'text-gray-700',
    gradientFrom: 'from-gray-50',
    gradientTo: 'to-gray-100/50',
  },
  gitlab: {
    icon: GitLabIcon,
    color: '#FC6D26',
    bgLight: 'bg-orange-50',
    bgDark: 'dark:bg-orange-950/20',
    borderLight: 'border-orange-200',
    borderDark: 'dark:border-orange-800',
    textColor: 'text-orange-600',
    gradientFrom: 'from-orange-50',
    gradientTo: 'to-orange-100/50',
  },
  linkedin: {
    icon: LinkedInIcon,
    color: '#0A66C2',
    bgLight: 'bg-blue-50',
    bgDark: 'dark:bg-blue-950/20',
    borderLight: 'border-blue-200',
    borderDark: 'dark:border-blue-800',
    textColor: 'text-blue-700',
    gradientFrom: 'from-blue-50',
    gradientTo: 'to-blue-100/50',
  },
  bamboohr: {
    icon: BambooHRIcon,
    color: '#73C41D',
    bgLight: 'bg-lime-50',
    bgDark: 'dark:bg-lime-950/20',
    borderLight: 'border-lime-200',
    borderDark: 'dark:border-lime-800',
    textColor: 'text-lime-600',
    gradientFrom: 'from-lime-50',
    gradientTo: 'to-lime-100/50',
  },
  lattice: {
    icon: LatticeIcon,
    color: '#6C5CE7',
    bgLight: 'bg-violet-50',
    bgDark: 'dark:bg-violet-950/20',
    borderLight: 'border-violet-200',
    borderDark: 'dark:border-violet-800',
    textColor: 'text-violet-600',
    gradientFrom: 'from-violet-50',
    gradientTo: 'to-violet-100/50',
  },
} as const;

/**
 * Get brand info for an integration by slug, with fallback.
 */
export function getIntegrationBrand(slug: string): IntegrationBrand | undefined {
  return integrationBrands[slug];
}
