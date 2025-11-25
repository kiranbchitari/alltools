import type { Metadata } from 'next';

import { getTool } from '@/lib/tools';

const tool = getTool('html-editor');

export const metadata: Metadata = {
    title: tool?.title || 'HTML Editor',
    description: tool?.description || 'Online HTML Editor with live preview',
    keywords: tool?.keywords?.join(', '),
    openGraph: {
        title: tool?.title || 'HTML Editor',
        description: tool?.description || 'Online HTML Editor with live preview',
        images: ['/og-image.png'],
    },
    twitter: {
        title: tool?.title || 'HTML Editor',
        description: tool?.description || 'Online HTML Editor with live preview',
        images: ['/og-image.png'],
    },
};

export { default } from './page';
