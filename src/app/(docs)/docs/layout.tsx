import type { Metadata } from 'next';

import { DocsLayoutClient } from '@/features/docs/components/DocsLayoutClient';

export const metadata: Metadata = {
  title: 'Documentation | Next.js SaaS AI Template',
  description:
    'Complete documentation for the Next.js SaaS AI Template platform — guides for members, managers, 1:1 facilitators, and administrators.',
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <DocsLayoutClient>{children}</DocsLayoutClient>;
}
