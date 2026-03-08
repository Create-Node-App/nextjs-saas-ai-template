'use client';

/**
 * Processing Dashboard Component
 *
 * Human-in-the-loop interface for managing CV processing jobs.
 * Shows job status, allows review of extracted skills, and manual processing triggers.
 */

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Loader2,
  Play,
  RefreshCw,
  User,
  XCircle,
  Zap,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui';
import { useUrlId, useUrlTab } from '@/shared/hooks';

// ============================================================================
// Types
// ============================================================================

interface ProcessingJob {
  id: string;
  status: 'queued' | 'processing' | 'done' | 'failed';
  error: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  person: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  file: {
    id: string;
    name: string | null;
    type: string;
    size: number;
  };
}

interface ExtractedSkill {
  name: string;
  category: string;
  confidence: number;
  evidence: string;
}

interface ProcessingDashboardProps {
  tenantSlug: string;
  jobs: ProcessingJob[];
}

// ============================================================================
// Component
// ============================================================================

const AUTO_REFRESH_INTERVAL = 5000; // 5 seconds

export function ProcessingDashboard({ tenantSlug, jobs: initialJobs }: ProcessingDashboardProps) {
  const t = useTranslations('processing');
  const [jobs, setJobs] = useState<ProcessingJob[]>(initialJobs);
  const [selectedJob, setSelectedJob] = useState<ProcessingJob | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<ExtractedSkill[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const autoRefreshRef = useRef(autoRefresh);

  // URL-synced tab state for deep linking
  const [activeTab, setActiveTab] = useUrlTab({
    defaultTab: 'all',
    validTabs: ['all', 'queued', 'processing', 'done', 'failed'],
  });

  // URL-synced job ID for review dialog
  const [reviewJobId, setReviewJobId] = useUrlId({ paramName: 'review' });
  const reviewDialogOpen = !!reviewJobId;

  // Stats
  const stats = {
    queued: jobs.filter((j) => j.status === 'queued').length,
    processing: jobs.filter((j) => j.status === 'processing').length,
    done: jobs.filter((j) => j.status === 'done').length,
    failed: jobs.filter((j) => j.status === 'failed').length,
  };

  // Refresh jobs
  const refreshJobs = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/tenants/${tenantSlug}/admin/processing`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error('Failed to refresh jobs:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [tenantSlug]);

  // Keep ref in sync with state for use in interval
  useEffect(() => {
    autoRefreshRef.current = autoRefresh;
  }, [autoRefresh]);

  // Auto-refresh effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoRefreshRef.current && !isRefreshing) {
        refreshJobs();
      }
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [refreshJobs, isRefreshing]);

  // Process a single job
  const processJob = useCallback(
    async (jobId: string) => {
      setIsProcessing(jobId);
      try {
        const response = await fetch(`/api/tenants/${tenantSlug}/admin/processing/${jobId}/process`, {
          method: 'POST',
        });

        if (response.ok) {
          await refreshJobs();
        }
      } catch (err) {
        console.error('Failed to process job:', err);
      } finally {
        setIsProcessing(null);
      }
    },
    [tenantSlug, refreshJobs],
  );

  // Process all queued jobs
  const processAllQueued = useCallback(async () => {
    setIsProcessing('all');
    try {
      const response = await fetch(`/api/tenants/${tenantSlug}/admin/processing/process-all`, {
        method: 'POST',
      });

      if (response.ok) {
        await refreshJobs();
      }
    } catch (err) {
      console.error('Failed to process all jobs:', err);
    } finally {
      setIsProcessing(null);
    }
  }, [tenantSlug, refreshJobs]);

  // View extracted skills for review - deep linked via ?review=jobId
  const viewExtractedSkills = useCallback(
    async (job: ProcessingJob) => {
      setSelectedJob(job);
      setIsLoadingSkills(true);
      setReviewJobId(job.id); // Update URL

      try {
        const response = await fetch(`/api/tenants/${tenantSlug}/admin/processing/${job.id}/skills`);
        if (response.ok) {
          const data = await response.json();
          setExtractedSkills(data.skills || []);
        }
      } catch (err) {
        console.error('Failed to load skills:', err);
        setExtractedSkills([]);
      } finally {
        setIsLoadingSkills(false);
      }
    },
    [tenantSlug, setReviewJobId],
  );

  // Close review dialog
  const closeReviewDialog = useCallback(() => {
    setReviewJobId(null);
    setSelectedJob(null);
    setExtractedSkills([]);
  }, [setReviewJobId]);

  // Download file
  const downloadFile = useCallback(
    async (job: ProcessingJob) => {
      try {
        // Find the evidence associated with this file
        const response = await fetch(`/api/tenants/${tenantSlug}/admin/processing/${job.id}/download`);
        if (response.ok) {
          const data = await response.json();
          window.open(data.url, '_blank');
        }
      } catch (err) {
        console.error('Failed to get download URL:', err);
      }
    },
    [tenantSlug],
  );

  const getStatusIcon = (status: ProcessingJob['status']) => {
    switch (status) {
      case 'queued':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'done':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: ProcessingJob['status']) => {
    switch (status) {
      case 'queued':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Queued
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Processing
          </Badge>
        );
      case 'done':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Done
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Failed
          </Badge>
        );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-xl border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('queued')}</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.queued}</div>
            <p className="text-xs text-muted-foreground">{t('startingSoon')}</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('processing')}</CardTitle>
            <Loader2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processing}</div>
            <p className="text-xs text-muted-foreground">{t('currentlyRunning')}</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('completed')}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.done}</div>
            <p className="text-xs text-muted-foreground">{t('successfullyProcessed')}</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('failed')}</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failed}</div>
            <p className="text-xs text-muted-foreground">{t('needAttention')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Auto-processing indicator */}
      <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
        <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800 dark:text-green-200">{t('autoProcessingEnabled')}</p>
          <p className="text-xs text-green-600 dark:text-green-400">{t('autoProcessingDescription')}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button onClick={refreshJobs} variant="outline" disabled={isRefreshing}>
          {isRefreshing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          {t('refresh')}
        </Button>
        <Button onClick={() => setAutoRefresh(!autoRefresh)} variant={autoRefresh ? 'default' : 'outline'} size="sm">
          {autoRefresh ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('autoRefreshOn')}
            </>
          ) : (
            t('autoRefreshOff')
          )}
        </Button>
        {stats.queued > 0 && (
          <Button onClick={processAllQueued} disabled={isProcessing === 'all'}>
            {isProcessing === 'all' ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {t('processAllQueued', { count: stats.queued })}
          </Button>
        )}
      </div>

      {/* Jobs List */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            {t('all')} ({jobs.length})
          </TabsTrigger>
          <TabsTrigger value="queued">
            {t('queued')} ({stats.queued})
          </TabsTrigger>
          <TabsTrigger value="processing">
            {t('processing')} ({stats.processing})
          </TabsTrigger>
          <TabsTrigger value="done">
            {t('done')} ({stats.done})
          </TabsTrigger>
          <TabsTrigger value="failed">
            {t('failed')} ({stats.failed})
          </TabsTrigger>
        </TabsList>

        {['all', 'queued', 'processing', 'done', 'failed'].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <Card className="rounded-xl border-0 shadow-md">
              <CardHeader>
                <CardTitle>{t('processingJobs')}</CardTitle>
                <CardDescription>
                  {tab === 'all' ? t('allCvJobs') : t('jobsWithStatus', { status: tab })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {jobs.filter((j) => tab === 'all' || j.status === tab).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{t('noJobsFound')}</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {jobs
                      .filter((j) => tab === 'all' || j.status === tab)
                      .map((job) => (
                        <div key={job.id} className="py-4 first:pt-0 last:pb-0">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-muted">
                                {getStatusIcon(job.status)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{job.file.name || t('unnamedFile')}</span>
                                  {getStatusBadge(job.status)}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                  <User className="h-3 w-3" />
                                  {job.person.firstName} {job.person.lastName}
                                  <span>•</span>
                                  {job.person.email}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {formatFileSize(job.file.size)} • {t('created')} {formatDate(job.createdAt)}
                                  {job.finishedAt && ` • ${t('finished')} ${formatDate(job.finishedAt)}`}
                                </div>
                                {job.error && (
                                  <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded">{job.error}</div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => downloadFile(job)}
                                title={t('downloadFile')}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              {job.status === 'done' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => viewExtractedSkills(job)}
                                  title={t('reviewExtractedSkills')}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                              {(job.status === 'queued' || job.status === 'failed') && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => processJob(job.id)}
                                  disabled={isProcessing === job.id}
                                >
                                  {isProcessing === job.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Play className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Skills Review Dialog - Deep linked via ?review=jobId */}
      <Dialog open={reviewDialogOpen} onOpenChange={(open) => !open && closeReviewDialog()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('extractedSkillsReview')}</DialogTitle>
            <DialogDescription>
              {selectedJob &&
                t('reviewSkillsFrom', {
                  filename: selectedJob.file.name || t('unnamedFile'),
                  name: `${selectedJob.person.firstName} ${selectedJob.person.lastName}`,
                })}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {isLoadingSkills ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : extractedSkills.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>{t('noSkillsExtracted')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {extractedSkills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{skill.name}</span>
                        <Badge variant="outline">{skill.category}</Badge>
                      </div>
                      {skill.evidence && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{skill.evidence}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={skill.confidence >= 0.8 ? 'default' : 'secondary'}
                        className={skill.confidence >= 0.8 ? 'bg-green-500' : ''}
                      >
                        {Math.round(skill.confidence * 100)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={closeReviewDialog}>
              {t('close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
