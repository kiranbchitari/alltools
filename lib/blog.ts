import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import toolsConfig from '@/config/tools.json';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    thumbnail: string;
    keywords: string[];
    relatedTools: string[];
    content: string;
}

export function getPostSlugs() {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }
    return fs.readdirSync(postsDirectory).filter(file => {
        return fs.statSync(path.join(postsDirectory, file)).isDirectory();
    });
}

export function getPostBySlug(slug: string): BlogPost | null {
    const realSlug = slug.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, realSlug, 'index.md');

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Process internal links
    const processedContent = processInternalLinks(content);

    return {
        slug: realSlug,
        title: data.title,
        description: data.description,
        date: data.date,
        thumbnail: data.thumbnail,
        keywords: data.keywords || [],
        relatedTools: data.relatedTools || [],
        content: processedContent,
    };
}

export function getAllPosts(): BlogPost[] {
    const slugs = getPostSlugs();
    const posts = slugs
        .map((slug) => getPostBySlug(slug))
        .filter((post): post is BlogPost => post !== null)
        .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
    return posts;
}

function processInternalLinks(content: string): string {
    let processed = content;

    // Get all tools with their keywords
    const tools = Object.entries(toolsConfig).map(([key, config]: [string, any]) => ({
        key,
        name: config.title,
        path: config.path,
        keywords: config.keywords || []
    }));

    // Simple replacement strategy - find first occurrence of keywords and link them
    // This is a basic implementation to avoid over-linking
    const linkedKeywords = new Set();

    tools.forEach(tool => {
        // Try to link the tool name first
        if (!linkedKeywords.has(tool.name)) {
            const regex = new RegExp(`\\b${escapeRegExp(tool.name)}\\b`, 'i');
            if (regex.test(processed)) {
                processed = processed.replace(regex, `[${tool.name}](${tool.path})`);
                linkedKeywords.add(tool.name);
            }
        }

        // Then try keywords
        tool.keywords.forEach((keyword: string) => {
            if (keyword.length > 4 && !linkedKeywords.has(keyword)) { // Only link substantial keywords
                const regex = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'i');
                // Check if not already inside a link
                if (regex.test(processed) && !isInsideLink(processed, keyword)) {
                    processed = processed.replace(regex, `[${keyword}](${tool.path})`);
                    linkedKeywords.add(keyword);
                }
            }
        });
    });

    return processed;
}

function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isInsideLink(content: string, keyword: string): boolean {
    // Very basic check to see if the keyword is already part of a markdown link [text](url)
    // This is not perfect but covers common cases
    const regex = new RegExp(`\\[[^\\]]*${escapeRegExp(keyword)}[^\\]]*\\]\\([^\\)]+\\)`, 'i');
    return regex.test(content);
}
