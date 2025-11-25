import { Metadata } from 'next';
import { getTool } from './tools';

const BASE_URL = 'https://formatmint.com';
const SITE_NAME = 'FormatMint';
const DEFAULT_OG_IMAGE = '/og-image.png';

interface PageMetadataConfig {
    title: string;
    description: string;
    path: string;
    keywords?: string[];
    ogImage?: string;
}

/**
 * Generate metadata for tool pages based on tools.json configuration
 */
export function generateToolMetadata(toolKey: string): Metadata {
    const tool = getTool(toolKey);

    if (!tool) {
        return {};
    }

    const url = `${BASE_URL}${tool.path}`;
    const ogImage = DEFAULT_OG_IMAGE;

    return {
        title: tool.title,
        description: tool.description,
        keywords: tool.keywords,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: tool.title,
            description: tool.description,
            url: url,
            siteName: SITE_NAME,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: tool.title,
                },
            ],
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: tool.title,
            description: tool.description,
            images: [ogImage],
        },
    };
}

/**
 * Generate metadata for static pages (About, Contact, etc.)
 */
export function generatePageMetadata(config: PageMetadataConfig): Metadata {
    const url = `${BASE_URL}${config.path}`;
    const ogImage = config.ogImage || DEFAULT_OG_IMAGE;

    return {
        title: config.title,
        description: config.description,
        keywords: config.keywords,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: config.title,
            description: config.description,
            url: url,
            siteName: SITE_NAME,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: config.title,
                },
            ],
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: config.title,
            description: config.description,
            images: [ogImage],
        },
    };
}

/**
 * Get the base URL for the site
 */
export function getBaseUrl(): string {
    return BASE_URL;
}
