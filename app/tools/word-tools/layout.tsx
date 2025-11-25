import type { Metadata } from 'next';
import { getTool } from '@/lib/tools';

const tool = getTool('word-tools');

export const metadata: Metadata = {
    title: tool?.title || 'Word Tools',
    description: tool?.description || 'Word and text tools',
    keywords: tool?.keywords?.join(', '),
};

export { default } from './page';
