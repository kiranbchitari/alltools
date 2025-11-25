import type { Metadata } from 'next';
import { getTool } from '@/lib/tools';

const tool = getTool('markdown-preview');

export const metadata: Metadata = {
    title: tool?.title || 'Markdown Preview',
    description: tool?.description || 'Preview markdown in real-time',
    keywords: tool?.keywords?.join(', '),
};

export { default } from './page';
