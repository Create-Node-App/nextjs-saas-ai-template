'use client';

import { AlertCircle, CheckCircle, Loader2, Play, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

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
  Label,
  Switch,
} from '@/shared/components/ui';

interface DeelSyncWizardProps {
  tenantSlug: string;
  settings:
    | {
        syncDepartments?: boolean;
        syncManagers?: boolean;
        autoCreatePersons?: boolean;
        defaultRolesForNewPersons?: string[];
      }
    | undefined;
}

type SyncStep = 'configure' | 'syncing' | 'complete';

interface SyncProgress {
  messages: string[];
  isComplete: boolean;
  result?: {
    success: boolean;
    personsCreated?: number;
    personsUpdated?: number;
    personsSkipped?: number;
    departmentsCreated?: number;
    departmentsUpdated?: number;
    managersLinked?: number;
    errors?: string[];
    error?: string;
  };
}

export function DeelSyncWizard({ tenantSlug, settings }: DeelSyncWizardProps) {
  const t = useTranslations('admin.deel');

  const [step, setStep] = useState<SyncStep>('configure');
  const [syncDepartments, setSyncDepartments] = useState(settings?.syncDepartments ?? true);
  const [syncManagers, setSyncManagers] = useState(settings?.syncManagers ?? true);
  const [autoCreatePersons, setAutoCreatePersons] = useState(settings?.autoCreatePersons ?? false);
  const [progress, setProgress] = useState<SyncProgress>({ messages: [], isComplete: false });

  const handleSync = async () => {
    setStep('syncing');
    setProgress({ messages: [], isComplete: false });

    try {
      const response = await fetch(`/api/tenants/${tenantSlug}/admin/integrations/deel/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syncDepartments,
          syncManagers,
          autoCreatePersons,
          defaultRolesForNewPersons: settings?.defaultRolesForNewPersons ?? ['member'],
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
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {t('sync.title')}
        </CardTitle>
        <CardDescription>{t('sync.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'configure' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">{t('sync.syncDepartments')}</Label>
                  <p className="text-xs text-muted-foreground">{t('sync.syncDepartmentsDesc')}</p>
                </div>
                <Switch checked={syncDepartments} onCheckedChange={setSyncDepartments} />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">{t('sync.syncManagers')}</Label>
                  <p className="text-xs text-muted-foreground">{t('sync.syncManagersDesc')}</p>
                </div>
                <Switch checked={syncManagers} onCheckedChange={setSyncManagers} />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">{t('sync.autoCreatePersons')}</Label>
                  <p className="text-xs text-muted-foreground">{t('sync.autoCreatePersonsDesc')}</p>
                </div>
                <Switch checked={autoCreatePersons} onCheckedChange={setAutoCreatePersons} />
              </div>
            </div>

            <Button onClick={handleSync} className="w-full">
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
                  <div className="space-y-1 mt-2 text-sm">
                    <p>{t('sync.personsCreated', { count: progress.result.personsCreated ?? 0 })}</p>
                    <p>{t('sync.personsUpdated', { count: progress.result.personsUpdated ?? 0 })}</p>
                    <p>{t('sync.personsSkipped', { count: progress.result.personsSkipped ?? 0 })}</p>
                    {progress.result.departmentsCreated !== undefined && (
                      <p>{t('sync.departmentsCreated', { count: progress.result.departmentsCreated })}</p>
                    )}
                    {progress.result.managersLinked !== undefined && (
                      <p>{t('sync.managersLinked', { count: progress.result.managersLinked })}</p>
                    )}
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

            {/* Log */}
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
              }}
              className="w-full"
            >
              {t('sync.syncAgain')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
