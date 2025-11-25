import type { Metadata } from 'next';
import { getTool } from '@/lib/tools';

const tool = getTool('meta-tag-generator');

export const metadata: Metadata = {
    title: tool?.title || 'Meta Tag Generator',
    description: tool?.description || 'Generate SEO meta tags',
    keywords: tool?.keywords?.join(', '),
};

export { default } from './page';
