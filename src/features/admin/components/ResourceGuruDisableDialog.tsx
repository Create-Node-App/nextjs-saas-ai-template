'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

import { recordIntegrationConfigChange } from '@/features/admin/services/integration-audit-service';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui';

interface ResourceGuruDisableDialogProps {
  tenantSlug: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  /** Stats about synced data to show in warning */
  syncStats?: {
    clientsCount: number;
    projectsCount: number;
    assignmentsCount: number;
  };
}

export function ResourceGuruDisableDialog({
  tenantSlug,
  isOpen,
  onClose,
  onConfirm,
  syncStats,
}: ResourceGuruDisableDialogProps) {
  const t = useTranslations('admin.integrations');
  const tCommon = useTranslations('common');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = useCallback(async () => {
    setIsSubmitting(true);
    try {
      // Record the config change in audit log
      await recordIntegrationConfigChange(tenantSlug, 'resource_guru', 'integration.config.disabled');

      onConfirm();
    } catch (error) {
      console.error('Failed to disable integration:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [tenantSlug, onConfirm]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {t('resourceGuru.disableTitle')}
          </DialogTitle>
          <DialogDescription>{t('resourceGuru.disableDescription')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('resourceGuru.disableWarningTitle')}</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{t('resourceGuru.disableWarningText')}</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>{t('resourceGuru.disablePoint1')}</li>
                <li>{t('resourceGuru.disablePoint2')}</li>
                <li>{t('resourceGuru.disablePoint3')}</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertTitle>{t('resourceGuru.disableWillNotTitle')}</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>{t('resourceGuru.disableWillNot1')}</li>
                <li>{t('resourceGuru.disableWillNot2')}</li>
                <li>{t('resourceGuru.disableWillNot3')}</li>
              </ul>
            </AlertDescription>
          </Alert>

          {syncStats && (syncStats.clientsCount > 0 || syncStats.projectsCount > 0) && (
            <div className="rounded-md border bg-muted/50 p-4">
              <h4 className="mb-2 text-sm font-medium">{t('resourceGuru.currentSyncedData')}</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>{t('resourceGuru.syncedClients', { count: syncStats.clientsCount })}</li>
                <li>{t('resourceGuru.syncedProjects', { count: syncStats.projectsCount })}</li>
                <li>
                  {t('resourceGuru.syncedAssignments', {
                    count: syncStats.assignmentsCount,
                  })}
                </li>
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            {tCommon('cancel')}
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {t('resourceGuru.disableButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
