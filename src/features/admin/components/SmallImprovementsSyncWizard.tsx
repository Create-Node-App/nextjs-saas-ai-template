'use client';

import { AlertCircle, CheckCircle, Loader2, Play, Target } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@/shared/components/ui';

interface SmallImprovementsSyncWizardProps {
  tenantSlug: string;
  settings:
    | {
        syncObjectives?: boolean;
        syncPraise?: boolean;
        syncMeetings?: boolean;
        syncFeedback?: boolean;
      }
    | undefined;
}

type SyncStep = 'configure' | 'syncing' | 'complete';

interface SyncProgress {
  messages: string[];
  isComplete: boolean;
  result?: {
    success: boolean;
    runId?: string;
    mode?: 'migration_full' | 'sync_incremental' | 'reconcile' | 'dry_run';
    entities?: Array<'objectives' | 'praise' | 'meetings' | 'feedback'>;
    totalConflicts?: number;
    objectives?: { created: number; updated: number; skipped: number; errors: string[] };
    praise?: { created: number; updated: number; skipped: number; errors: string[] };
    meetings?: { created: number; updated: number; skipped: number; errors: string[] };
    feedback?: { created: number; updated: number; skipped: number; errors: string[] };
    error?: string;
  };
}

interface SyncRunSummary {
  id: string;
  mode: string;
  status: string;
  createdAt: string;
}

interface SyncConflict {
  id: string;
  entityType: string;
  conflictType: string;
  severity: string;
  status: string;
}

export function SmallImprovementsSyncWizard({ tenantSlug, settings }: SmallImprovementsSyncWizardProps) {
  const t = useTranslations('admin.smallImprovements');

  const [step, setStep] = useState<SyncStep>('configure');
  const [syncObjectives, setSyncObjectives] = useState(settings?.syncObjectives ?? true);
  const [syncPraise, setSyncPraise] = useState(settings?.syncPraise ?? true);
  const [syncMeetings, setSyncMeetings] = useState(settings?.syncMeetings ?? false);
  const [syncFeedback, setSyncFeedback] = useState(settings?.syncFeedback ?? false);
  const [syncMode, setSyncMode] = useState<'migration_full' | 'sync_incremental' | 'reconcile' | 'dry_run'>(
    'sync_incremental',
  );
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [personEmails, setPersonEmails] = useState('');
  const [recentRuns, setRecentRuns] = useState<SyncRunSummary[]>([]);
  const [openConflicts, setOpenConflicts] = useState<SyncConflict[]>([]);
  const [resolvingConflictId, setResolvingConflictId] = useState<string | null>(null);
  const [progress, setProgress] = useState<SyncProgress>({ messages: [], isComplete: false });

  const loadOpsData = useCallback(async () => {
    const [runsRes, conflictsRes] = await Promise.all([
      fetch(`/api/tenants/${tenantSlug}/admin/integrations/runs?provider=small_improvements&limit=5`),
      fetch(
        `/api/tenants/${tenantSlug}/admin/integrations/conflicts?provider=small_improvements&onlyOpen=true&limit=5`,
      ),
    ]);
    if (runsRes.ok) {
      const runsData = (await runsRes.json()) as { runs: SyncRunSummary[] };
      setRecentRuns(runsData.runs ?? []);
    }
    if (conflictsRes.ok) {
      const conflictsData = (await conflictsRes.json()) as { conflicts: SyncConflict[] };
      setOpenConflicts(conflictsData.conflicts ?? []);
    }
  }, [tenantSlug]);

  const handleSync = useCallback(async () => {
    setStep('syncing');
    setProgress({ messages: [], isComplete: false });

    try {
      const response = await fetch(`/api/tenants/${tenantSlug}/admin/integrations/small-improvements/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entities: [
            syncObjectives ? 'objectives' : null,
            syncPraise ? 'praise' : null,
            syncMeetings ? 'meetings' : null,
            syncFeedback ? 'feedback' : null,
          ].filter(Boolean),
          mode: syncMode,
          scope: {
            fromDate: fromDate || undefined,
            toDate: toDate || undefined,
            personEmails: personEmails
              ? personEmails
                  .split(',')
                  .map((value) => value.trim())
                  .filter(Boolean)
              : undefined,
          },
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        setProgress({
          messages: [`Error: ${err.error || 'Unknown error'}`],
          isComplete: true,
          result: { success: false, error: err.error },
        });
        setStep('complete');
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        setProgress({
          messages: ['Failed to read response stream'],
          isComplete: true,
          result: { success: false, error: 'No response body' },
        });
        setStep('complete');
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.type === 'progress') {
              setProgress((prev) => ({
                ...prev,
                messages: [...prev.messages, data.message],
              }));
            } else if (data.type === 'result') {
              setProgress((prev) => ({
                ...prev,
                isComplete: true,
                result: data,
              }));
              await loadOpsData();
              setStep('complete');
            }
          } catch {
            // Skip invalid JSON lines
          }
        }
      }
    } catch (err) {
      setProgress({
        messages: [`Error: ${err instanceof Error ? err.message : 'Unknown error'}`],
        isComplete: true,
        result: { success: false, error: err instanceof Error ? err.message : 'Unknown' },
      });
      setStep('complete');
    }
  }, [
    tenantSlug,
    syncObjectives,
    syncPraise,
    syncMeetings,
    syncFeedback,
    syncMode,
    fromDate,
    toDate,
    personEmails,
    loadOpsData,
  ]);

  const handleResolveConflict = useCallback(
    async (conflictId: string) => {
      setResolvingConflictId(conflictId);
      try {
        await fetch(`/api/tenants/${tenantSlug}/admin/integrations/conflicts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conflictId,
            action: 'mark_resolved_from_wizard',
            status: 'resolved',
          }),
        });
        await loadOpsData();
      } finally {
        setResolvingConflictId(null);
      }
    },
    [loadOpsData, tenantSlug],
  );

  useEffect(() => {
    void loadOpsData();
  }, [loadOpsData]);

  const renderEntityResult = (label: string, data?: { created: number; updated: number; skipped: number }) => {
    if (!data) return null;
    return (
      <p className="text-sm">
        <span className="font-medium">{label}:</span>{' '}
        {t('sync.entityResult', { created: data.created, updated: data.updated, skipped: data.skipped })}
      </p>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {t('sync.title')}
        </CardTitle>
        <CardDescription>{t('sync.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'configure' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('sync.modeLabel')}</Label>
                <Select value={syncMode} onValueChange={(value) => setSyncMode(value as typeof syncMode)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('sync.modePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sync_incremental">{t('sync.modeIncremental')}</SelectItem>
                    <SelectItem value="migration_full">{t('sync.modeFull')}</SelectItem>
                    <SelectItem value="reconcile">{t('sync.modeReconcile')}</SelectItem>
                    <SelectItem value="dry_run">{t('sync.modeDryRun')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t('sync.fromDate')}</Label>
                  <Input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t('sync.toDate')}</Label>
                  <Input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('sync.personEmails')}</Label>
                <Input
                  value={personEmails}
                  onChange={(event) => setPersonEmails(event.target.value)}
                  placeholder={t('sync.personEmailsPlaceholder')}
                />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">{t('sync.syncObjectives')}</Label>
                  <p className="text-xs text-muted-foreground">{t('sync.syncObjectivesDesc')}</p>
                </div>
                <Switch checked={syncObjectives} onCheckedChange={setSyncObjectives} />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">{t('sync.syncPraise')}</Label>
                  <p className="text-xs text-muted-foreground">{t('sync.syncPraiseDesc')}</p>
                </div>
                <Switch checked={syncPraise} onCheckedChange={setSyncPraise} />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">{t('sync.syncMeetings')}</Label>
                  <p className="text-xs text-muted-foreground">{t('sync.syncMeetingsDesc')}</p>
                </div>
                <Switch checked={syncMeetings} onCheckedChange={setSyncMeetings} />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">{t('sync.syncFeedback')}</Label>
                  <p className="text-xs text-muted-foreground">{t('sync.syncFeedbackDesc')}</p>
                </div>
                <Switch checked={syncFeedback} onCheckedChange={setSyncFeedback} />
              </div>
            </div>

            <Button
              onClick={handleSync}
              disabled={!syncObjectives && !syncPraise && !syncMeetings && !syncFeedback}
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              {t('sync.startSync')}
            </Button>
          </div>
        )}

        {step === 'syncing' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('sync.syncing')}
            </div>
            <div className="max-h-60 overflow-y-auto space-y-1 bg-muted/50 rounded-md p-3">
              {progress.messages.map((msg, i) => (
                <p key={i} className="text-xs text-muted-foreground font-mono">
                  {msg}
                </p>
              ))}
            </div>
          </div>
        )}

        {step === 'complete' && progress.result && (
          <div className="space-y-4">
            {progress.result.success ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>{t('sync.completeTitle')}</AlertTitle>
                <AlertDescription>
                  <div className="space-y-1 mt-2">
                    {progress.result.runId ? (
                      <p className="text-sm">
                        <span className="font-medium">{t('sync.runIdLabel')}:</span> {progress.result.runId}
                      </p>
                    ) : null}
                    {typeof progress.result.totalConflicts === 'number' ? (
                      <p className="text-sm">
                        <span className="font-medium">{t('sync.conflictsLabel')}:</span>{' '}
                        {progress.result.totalConflicts}
                      </p>
                    ) : null}
                    {renderEntityResult(t('sync.objectivesLabel'), progress.result.objectives)}
                    {renderEntityResult(t('sync.praiseLabel'), progress.result.praise)}
                    {renderEntityResult(t('sync.meetingsLabel'), progress.result.meetings)}
                    {renderEntityResult(t('sync.feedbackLabel'), progress.result.feedback)}
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t('sync.errorTitle')}</AlertTitle>
                <AlertDescription>{progress.result.error ?? t('sync.unknownError')}</AlertDescription>
              </Alert>
            )}

            <div className="max-h-40 overflow-y-auto space-y-1 bg-muted/50 rounded-md p-3">
              {progress.messages.map((msg, i) => (
                <p key={i} className="text-xs text-muted-foreground font-mono">
                  {msg}
                </p>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setStep('configure');
                setProgress({ messages: [], isComplete: false });
                void loadOpsData();
              }}
              className="w-full"
            >
              {t('sync.syncAgain')}
            </Button>
          </div>
        )}

        {step !== 'syncing' && (
          <div className="mt-6 space-y-4">
            <div className="rounded-md border p-3 space-y-2">
              <p className="text-sm font-medium">{t('sync.recentRuns')}</p>
              {recentRuns.length === 0 ? (
                <p className="text-xs text-muted-foreground">{t('sync.noRecentRuns')}</p>
              ) : (
                recentRuns.map((run) => (
                  <p key={run.id} className="text-xs text-muted-foreground">
                    {run.id} - {run.mode} - {run.status}
                  </p>
                ))
              )}
            </div>
            <div className="rounded-md border p-3 space-y-2">
              <p className="text-sm font-medium">{t('sync.openConflicts')}</p>
              {openConflicts.length === 0 ? (
                <p className="text-xs text-muted-foreground">{t('sync.noOpenConflicts')}</p>
              ) : (
                openConflicts.map((conflict) => (
                  <div key={conflict.id} className="flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      {conflict.entityType} - {conflict.conflictType} ({conflict.severity})
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={resolvingConflictId === conflict.id}
                      onClick={() => void handleResolveConflict(conflict.id)}
                    >
                      {resolvingConflictId === conflict.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        t('sync.resolve')
                      )}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
