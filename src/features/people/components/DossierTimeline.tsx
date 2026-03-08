'use client';

import { CalendarDays } from 'lucide-react';

import { EmptyState } from '@/shared/components/ui/empty-state';
import type { PersonDossier } from '../services/person-dossier-service';

type TimelineEvent = {
  id: string;
  date: Date;
  label: string;
  description?: string;
};

function buildTimeline(dossier: PersonDossier): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  if (dossier.person.createdAt) {
    events.push({
      id: 'joined',
      date: new Date(dossier.person.createdAt),
      label: 'Joined',
      description: dossier.person.title ?? undefined,
    });
  }

  if (dossier.person.startDate) {
    events.push({
      id: 'start-date',
      date: new Date(dossier.person.startDate),
      label: 'Employment start',
      description: dossier.person.employmentType ?? undefined,
    });
  }

  return events.sort((a, b) => b.date.getTime() - a.date.getTime());
}

interface DossierTimelineProps {
  dossier: PersonDossier;
}

export function DossierTimeline({ dossier }: DossierTimelineProps) {
  const events = buildTimeline(dossier);

  if (events.length === 0) {
    return <EmptyState icon={CalendarDays} title="No timeline activity yet" domain="people" compact />;
  }

  return (
    <ol className="relative border-l border-muted ml-3 space-y-6">
      {events.map((event) => (
        <li key={event.id} className="ml-6">
          <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-background ring-2 ring-border text-sky-500">
            <CalendarDays className="h-3 w-3" />
          </span>
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <p className="text-sm font-medium">{event.label}</p>
              {event.description && <p className="text-xs text-muted-foreground">{event.description}</p>}
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{event.date.toLocaleDateString()}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
