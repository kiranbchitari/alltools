import type { Metadata } from 'next';
import { getTool } from '@/lib/tools';

const tool = getTool('slug-generator');

export const metadata: Metadata = {
    title: tool?.title || 'Slug Generator',
    description: tool?.description || 'Generate SEO-friendly slugs',
    keywords: tool?.keywords?.join(', '),
};

export { default } from './page';
