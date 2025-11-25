import type { Metadata } from 'next';
import { getTool } from '@/lib/tools';

const tool = getTool('timestamp-converter');

export const metadata: Metadata = {
    title: tool?.title || 'Timestamp Converter',
    description: tool?.description || 'Convert Unix timestamps',
    keywords: tool?.keywords?.join(', '),
    openGraph: {
        title: tool?.title || 'Timestamp Converter',
        description: tool?.description || 'Convert Unix timestamps',
        images: ['/og-image.png'],
    },
    twitter: {
        title: tool?.title || 'Timestamp Converter',
        description: tool?.description || 'Convert Unix timestamps',
        images: ['/og-image.png'],
    },
};

export { default } from './page';
