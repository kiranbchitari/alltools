import type { Metadata } from 'next';

import { getTool } from '@/lib/tools';

const tool = getTool('diff-checker');

export const metadata: Metadata = {
    title: tool?.title || 'Diff Checker',
    description: tool?.description || 'Compare text differences',
    keywords: tool?.keywords?.join(', '),
    openGraph: {
        title: tool?.title || 'Diff Checker',
        description: tool?.description || 'Compare text differences',
        images: ['/og-image.png'],
    },
    twitter: {
        title: tool?.title || 'Diff Checker',
        description: tool?.description || 'Compare text differences',
        images: ['/og-image.png'],
    },
};

export { default } from './page';
