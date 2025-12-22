import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/blog';
import { generatePageMetadata } from '@/lib/metadata';
import Header from '@/app/components/Header';

export const metadata = generatePageMetadata({
    title: 'FormatMint Blog - Developer Tutorials & Guides',
    description: 'Learn about web development, responsive design, JSON formatting, and more with our in-depth tutorials and guides.',
    path: '/blog',
});

export default function BlogIndex() {
    const posts = getAllPosts();

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <Header />
            {/* Modern Hero Section */}
            <div className="relative overflow-hidden">
                {/* Animated background blobs */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-400/30 to-emerald-400/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-20 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
                    <div className="text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm mb-8">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-sm font-medium text-slate-600">{posts.length} articles published</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent tracking-tight">
                            Developer Blog
                        </h1>
                        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            Practical tutorials, tips, and insights for modern web development.
                            No fluff, just useful content.
                        </p>

                        {/* Quick stats */}
                        <div className="mt-10 flex flex-wrap justify-center gap-6">
                            <div className="flex items-center gap-3 px-5 py-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <p className="text-2xl font-bold text-slate-900">{posts.length}</p>
                                    <p className="text-sm text-slate-500">Total Articles</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-5 py-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <p className="text-2xl font-bold text-slate-900">Weekly</p>
                                    <p className="text-sm text-slate-500">New Content</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {/* Section header */}
                <div className="flex items-center gap-4 mb-10">
                    <h2 className="text-2xl font-bold text-slate-900">Latest Articles</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post, index) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group relative flex flex-col rounded-3xl bg-white border border-slate-200/60 overflow-hidden hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Image container */}
                            <div className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                                <Image
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    src={`/blog/${post.slug}/images/${post.thumbnail.split('/').pop()}`}
                                    alt={post.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-6 flex flex-col">
                                {/* Date badge */}
                                <div className="flex items-center gap-2 mb-3">
                                    <time
                                        dateTime={post.date}
                                        className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full"
                                    >
                                        {new Date(post.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </time>
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-2 mb-3">
                                    {post.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-slate-500 line-clamp-2 flex-1">
                                    {post.description}
                                </p>

                                {/* Read more */}
                                <div className="mt-4 flex items-center text-sm font-medium text-teal-600 group-hover:text-teal-700">
                                    <span>Read article</span>
                                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Decorative corner accent */}
                            <div className={`absolute top-0 right-0 w-20 h-20 ${index % 3 === 0 ? 'bg-gradient-to-br from-teal-500/10 to-transparent' :
                                index % 3 === 1 ? 'bg-gradient-to-br from-emerald-500/10 to-transparent' :
                                    'bg-gradient-to-br from-amber-500/10 to-transparent'
                                } rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                        </Link>
                    ))}
                </div>

                {/* Empty state */}
                {posts.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No articles yet</h3>
                        <p className="text-slate-500 mt-1">Check back soon for new content!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
