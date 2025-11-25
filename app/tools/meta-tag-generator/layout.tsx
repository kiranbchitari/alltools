import type { Metadata } from 'next';
import { getTool } from '@/lib/tools';

const tool = getTool('meta-tag-generator');

export const metadata: Metadata = {
    title: tool?.title || 'Meta Tag Generator',
    description: tool?.description || 'Generate SEO meta tags',
    keywords: tool?.keywords?.join(', '),
    openGraph: {
        title: tool?.title || 'Meta Tag Generator',
        description: tool?.description || 'Generate SEO meta tags',
        images: ['/og-image.png'],
    },
    twitter: {
        title: tool?.title || 'Meta Tag Generator',
        description: tool?.description || 'Generate SEO meta tags',
        images: ['/og-image.png'],
    },
};

export { default } from './page';
