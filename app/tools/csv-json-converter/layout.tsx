import type { Metadata } from 'next';
import { getTool } from '@/lib/tools';

const tool = getTool('csv-json-converter');

export const metadata: Metadata = {
    title: tool?.title || 'CSV JSON Converter',
    description: tool?.description || 'Convert CSV to JSON and vice versa',
    keywords: tool?.keywords?.join(', '),
};

export { default } from './page';
