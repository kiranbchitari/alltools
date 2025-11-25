import type { Metadata } from 'next';
import { getTool } from '@/lib/tools';

const tool = getTool('url-encoder');

export const metadata: Metadata = {
    title: tool?.title || 'URL Encoder',
    description: tool?.description || 'Encode and decode URLs',
    keywords: tool?.keywords?.join(', '),
    openGraph: {
        title: tool?.title || 'URL Encoder',
        description: tool?.description || 'Encode and decode URLs',
        images: ['/og-image.png'],
    },
    twitter: {
        title: tool?.title || 'URL Encoder',
        description: tool?.description || 'Encode and decode URLs',
        images: ['/og-image.png'],
    },
};

export { default } from './page';
