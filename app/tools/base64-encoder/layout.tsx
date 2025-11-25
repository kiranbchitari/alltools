import type { Metadata } from 'next';
import { getTool } from '@/lib/tools';

const tool = getTool('base64-encoder');

export const metadata: Metadata = {
    title: tool?.title || 'Base64 Encoder',
    description: tool?.description || 'Encode and decode Base64',
    keywords: tool?.keywords?.join(', '),
};

export { default } from './page';
