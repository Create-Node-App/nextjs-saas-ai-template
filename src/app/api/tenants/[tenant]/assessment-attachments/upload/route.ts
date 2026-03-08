/**
 * Assessment attachments upload (for rich text notes: images and files)
 *
 * POST /api/tenants/[tenant]/assessment-attachments/upload
 * Returns presigned URL + fileId. Client uploads to presigned URL, then uses
 * GET /api/tenants/[tenant]/files/[fileId] as embed URL (redirects to presigned download).
 */

import { and, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@/shared/db';
import { fileObjects, persons, tenants } from '@/shared/db/schema';
import { ApiErrors, handleApiError } from '@/shared/lib/api-errors';
import { auth } from '@/shared/lib/auth';
import { logger } from '@/shared/lib/logger';
import { generateFileKey, getPresignedUploadUrl, bucket as S3_BUCKET } from '@/shared/services/s3-service';

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const uploadSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileType: z.string().min(1),
  fileSize: z
    .number()
    .positive()
    .max(MAX_FILE_SIZE_MB * 1024 * 1024),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ tenant: string }> }) {
  try {
    const { tenant: tenantSlug } = await params;
    const session = await auth();
    if (!session?.user?.email) {
      return ApiErrors.unauthorized();
    }

    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.slug, tenantSlug),
    });
    if (!tenant) return ApiErrors.notFound('Tenant');

    const person = await db.query.persons.findFirst({
      where: and(eq(persons.tenantId, tenant.id), eq(persons.email, session.user.email)),
    });
    if (!person) return ApiErrors.notFound('Person');

    const body = await request.json();
    const parsed = uploadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
    }

    const { fileName, fileType, fileSize } = parsed.data;
    const allowed = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_FILE_TYPES];
    const normalized = fileType.toLowerCase();
    const allowedType = allowed.some(
      (a) => (a.endsWith('/*') && normalized.startsWith(a.slice(0, -1))) || normalized === a,
    );
    if (!allowedType) {
      return NextResponse.json({ error: `File type not allowed. Allowed: ${allowed.join(', ')}` }, { status: 400 });
    }

    const ext = fileName.split('.').pop() || '';
    const s3Key = generateFileKey(tenant.id, 'assessment-attachments', `${nanoid()}.${ext}`);

    const presignedUrl = await getPresignedUploadUrl({
      key: s3Key,
      contentType: fileType,
      expiresIn: 3600,
    });

    const [file] = await db
      .insert(fileObjects)
      .values({
        tenantId: tenant.id,
        ownerPersonId: person.id,
        type: 'other',
        s3Bucket: S3_BUCKET,
        s3Key,
        originalFilename: fileName,
        mimeType: fileType,
        sizeBytes: fileSize,
      })
      .returning();

    logger.info(
      { tenantId: tenant.id, personId: person.id, fileObjectId: file.id },
      'Assessment attachment upload initiated',
    );

    return NextResponse.json({
      success: true,
      presignedUrl,
      fileId: file.id,
      /** Use this as img src or link href; GET redirects to presigned download */
      embedUrl: `/api/tenants/${tenantSlug}/files/${file.id}`,
    });
  } catch (error) {
    logger.error({ error }, 'Assessment attachment upload error');
    return handleApiError(error);
  }
}
