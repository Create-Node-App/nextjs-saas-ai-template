import { renderToBuffer } from '@react-pdf/renderer';
import { createElement } from 'react';

import { PersonProfilePDFDocument } from '@/features/people/components/pdf/PersonProfilePDFDocument';
import { getPersonDossier } from '@/features/people/services/person-dossier-service';
import { auth } from '@/shared/lib/auth';
import { isTenantAdmin } from '@/shared/lib/rbac';

interface RouteParams {
  params: Promise<{ tenant: string; personId: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { tenant: tenantSlug, personId } = await params;

  // Auth: must be logged in and be an admin or manager
  const session = await auth();
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const isAdmin = await isTenantAdmin(tenantSlug);
  if (!isAdmin) {
    return new Response('Forbidden', { status: 403 });
  }

  let dossier;
  try {
    dossier = await getPersonDossier(personId, tenantSlug);
  } catch {
    return new Response('Person not found', { status: 404 });
  }
  if (!dossier) return new Response('Person not found', { status: 404 });

  const fullName =
    dossier.person.displayName ?? `${dossier.person.firstName ?? ''} ${dossier.person.lastName ?? ''}`.trim();

  const doc = createElement(PersonProfilePDFDocument, { dossier }) as unknown as Parameters<typeof renderToBuffer>[0];
  const buffer = await renderToBuffer(doc);

  const date = new Date().toISOString().split('T')[0];
  const filename = `profile-${fullName.replace(/\s+/g, '-').toLowerCase()}-${date}.pdf`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
