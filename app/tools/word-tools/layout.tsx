import type { Metadata } from 'next';
import { getTool } from '@/lib/tools';

const tool = getTool('word-tools');

export const metadata: Metadata = {
    title: tool?.title || 'Word Tools',
    description: tool?.description || 'Count words and characters',
    keywords: tool?.keywords?.join(', '),
    openGraph: {
        title: tool?.title || 'Word Tools',
        description: tool?.description || 'Count words and characters',
        images: ['/og-image.png'],
    },
    twitter: {
        title: tool?.title || 'Word Tools',
        description: tool?.description || 'Count words and characters',
        images: ['/og-image.png'],
    },
};

export { default } from './page';
