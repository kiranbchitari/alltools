import type { Metadata } from 'next';

import { getTool } from '@/lib/tools';

const tool = getTool('markdown-preview');

export const metadata: Metadata = {
    title: tool?.title || 'Markdown Preview',
    description: tool?.description || 'Live Markdown preview',
    keywords: tool?.keywords?.join(', '),
    openGraph: {
        title: tool?.title || 'Markdown Preview',
        description: tool?.description || 'Live Markdown preview',
        images: ['/og-image.png'],
    },
    twitter: {
        title: tool?.title || 'Markdown Preview',
        description: tool?.description || 'Live Markdown preview',
        images: ['/og-image.png'],
    },
};

export { default } from './page';
