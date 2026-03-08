/**
 * Dashboard Feature Types
 */

export interface DashboardStats {
  totalSkills: number;
  assessedSkills: number;
  teamSize: number;
  topSkills: SkillSummary[];
  recentActivity: ActivityItem[];
  profileCompletion: number;
  conversationsCount: number;
  pendingSkillsCount?: number;
  capabilitiesCount?: number;
  growthPathsCount?: number;
  capabilitiesMatched?: number;
  capabilitiesTotal?: number;
}

export interface SkillSummary {
  id: string;
  name: string;
  level: number; // 1-5
  category?: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface ActivityItem {
  id: string;
  type: 'assessment' | 'interest' | 'evidence' | 'profile_update' | 'ai_conversation';
  title: string;
  description?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface GrowthSuggestion {
  skillId: string;
  skillName: string;
  currentLevel: number;
  targetLevel: number;
  relevance: 'high' | 'medium' | 'low';
  reason: string;
}

export interface DashboardStatsResult {
  success: boolean;
  stats?: DashboardStats;
  error?: string;
}

export interface GrowthSuggestionsResult {
  success: boolean;
  suggestions?: GrowthSuggestion[];
  error?: string;
}
