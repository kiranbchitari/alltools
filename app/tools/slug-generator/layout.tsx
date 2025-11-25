import type { Metadata } from 'next';

import { getTool } from '@/lib/tools';

const tool = getTool('slug-generator');

export const metadata: Metadata = {
    title: tool?.title || 'Slug Generator',
    description: tool?.description || 'Generate URL slugs',
    keywords: tool?.keywords?.join(', '),
    openGraph: {
        title: tool?.title || 'Slug Generator',
        description: tool?.description || 'Generate URL slugs',
        images: ['/og-image.png'],
    },
    twitter: {
        title: tool?.title || 'Slug Generator',
        description: tool?.description || 'Generate URL slugs',
        images: ['/og-image.png'],
    },
};

export { default } from './page';
