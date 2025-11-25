import type { Metadata } from 'next';
import { getTool } from '@/lib/tools';

const tool = getTool('image-resizer');

export const metadata: Metadata = {
    title: tool?.title || 'Image Resizer',
    description: tool?.description || 'Resize images online with custom dimensions',
    keywords: tool?.keywords?.join(', '),
};

export { default } from './page';
