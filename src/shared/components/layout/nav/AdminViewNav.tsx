'use client';

import {
  Award,
  BarChart2,
  BarChart3,
  BookOpen,
  Brain,
  Building2,
  CalendarCheck,
  ClipboardList,
  Database,
  FileSpreadsheet,
  FileText,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  Link2,
  Mail,
  Palette,
  Rocket,
  Settings,
  Sliders,
  Sparkles,
  Tag,
  Target,
  UserPlus,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { canShowNav, canShowNavAny } from '@/shared/lib/permissions-ui';

import { SidebarNavItem } from '../SidebarNavItem';
import { SidebarSection } from '../SidebarSection';
import { SidebarSeparator } from '../SidebarSeparator';

interface AdminViewNavProps {
  basePath: string;
  permissions?: string[];
  /** Callback when a nav item is clicked (for closing mobile drawer) */
  onItemClick?: () => void;
}

export function AdminViewNav({ basePath, permissions, onItemClick }: AdminViewNavProps) {
  const tAdmin = useTranslations('admin');
  const tNav = useTranslations('nav');
  const adminBase = `${basePath}/admin`;

  return (
    <>
      {/* Dashboard & Analytics - root level with color */}
      {canShowNav(permissions, 'admin:dashboard') && (
        <>
          <SidebarNavItem
            href={adminBase}
            label={tAdmin('dashboard')}
            icon={LayoutDashboard}
            iconTint="primary"
            exact
            onClick={onItemClick}
          />
          <SidebarNavItem
            href={`${adminBase}/analytics`}
            label={tAdmin('analytics')}
            icon={BarChart3}
            iconTint="performance"
            onClick={onItemClick}
          />
        </>
      )}

      <SidebarSeparator />

      {/* Content & Knowledge */}
      {canShowNavAny(permissions, [
        'admin:skills',
        'admin:capabilities',
        'admin:role_profiles',
        'admin:trainings',
        'admin:roadmaps',
      ]) && (
        <SidebarSection title={tAdmin('contentManagement')} icon={<BookOpen className="h-4 w-4" />} variant="knowledge">
          {canShowNav(permissions, 'admin:skills') && (
            <SidebarNavItem href={`${adminBase}/skills`} label={tNav('skills')} icon={Sparkles} onClick={onItemClick} />
          )}
          {canShowNav(permissions, 'admin:capabilities') && (
            <SidebarNavItem
              href={`${adminBase}/capabilities`}
              label={tNav('capabilities')}
              icon={GraduationCap}
              onClick={onItemClick}
            />
          )}
          {canShowNav(permissions, 'admin:role_profiles') && (
            <SidebarNavItem
              href={`${adminBase}/role-profiles`}
              label={tNav('roleProfiles')}
              icon={Users}
              onClick={onItemClick}
            />
          )}
          {canShowNav(permissions, 'admin:trainings') && (
            <SidebarNavItem
              href={`${adminBase}/trainings`}
              label={tNav('trainings')}
              icon={BookOpen}
              onClick={onItemClick}
            />
          )}
          {canShowNav(permissions, 'admin:roadmaps') && (
            <SidebarNavItem
              href={`${adminBase}/roadmaps`}
              label={tNav('roadmaps')}
              icon={Rocket}
              onClick={onItemClick}
            />
          )}
        </SidebarSection>
      )}

      {/* People & Operations */}
      {canShowNavAny(permissions, [
        'admin:members',
        'admin:invites',
        'admin:onboard',
        'admin:processing',
        'admin:settings',
        'admin:okrs',
        'admin:review_cycles',
        'admin:recognitions',
      ]) && (
        <SidebarSection title={tAdmin('peopleManagement')} icon={<Users className="h-4 w-4" />} variant="team">
          {canShowNav(permissions, 'admin:members') && (
            <SidebarNavItem
              href={`${adminBase}/members`}
              label={tAdmin('members')}
              icon={Users}
              onClick={onItemClick}
            />
          )}
          {canShowNav(permissions, 'admin:invites') && (
            <SidebarNavItem href={`${adminBase}/invites`} label={tAdmin('invites')} icon={Mail} onClick={onItemClick} />
          )}
          {canShowNav(permissions, 'admin:onboard') && (
            <SidebarNavItem
              href={`${adminBase}/onboard-person`}
              label={tAdmin('onboardPerson')}
              icon={UserPlus}
              onClick={onItemClick}
            />
          )}
          {canShowNav(permissions, 'admin:processing') && (
            <SidebarNavItem
              href={`${adminBase}/processing`}
              label={tAdmin('processing')}
              icon={FileText}
              onClick={onItemClick}
            />
          )}
          {canShowNav(permissions, 'admin:settings') && (
            <SidebarNavItem
              href={`${adminBase}/departments`}
              label={tAdmin('departments')}
              icon={Building2}
              onClick={onItemClick}
            />
          )}
          {canShowNav(permissions, 'admin:okrs') && (
            <SidebarNavItem href={`${adminBase}/okrs`} label={tNav('okrs')} icon={Target} onClick={onItemClick} />
          )}
          {canShowNav(permissions, 'admin:review_cycles') && (
            <SidebarNavItem
              href={`${adminBase}/review-cycles`}
              label={tAdmin('reviewCycles.title')}
              icon={CalendarCheck}
              onClick={onItemClick}
            />
          )}
          {canShowNav(permissions, 'admin:review_cycles') && (
            <SidebarNavItem
              href={`${adminBase}/assessment-templates`}
              label="Assessment Templates"
              icon={FileText}
              onClick={onItemClick}
            />
          )}
          <SidebarNavItem
            href={`${adminBase}/meeting-templates`}
            label="Meeting Templates"
            icon={ClipboardList}
            onClick={onItemClick}
          />
          {canShowNav(permissions, 'admin:review_cycles') && (
            <SidebarNavItem
              href={`${adminBase}/pulse-surveys`}
              label="Pulse Surveys"
              icon={BarChart2}
              onClick={onItemClick}
            />
          )}
          {canShowNav(permissions, 'admin:recognitions') && (
            <SidebarNavItem
              href={`${adminBase}/recognitions`}
              label={tAdmin('recognitions')}
              icon={Award}
              onClick={onItemClick}
            />
          )}
        </SidebarSection>
      )}

      <SidebarSeparator />

      {/* Settings & System - collapsible by default */}
      {canShowNavAny(permissions, [
        'admin:settings',
        'admin:roles',
        'admin:audit',
        'admin:integrations',
        'admin:skills',
        'admin:members',
        'admin:capabilities',
      ]) && (
        <SidebarSection
          title="Settings & System"
          icon={<Settings className="h-4 w-4" />}
          variant="admin"
          defaultExpanded={false}
        >
          {canShowNav(permissions, 'admin:settings') && (
            <>
              <SidebarNavItem
                href={`${adminBase}/settings`}
                label={tAdmin('settingsTabs.general')}
                icon={Settings}
                exact
                onClick={onItemClick}
              />
              <SidebarNavItem
                href={`${adminBase}/settings/features`}
                label={tAdmin('settingsTabs.features')}
                icon={Sliders}
                onClick={onItemClick}
              />
              <SidebarNavItem
                href={`${adminBase}/settings/branding`}
                label={tAdmin('settingsTabs.branding')}
                icon={Palette}
                onClick={onItemClick}
              />
              <SidebarNavItem
                href={`${adminBase}/settings/skill-levels`}
                label={tAdmin('settingsTabs.skillLevels')}
                icon={GraduationCap}
                onClick={onItemClick}
              />
              <SidebarNavItem
                href={`${adminBase}/settings/categories`}
                label={tAdmin('settingsTabs.categories')}
                icon={Tag}
                onClick={onItemClick}
              />
              <SidebarNavItem
                href={`${adminBase}/settings/ai-provider`}
                label={tAdmin('settingsTabs.aiProvider')}
                icon={Brain}
                onClick={onItemClick}
              />
              <SidebarNavItem
                href={`${adminBase}/settings/storage`}
                label={tAdmin('settingsTabs.storage')}
                icon={Database}
                onClick={onItemClick}
              />
              <SidebarNavItem
                href={`${adminBase}/settings/performance`}
                label={tAdmin('settingsTabs.performance')}
                icon={Gauge}
                onClick={onItemClick}
              />
              <SidebarNavItem
                href={`${adminBase}/settings/track`}
                label={tAdmin('settingsTabs.track')}
                icon={Building2}
                onClick={onItemClick}
              />
            </>
          )}
          {canShowNav(permissions, 'admin:roles') && (
            <SidebarNavItem
              href={`${adminBase}/roles`}
              label={tAdmin('rolesAndPermissions')}
              icon={Users}
              onClick={onItemClick}
            />
          )}
          {canShowNav(permissions, 'admin:integrations') && (
            <SidebarNavItem
              href={`${adminBase}/integrations`}
              label={tAdmin('integrations')}
              icon={Link2}
              onClick={onItemClick}
            />
          )}
          {canShowNavAny(permissions, [
            'admin:skills',
            'admin:members',
            'admin:capabilities',
            'admin:integrations',
          ]) && (
            <SidebarNavItem
              href={`${adminBase}/bulk-import`}
              label={tAdmin('bulkImport')}
              icon={FileSpreadsheet}
              onClick={onItemClick}
            />
          )}
          {canShowNav(permissions, 'admin:audit') && (
            <SidebarNavItem
              href={`${adminBase}/audit-logs`}
              label={tAdmin('auditLogs')}
              icon={ClipboardList}
              onClick={onItemClick}
            />
          )}
        </SidebarSection>
      )}
    </>
  );
}
