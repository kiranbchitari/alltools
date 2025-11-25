import type { Metadata } from 'next';
import { getTool } from '@/lib/tools';

const tool = getTool('diff-checker');

export const metadata: Metadata = {
    title: tool?.title || 'Diff Checker',
    description: tool?.description || 'Compare text online',
    keywords: tool?.keywords?.join(', '),
};

export { default } from './page';
