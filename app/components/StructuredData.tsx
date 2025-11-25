interface StructuredDataProps {
    data: Record<string, unknown>;
}

/**
 * Component to inject JSON-LD structured data into the page
 */
export default function StructuredData({ data }: StructuredDataProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

/**
 * Generate WebApplication schema for tool pages
 */
export function generateToolSchema(toolName: string, toolDescription: string, toolUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: toolName,
        description: toolDescription,
        url: toolUrl,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Web',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        browserRequirements: 'Requires JavaScript. Modern browser recommended.',
    };
}

/**
 * Generate Organization schema for the site
 */
export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'FormatMint',
        url: 'https://formatmint.com',
        logo: 'https://formatmint.com/og-image.png',
        description: 'Free, fast, and privacy-focused developer tools. No server-side processing for most tools.',
        sameAs: [
            'https://github.com/kiranbchitari/',
        ],
    };
}

/**
 * Generate BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}
