import type { Metadata } from 'next';
import { getTool } from '@/lib/tools';

const tool = getTool('html-editor');

export const metadata: Metadata = {
    title: tool?.title || 'HTML Editor',
    description: tool?.description || 'Online HTML editor',
    keywords: tool?.keywords?.join(', '),
};

export { default } from './page';
