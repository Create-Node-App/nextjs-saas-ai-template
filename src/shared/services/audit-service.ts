/**
 * Audit Service - System-wide audit logging
 *
 * Records important actions with full context including:
 * - Actor (who did it)
 * - Action (what they did)
 * - Entity (what they did it to)
 * - Request correlation (trace_id, request_id)
 * - AI context (model version, prompt version)
 */

import { headers } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/shared/db';
import { auditEvents } from '@/shared/db/schema';
import { logger } from '@/shared/lib/logger';

export interface AuditLogInput {
  tenantId?: string;
  actorId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  aiModelVersion?: string;
  aiPromptVersion?: string;
}

/**
 * Get request correlation IDs from headers or generate new ones
 */
export async function getCorrelationIds(): Promise<{ requestId: string; traceId: string }> {
  const headersList = await headers();
  return {
    requestId: headersList.get('x-request-id') || uuidv4(),
    traceId: headersList.get('x-trace-id') || uuidv4(),
  };
}

/**
 * Log an audit event
 */
export async function logAuditEvent(input: AuditLogInput): Promise<string> {
  const { requestId, traceId } = await getCorrelationIds();
  const headersList = await headers();

  const [result] = await db
    .insert(auditEvents)
    .values({
      tenantId: input.tenantId,
      actorId: input.actorId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      changes: input.changes,
      metadata: input.metadata,
      requestId,
      traceId,
      ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip'),
      userAgent: headersList.get('user-agent'),
      aiModelVersion: input.aiModelVersion,
      aiPromptVersion: input.aiPromptVersion,
    })
    .returning({ id: auditEvents.id });

  // Also log to structured logger
  logger.info({
    audit: true,
    ...input,
    requestId,
    traceId,
  });

  return result.id;
}

/**
 * Common audit actions
 */
export const AuditActions = {
  // Person actions
  PERSON_CREATED: 'person.created',
  PERSON_UPDATED: 'person.updated',
  PERSON_DELETED: 'person.deleted',
  PERSON_PROFILE_INITIALIZED: 'person.profile_initialized',

  // Assessment actions
  ASSESSMENT_CREATED: 'assessment.created',
  ASSESSMENT_UPDATED: 'assessment.updated',
  ASSESSMENT_DELETED: 'assessment.deleted',

  // Skill actions
  SKILL_CREATED: 'skill.created',
  SKILL_UPDATED: 'skill.updated',
  SKILL_DELETED: 'skill.deleted',
  SKILL_VERIFIED: 'skill.verified',

  // Capability actions
  CAPABILITY_CREATED: 'capability.created',
  CAPABILITY_UPDATED: 'capability.updated',
  CAPABILITY_DELETED: 'capability.deleted',

  // File actions
  FILE_UPLOADED: 'file.uploaded',
  FILE_DELETED: 'file.deleted',
  CV_PROCESSING_STARTED: 'cv.processing_started',
  CV_PROCESSING_COMPLETED: 'cv.processing_completed',
  CV_PROCESSING_FAILED: 'cv.processing_failed',

  // Knowledge document actions
  KNOWLEDGE_DOC_CREATED: 'knowledge_doc.created',
  KNOWLEDGE_DOC_UPDATED: 'knowledge_doc.updated',
  KNOWLEDGE_DOC_PUBLISHED: 'knowledge_doc.published',
  KNOWLEDGE_DOC_DELETED: 'knowledge_doc.deleted',

  // Interest actions
  INTEREST_DECLARED: 'interest.declared',
  INTEREST_REMOVED: 'interest.removed',

  // AI actions
  AI_CONVERSATION: 'ai.conversation',
  AI_ROADMAP_GENERATED: 'ai.roadmap_generated',

  // Integration sync actions
  INTEGRATION_SYNC_COMPLETED: 'integration.sync_completed',
  INTEGRATION_SYNC_FAILED: 'integration.sync_failed',

  // Review cycle actions
  REVIEW_CYCLE_CREATED: 'review_cycle.created',
  REVIEW_CYCLE_LAUNCHED: 'review_cycle.launched',
  REVIEW_CYCLE_MOVED_TO_CALIBRATION: 'review_cycle.moved_to_calibration',
  REVIEW_CYCLE_CLOSED: 'review_cycle.closed',
  REVIEW_CYCLE_CANCELLED: 'review_cycle.cancelled',
  PEER_NOMINATION_SUBMITTED: 'peer_nomination.submitted',
  PEER_NOMINATION_APPROVED: 'peer_nomination.approved',
  PEER_NOMINATION_REJECTED: 'peer_nomination.rejected',

  // Pulse survey actions
  PULSE_SURVEY_CREATED: 'pulse_survey.created',
  PULSE_SURVEY_ACTIVATED: 'pulse_survey.activated',
  PULSE_RESPONSE_SUBMITTED: 'pulse_response.submitted',

  // Meetings + Gemini actions
  MEETING_CALENDAR_SYNCED: 'meeting.calendar_synced',
  MEETING_ARTIFACTS_IMPORTED: 'meeting.artifacts_imported',
  MEETING_NOTES_DRAFT_GENERATED: 'meeting.notes_draft_generated',
  MEETING_NOTES_DRAFT_APPROVED: 'meeting.notes_draft_approved',

  // Auth actions
  AUTH_LOGIN: 'auth.login',
  AUTH_LOGOUT: 'auth.logout',
} as const;

export type AuditAction = (typeof AuditActions)[keyof typeof AuditActions];
