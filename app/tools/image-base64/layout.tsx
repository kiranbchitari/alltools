import type { Metadata } from 'next';
import { getTool } from '@/lib/tools';

const tool = getTool('image-base64');

export const metadata: Metadata = {
    title: tool?.title || 'Image to Base64',
    description: tool?.description || 'Convert images to Base64',
    keywords: tool?.keywords?.join(', '),
};

export { default } from './page';
