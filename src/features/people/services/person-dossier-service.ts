'use server';

import { and, eq } from 'drizzle-orm';

import { db } from '@/shared/db';
import * as schema from '@/shared/db/schema';
import { getTenantBySlug } from '@/shared/lib/tenant';

export interface PersonDossier {
  person: typeof schema.persons.$inferSelect;
}

export async function getPersonDossier(tenantSlug: string, personId: string): Promise<PersonDossier | null> {
  const tenant = await getTenantBySlug(tenantSlug);
  if (!tenant) throw new Error('Tenant not found');

  const person = await db.query.persons.findFirst({
    where: and(eq(schema.persons.id, personId), eq(schema.persons.tenantId, tenant.id)),
  });

  if (!person) return null;

  return { person };
}
