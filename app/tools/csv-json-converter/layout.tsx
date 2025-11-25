import type { Metadata } from 'next';
import { getTool } from '@/lib/tools';

const tool = getTool('csv-json-converter');

export const metadata: Metadata = {
    title: tool?.title || 'CSV JSON Converter',
    description: tool?.description || 'Convert CSV to JSON and vice versa',
    keywords: tool?.keywords?.join(', '),
    openGraph: {
        title: tool?.title || 'CSV to JSON Converter',
        description: tool?.description || 'Convert CSV to JSON and vice versa',
        images: ['/og-image.png'],
    },
    twitter: {
        title: tool?.title || 'CSV to JSON Converter',
        description: tool?.description || 'Convert CSV to JSON and vice versa',
        images: ['/og-image.png'],
    },
};

export { default } from './page';
