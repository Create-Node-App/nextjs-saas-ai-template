'use client';

import {
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  FileSearch,
  FileText,
  GitBranch,
  Layers,
  MessageSquare,
  Search,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import { useState } from 'react';

import { Card, CardContent } from '@/shared/components/ui';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';

const FEATURE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  user: User,
  target: Target,
  sparkles: Sparkles,
  trending: TrendingUp,
  message: MessageSquare,
  users: Users,
  search: Search,
  award: Award,
  'git-branch': GitBranch,
  calendar: Calendar,
  'message-square': MessageSquare,
  book: BookOpen,
  'bar-chart': BarChart3,
  layers: Layers,
  'file-text': FileText,
  'file-search': FileSearch,
  shield: Shield,
};

interface TabData {
  id: string;
  label: string;
  color: string;
  activeColor: string;
  description: string;
  features: Array<{ title: string; description: string; iconKey: string }>;
}

const TABS: TabData[] = [
  {
    id: 'growth',
    label: 'Your Growth',
    color: 'hsl(155 70% 45%)',
    activeColor: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30',
    description: 'Track your skills, get AI recommendations, and grow your career.',
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
    id: 'team',
    label: 'Team',
    color: 'hsl(231 88% 66%)',
    activeColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30',
    description: 'Find people, celebrate wins, and explore your organization.',
    features: [
      { title: 'Directory / Team', description: 'Browse your team and organization.', iconKey: 'users' },
      { title: 'People finder', description: 'Search by skills and capabilities, export to CSV.', iconKey: 'search' },
      { title: 'Recognitions', description: 'Give and receive praise with categories.', iconKey: 'award' },
      { title: 'Org chart', description: 'Visualize reporting and structure.', iconKey: 'git-branch' },
    ],
  },
  {
    id: 'management',
    label: 'Management',
    color: 'hsl(32 95% 52%)',
    activeColor: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30',
    description: 'Lead with 1:1s, structured feedback, and OKRs.',
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
    id: 'admin',
    label: 'Administration',
    color: 'hsl(270 74% 58%)',
    activeColor: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30',
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

export function FeatureTabShowcase() {
  const [activeTab, setActiveTab] = useState('growth');
  const tab = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  return (
    <div>
      {/* Tab Bar */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              'rounded-full px-5 py-2 text-sm font-medium border transition-all duration-200',
              activeTab === t.id
                ? t.activeColor
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div key={tab.id} className="grid md:grid-cols-2 gap-8 items-start entrance-fade">
        {/* Left: Description + Feature List */}
        <div>
          <p className="text-lg text-muted-foreground mb-6">{tab.description}</p>
          <div className="space-y-3">
            {tab.features.map((feature) => {
              const Icon = FEATURE_ICONS[feature.iconKey] ?? Sparkles;
              return (
                <div key={feature.title} className="flex items-start gap-3 group">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{feature.title}</p>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Visual Preview Card */}
        <Card className="shadow-xl border-primary/10 overflow-hidden">
          <div className="h-2 w-full" style={{ background: tab.color }} />
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge className={cn('text-xs', tab.activeColor)}>{tab.label}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {tab.features.slice(0, 4).map((feature) => {
                const Icon = FEATURE_ICONS[feature.iconKey] ?? Sparkles;
                return (
                  <div key={feature.title} className="rounded-lg bg-muted/50 p-3 text-center">
                    <Icon className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" />
                    <p className="text-xs font-medium text-foreground">{feature.title}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
