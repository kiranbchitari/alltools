import type { Metadata } from 'next';
import { getTool } from '@/lib/tools';

const tool = getTool('image-compressor');

export const metadata: Metadata = {
    title: tool?.title || 'Image Compressor',
    description: tool?.description || 'Compress images to reduce file size',
    keywords: tool?.keywords?.join(', '),
};

export { default } from './page';
