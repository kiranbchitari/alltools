import type { Metadata } from 'next';

import { getTool } from '@/lib/tools';

const tool = getTool('image-base64');

export const metadata: Metadata = {
    title: tool?.title || 'Image to Base64',
    description: tool?.description || 'Convert images to Base64 string',
    keywords: tool?.keywords?.join(', '),
    openGraph: {
        title: tool?.title || 'Image to Base64',
        description: tool?.description || 'Convert images to Base64 string',
        images: ['/og-image.png'],
    },
    twitter: {
        title: tool?.title || 'Image to Base64',
        description: tool?.description || 'Convert images to Base64 string',
        images: ['/og-image.png'],
    },
};

export { default } from './page';
