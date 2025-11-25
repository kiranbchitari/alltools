import type { Metadata } from 'next';

import { getTool } from '@/lib/tools';

const tool = getTool('image-compressor');

export const metadata: Metadata = {
    title: tool?.title || 'Image Compressor',
    description: tool?.description || 'Compress images online',
    keywords: tool?.keywords?.join(', '),
    openGraph: {
        title: tool?.title || 'Image Compressor',
        description: tool?.description || 'Compress images online',
        images: ['/og-image.png'],
    },
    twitter: {
        title: tool?.title || 'Image Compressor',
        description: tool?.description || 'Compress images online',
        images: ['/og-image.png'],
    },
};

export { default } from './page';
