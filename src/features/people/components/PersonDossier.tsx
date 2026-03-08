'use client';

import { Mail, User } from 'lucide-react';

import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui';
import { DossierTimeline } from './DossierTimeline';
import type { PersonDossier as PersonDossierData } from '../services/person-dossier-service';

interface PersonDossierProps {
  dossier: PersonDossierData;
}

export function PersonDossier({ dossier }: PersonDossierProps) {
  const { person } = dossier;
  const fullName = [person.firstName, person.lastName].filter(Boolean).join(' ');

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/30 shrink-0">
              <User className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base">{fullName || 'Unknown person'}</CardTitle>
              {person.title && <p className="text-sm text-muted-foreground mt-0.5">{person.title}</p>}
            </div>
            {person.status && (
              <Badge
                variant={person.status === 'active' ? 'default' : 'outline'}
                className="shrink-0 text-xs capitalize"
              >
                {person.status}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {person.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground truncate">{person.email}</span>
            </div>
          )}
          {person.bio && <p className="text-sm text-muted-foreground border-t pt-3">{person.bio}</p>}
        </CardContent>
      </Card>
      <DossierTimeline dossier={dossier} />
    </div>
  );
}
