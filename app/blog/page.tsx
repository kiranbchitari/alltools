import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/blog';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
    title: 'FormatMint Blog - Developer Tutorials & Guides',
    description: 'Learn about web development, responsive design, JSON formatting, and more with our in-depth tutorials and guides.',
    path: '/blog',
});

export default function BlogIndex() {
    const posts = getAllPosts();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl drop-shadow-lg">
                            FormatMint Blog
                        </h1>
                        <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
                            Tutorials, guides, and tips for developers. Learn about web development, responsive design, JSON formatting, and more.
                        </p>
                        <div className="mt-8 flex justify-center gap-4">
                            <div className="flex items-center gap-2 text-white/90">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                </svg>
                                <span className="text-sm font-medium">{posts.length} Articles</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/90">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium">Updated Weekly</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <div key={post.slug} className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300">
                            <div className="flex-shrink-0 relative h-48 w-full">
                                <Image
                                    className="object-cover"
                                    src={`/blog/${post.slug}/images/${post.thumbnail.split('/').pop()}`}
                                    alt={post.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-blue-600">
                                        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                                    </p>
                                    <Link href={`/blog/${post.slug}`} className="block mt-2">
                                        <p className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                            {post.title}
                                        </p>
                                        <p className="mt-3 text-base text-gray-500 line-clamp-3">
                                            {post.description}
                                        </p>
                                    </Link>
                                </div>
                                <div className="mt-6 flex items-center">
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="text-base font-semibold text-blue-600 hover:text-blue-500"
                                    >
                                        Read full article →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
