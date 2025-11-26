import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { generatePageMetadata } from '@/lib/metadata';
import toolsConfig from '@/config/tools.json';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return {};
    }

    return generatePageMetadata({
        title: post.title,
        description: post.description,
        path: `/blog/${slug}`,
        ogImage: `/blog/${slug}/images/${post.thumbnail.split('/').pop()}`,
        keywords: post.keywords,
    });
}

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPost({ params }: Props) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const allPosts = getAllPosts();
    const relatedPosts = allPosts
        .filter(p => p.slug !== post.slug)
        .slice(0, 3);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.description,
        image: `https://formatmint.com/blog/${slug}/images/${post.thumbnail.split('/').pop()}`,
        datePublished: post.date,
        author: {
            '@type': 'Organization',
            name: 'FormatMint',
            url: 'https://formatmint.com'
        },
        publisher: {
            '@type': 'Organization',
            name: 'FormatMint',
            logo: {
                '@type': 'ImageObject',
                url: 'https://formatmint.com/logo.jpg'
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <header className="mb-10 text-center">
                    <div className="mb-6">
                        <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-medium">
                            ← Back to Blog
                        </Link>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
                        {post.title}
                    </h1>
                    <div className="text-gray-500">
                        <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="relative w-full h-[400px] mb-12 rounded-xl overflow-hidden shadow-lg">
                    <Image
                        src={`/blog/${slug}/images/${post.thumbnail.split('/').pop()}`}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Content */}
                <div className="prose prose-lg prose-slate max-w-none bg-white p-8 md:p-12 rounded-xl shadow-sm overflow-hidden text-gray-800">
                    <ReactMarkdown
                        rehypePlugins={[rehypeRaw, rehypeSlug]}
                        components={{
                            img: ({ node, ...props }) => {
                                const src = (props.src as string) || '';
                                // Handle relative image paths from markdown
                                const imagePath = src.startsWith('./')
                                    ? `/blog/${slug}/images/${src.replace('./images/', '')}`
                                    : src;

                                return (
                                    <span className="block relative w-full h-[400px] my-8 rounded-lg overflow-hidden">
                                        <Image
                                            src={imagePath}
                                            alt={(props.alt as string) || ''}
                                            fill
                                            className="object-cover"
                                        />
                                    </span>
                                );
                            },
                            a: ({ node, ...props }) => (
                                <a {...props} className="text-blue-600 hover:text-blue-800 underline break-words" />
                            ),
                            code: ({ node, ...props }) => (
                                <code {...props} className="break-words whitespace-pre-wrap" />
                            ),
                            pre: ({ node, ...props }) => (
                                <pre {...props} className="overflow-x-auto" />
                            ),
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>

                {/* Related Tools */}
                {post.relatedTools.length > 0 && (
                    <div className="mt-12 bg-white p-8 rounded-xl shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Tools</h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            {post.relatedTools.map(toolKey => {
                                const tool = toolsConfig[toolKey as keyof typeof toolsConfig];
                                if (!tool) return null;
                                return (
                                    <Link
                                        key={toolKey}
                                        href={tool.path}
                                        className="block p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.title}</h3>
                                        <p className="text-gray-600 text-sm">{tool.description}</p>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">More from the Blog</h2>
                        <div className="grid gap-8 md:grid-cols-3">
                            {relatedPosts.map(p => (
                                <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
                                    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="relative h-40">
                                            <Image
                                                src={`/blog/${p.slug}/images/${p.thumbnail.split('/').pop()}`}
                                                alt={p.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2">
                                                {p.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-2">
                                                {new Date(p.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </div>
    );
}
