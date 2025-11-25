import type { Metadata } from 'next';
import { getTool } from '@/lib/tools';

const tool = getTool('json-formatter');

export const metadata: Metadata = {
    title: tool?.title || 'JSON Formatter',
    description: tool?.description || 'Format and validate JSON',
    keywords: tool?.keywords?.join(', '),
    openGraph: {
        title: tool?.title || 'JSON Formatter',
        description: tool?.description || 'Format and validate JSON',
        images: ['/og-image.png'],
    },
    twitter: {
        title: tool?.title || 'JSON Formatter',
        description: tool?.description || 'Format and validate JSON',
        images: ['/og-image.png'],
    },
};

export { default } from './page';
