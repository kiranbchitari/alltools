import type { Metadata } from 'next';
import { getTool } from '@/lib/tools';

const tool = getTool('ai-text-enhancer');

export const metadata: Metadata = {
    title: tool?.title || 'AI Text Enhancer',
    description: tool?.description || 'Improve and rewrite text using Groq AI models',
    keywords: tool?.keywords?.join(', '),
    openGraph: {
        title: tool?.title || 'AI Text Enhancer',
        description: tool?.description || 'Improve and rewrite text using Groq AI models',
        images: ['/og-image.png'],
    },
    twitter: {
        title: tool?.title || 'AI Text Enhancer',
        description: tool?.description || 'Improve and rewrite text using Groq AI models',
        images: ['/og-image.png'],
    },
};

export { default } from './page';
