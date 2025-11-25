import { getEnabledTools } from '@/lib/tools';

export default function sitemap() {
    const tools = getEnabledTools();
    const baseUrl = 'https://devtools-hub.com'; // Update with your actual domain

    const routes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 1.0,
        },
        ...tools.map(tool => ({
            url: `${baseUrl}${tool.path}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        })),
    ];

    return routes;
}
