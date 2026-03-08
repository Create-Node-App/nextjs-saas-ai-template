/**
 * Types for Resource Guru synchronization service
 */

export type SyncMode = 'clients_projects' | 'by_user';

export interface SyncResourceGuruAssignmentsParams {
  tenantSlug: string;
  userId: string;
  accountSubdomain: string;
  mode: SyncMode;
  clientIds?: number[];
  projectIds?: number[];
  resourceIds?: number[];
  startDate: string;
  endDate: string;
  /** If true, delete all assignments for this tenant + account before syncing. */
  clearBeforeSync?: boolean;
  /** Optional callback for real-time progress messages (e.g. for streaming UI). */
  onProgress?: (message: string) => void;
  /** Optional default project manager (person ID). Applied only when an existing project has no manager. */
  defaultManagerPersonId?: string;
}

export interface SyncResourceGuruAssignmentsResult {
  success: boolean;
  error?: string;
  created?: number;
  updated?: number;
}

export interface AssignmentRow {
  id: string;
  personId: string;
  personDisplayName: string;
  rgResourceName: string | null;
  rgProjectName: string | null;
  rgClientName: string | null;
  projectId: string | null;
  projectName: string | null;
  clientName: string | null;
  startDate: string;
  endDate: string;
  durationMinutes: number;
  billableMinutes: number;
  availableMinutes: number | null;
  rgBookingId: number;
  syncedAt: Date;
}

/** Extended assignment row with downtime capacity information. */
export interface AssignmentRowWithCapacity extends Omit<AssignmentRow, 'rgBookingId' | 'syncedAt'> {
  /** Total downtime/time-off minutes for this person in the period. */
  downtimeMinutes: number | null;
  /** Total overtime minutes for this person in the period. */
  overtimeMinutes: number | null;
}

export interface ListAssignmentsFilterOptions {
  subdomain?: string;
  startDate?: string;
  endDate?: string;
  projectIds?: string[];
}

export interface ResourceAggregateRow {
  personId: string;
  personDisplayName: string;
  rgResourceName: string | null;
  availableMinutes: number;
  downtimeMinutes: number;
  durationMinutes: number;
  billableMinutes: number;
}

export interface ProjectAggregateRow {
  projectId: string | null;
  clientId: string | null;
  projectName: string | null;
  clientName: string | null;
  rgProjectName: string | null;
  rgClientName: string | null;
  availableMinutes: number;
  durationMinutes: number;
  billableMinutes: number;
}

export interface ClientAggregateRow {
  clientId: string | null;
  clientName: string | null;
  rgClientName: string | null;
  availableMinutes: number;
  durationMinutes: number;
  billableMinutes: number;
}

export interface PersonCapacitySummary {
  personId: string;
  rawCapacityMinutes: number;
  downtimeMinutes: number;
  overtimeMinutes: number;
  downtimeByType: Record<string, number>;
}

export interface AvailabilityRow {
  availableMinutes: number;
  downtimeMinutes: number;
  overtimeMinutes: number;
  downtimeByType: Record<string, number>;
}

export interface PersonSyncStats {
  bookings: number;
  projects: Set<string>;
}

export interface PerDayDuration {
  date: string;
  durationMinutes: number;
}
