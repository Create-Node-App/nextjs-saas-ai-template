'use client';

import { Clock, Eye, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';

import {
  getIntegrationSyncHistory,
  type IntegrationAuditEvent,
  type IntegrationSyncChanges,
  type IntegrationSyncMetadata,
} from '@/features/admin/services/integration-audit-service';

function isSyncChanges(changes: unknown): changes is IntegrationSyncChanges {
  return (
    typeof changes === 'object' &&
    changes !== null &&
    'integration' in changes &&
    ('accountSubdomain' in changes || 'dateRange' in changes)
  );
}
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui';

interface ResourceGuruSyncHistoryProps {
  tenantSlug: string;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatDuration(ms: number | undefined): string {
  if (!ms) return '-';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function SyncDetailDialog({
  event,
  isOpen,
  onClose,
}: {
  event: IntegrationAuditEvent | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const t = useTranslations('admin.resourceGuru.syncHistory');

  if (!event) return null;

  const metadata = event.metadata as IntegrationSyncMetadata;
  const changes = event.changes;
  const syncChanges = isSyncChanges(changes) ? changes : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t('detail.title')} - {formatDate(new Date(event.timestamp))}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">{t('detail.executedBy')}:</span> {event.actorDisplayName || 'System'}
            </div>
            <div>
              <span className="font-medium">{t('detail.account')}:</span> {syncChanges?.accountSubdomain || '-'}
            </div>
            <div>
              <span className="font-medium">{t('detail.dateRange')}:</span>{' '}
              {syncChanges?.dateRange ? `${syncChanges.dateRange.start} to ${syncChanges.dateRange.end}` : '-'}
            </div>
            <div>
              <span className="font-medium">{t('detail.duration')}:</span> {formatDuration(metadata.durationMs)}
            </div>
          </div>

          {/* Clients */}
          {metadata.entities?.clients && metadata.entities.clients.length > 0 && (
            <div>
              <h4 className="mb-2 font-medium">{t('detail.clients')}</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>{t('detail.action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metadata.entities.clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            client.action === 'created'
                              ? 'bg-green-100 text-green-800'
                              : client.action === 'updated'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {t(`detail.${client.action}`)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Projects */}
          {metadata.entities?.projects && metadata.entities.projects.length > 0 && (
            <div>
              <h4 className="mb-2 font-medium">{t('detail.projects')}</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>{t('detail.action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metadata.entities.projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            project.action === 'created'
                              ? 'bg-green-100 text-green-800'
                              : project.action === 'updated'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {t(`detail.${project.action}`)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Persons */}
          {metadata.entities?.persons && metadata.entities.persons.length > 0 && (
            <div>
              <h4 className="mb-2 font-medium">{t('detail.persons')}</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>{t('detail.action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metadata.entities.persons.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell>{person.name}</TableCell>
                      <TableCell>{person.email || '-'}</TableCell>
                      <TableCell>
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            person.action === 'created'
                              ? 'bg-green-100 text-green-800'
                              : person.action === 'updated'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {t(`detail.${person.action}`)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Bookings summary */}
          <div className="rounded-md border bg-muted/50 p-4">
            <span className="font-medium">{t('detail.bookings')}:</span> {metadata.summary?.assignmentsCreated ?? 0}{' '}
            records
          </div>

          {/* Errors if any */}
          {metadata.errors && metadata.errors.length > 0 && (
            <div className="rounded-md border border-red-200 bg-red-50 p-4">
              <h4 className="mb-2 font-medium text-red-800">Errors</h4>
              <ul className="list-inside list-disc text-sm text-red-700">
                {metadata.errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ResourceGuruSyncHistory({ tenantSlug }: ResourceGuruSyncHistoryProps) {
  const t = useTranslations('admin.resourceGuru.syncHistory');
  const [history, setHistory] = useState<IntegrationAuditEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IntegrationAuditEvent | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const loadHistory = useCallback(
    async (reset = false) => {
      setIsLoading(true);
      try {
        const newOffset = reset ? 0 : offset;
        const events = await getIntegrationSyncHistory(tenantSlug, 'resource_guru', {
          limit: 20,
          offset: newOffset,
        });

        // Filter to only show completed/failed syncs (not started)
        const filteredEvents = events.filter(
          (e) => e.action === 'integration.sync.completed' || e.action === 'integration.sync.failed',
        );

        if (reset) {
          setHistory(filteredEvents);
        } else {
          setHistory((prev) => [...prev, ...filteredEvents]);
        }

        setHasMore(events.length === 20);
        if (!reset) {
          setOffset((prev) => prev + events.length);
        } else {
          setOffset(events.length);
        }
      } catch (error) {
        console.error('Failed to load sync history:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [tenantSlug, offset],
  );

  useEffect(() => {
    loadHistory(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantSlug]);

  const handleViewDetails = useCallback((event: IntegrationAuditEvent) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  }, []);

  const formatSummary = (event: IntegrationAuditEvent): string => {
    const metadata = event.metadata as IntegrationSyncMetadata;
    const parts: string[] = [];

    if (metadata.summary) {
      const { clientsCreated, projectsCreated, personsCreated, assignmentsCreated } = metadata.summary;

      if (clientsCreated > 0) parts.push(`${clientsCreated} clients`);
      if (projectsCreated > 0) parts.push(`${projectsCreated} projects`);
      if (personsCreated > 0) parts.push(`${personsCreated} persons`);
      if (assignmentsCreated > 0) parts.push(`${assignmentsCreated} bookings`);
    }

    if (parts.length === 0) return 'No changes';
    return parts.join(', ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t('title')}
        </CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && history.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : history.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">{t('noHistory')}</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('columns.date')}</TableHead>
                  <TableHead>{t('columns.by')}</TableHead>
                  <TableHead>{t('columns.summary')}</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(new Date(event.timestamp))}
                      {event.action === 'integration.sync.failed' && (
                        <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-800">Failed</span>
                      )}
                    </TableCell>
                    <TableCell>{event.actorDisplayName || 'System'}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{formatSummary(event)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(event)}>
                        <Eye className="mr-1 h-4 w-4" />
                        {t('viewDetails')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {hasMore && (
              <div className="mt-4 flex justify-center">
                <Button variant="outline" size="sm" onClick={() => loadHistory()} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {t('loadMore')}
                </Button>
              </div>
            )}
          </>
        )}

        <SyncDetailDialog event={selectedEvent} isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} />
      </CardContent>
    </Card>
  );
}
