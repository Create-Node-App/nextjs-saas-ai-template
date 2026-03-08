/**
 * Landing page data: feature blocks and pricing plans for demo.
 */

import type { LucideIcon } from 'lucide-react';

export interface FeatureItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface FeatureBlock {
  title: string;
  description: string;
  features: FeatureItem[];
}

export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

// Feature block with icon keys (icons resolved in page component)
export interface FeatureBlockWithIconKeys {
  title: string;
  description: string;
  features: Array<{ title: string; description: string; iconKey: string }>;
}

// Re-export for use in page (icons passed from page to avoid loading in server module)
export const LANDING_FEATURE_BLOCKS: FeatureBlockWithIconKeys[] = [
  {
    title: 'For you',
    description: 'Your profile, skills, and growth in one place.',
    features: [
      {
        title: 'Profile',
        description: 'Skills, interests, evidence, capabilities, and recognitions.',
        iconKey: 'user',
      },
      { title: 'Self-assessment', description: 'Rate your skills with configurable levels.', iconKey: 'target' },
      { title: 'Quiz (AI)', description: 'AI-generated quizzes to validate your level.', iconKey: 'sparkles' },
      { title: 'Growth paths', description: 'Suggested learning paths based on your goals.', iconKey: 'trending' },
      { title: 'AI Assistant', description: 'Chat for career guidance and skill recommendations.', iconKey: 'message' },
    ],
  },
  {
    title: 'Team & people',
    description: 'Find people and celebrate wins.',
    features: [
      { title: 'Directory / Team', description: 'Browse your team and organization.', iconKey: 'users' },
      { title: 'People finder', description: 'Search by skills and capabilities, export to CSV.', iconKey: 'search' },
      { title: 'Recognitions', description: 'Give and receive praise with categories.', iconKey: 'award' },
      { title: 'Org chart', description: 'Visualize reporting and structure.', iconKey: 'git-branch' },
    ],
  },
  {
    title: 'Management',
    description: 'Lead with 1:1s, feedback, and goals.',
    features: [
      { title: '1:1 meetings', description: 'Agenda and notes with @mentions.', iconKey: 'calendar' },
      {
        title: 'Structured feedback',
        description: 'Strength, improvement, and general feedback.',
        iconKey: 'message-square',
      },
      { title: 'Praise recommendations', description: 'AI-suggested recognitions for achievements.', iconKey: 'award' },
      { title: 'Assignments', description: 'Assign learning (roadmaps/trainings) to your team.', iconKey: 'book' },
      { title: 'OKRs', description: 'Team objectives and key results.', iconKey: 'target' },
      { title: 'Analytics', description: 'Team overview and performance insights.', iconKey: 'bar-chart' },
    ],
  },
  {
    title: 'Administration',
    description: 'Full control for admins and HR.',
    features: [
      { title: 'Skills & capabilities', description: 'Manage taxonomy and job descriptions.', iconKey: 'layers' },
      { title: 'Knowledge base', description: 'Role profiles, roadmaps, and trainings.', iconKey: 'file-text' },
      { title: 'Members & invites', description: 'Onboard people and manage access.', iconKey: 'users' },
      { title: 'CV processing', description: 'Extract skills from uploaded CVs.', iconKey: 'file-search' },
      { title: 'Recognition categories', description: 'Configure praise categories.', iconKey: 'award' },
      { title: 'Roles, settings, audit', description: 'Permissions, tenant config, and audit log.', iconKey: 'shield' },
    ],
  },
];

export const LANDING_PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Free',
    price: '$0',
    description: 'For individuals getting started.',
    features: [
      'Profile and self-assessment',
      'Skills catalog (read-only)',
      'Knowledge base (read)',
      'Sample roadmap',
      'AI Assistant (limited)',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Team',
    price: 'Demo',
    description: 'For small teams.',
    features: [
      'Everything in Free',
      'Team directory & people finder',
      'Recognitions (give & receive)',
      'Growth paths & personal assignments',
      'OKRs (view) & org chart',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Manager',
    price: 'Demo',
    description: 'For team leads.',
    highlighted: true,
    features: [
      'Everything in Team',
      'Manager dashboard',
      '1:1 meetings (agenda & notes)',
      'Structured feedback',
      'Praise recommendations',
      'Team OKRs & assignments',
      'Analytics',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Enterprise',
    price: 'Demo',
    description: 'Full admin and HR.',
    features: [
      'Everything in Manager',
      'Admin panel: skills, capabilities, job descriptions',
      'Roadmaps & trainings management',
      'Members, invites, onboarding',
      'CV processing',
      'Recognition categories, roles, settings',
      'Audit log',
    ],
    cta: 'Contact us',
  },
];
