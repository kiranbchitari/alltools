import type { Metadata } from 'next';
import { getTool } from '@/lib/tools';

const tool = getTool('qr-code-generator');

export const metadata: Metadata = {
    title: tool?.title || 'QR Code Generator',
    description: tool?.description || 'Generate QR codes',
    keywords: tool?.keywords?.join(', '),
};

export { default } from './page';
