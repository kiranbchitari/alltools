import type { Metadata } from 'next';
import { getTool } from '@/lib/tools';

const tool = getTool('image-to-pdf');

export const metadata: Metadata = {
    title: tool?.title || 'Image to PDF Converter',
    description: tool?.description || 'Convert images to PDF format online',
    keywords: tool?.keywords?.join(', '),
    openGraph: {
        title: tool?.title || 'Image to PDF Converter',
        description: tool?.description || 'Convert images to PDF format online',
        images: ['/og-image.png'],
    },
    twitter: {
        title: tool?.title || 'Image to PDF Converter',
        description: tool?.description || 'Convert images to PDF format online',
        images: ['/og-image.png'],
    },
};

export { default } from './page';
