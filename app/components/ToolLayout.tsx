import Link from 'next/link';
import Image from 'next/image';
import RelatedTools from './RelatedTools';
import Footer from './Footer';
import StructuredData, { generateToolSchema, generateBreadcrumbSchema } from './StructuredData';
import { getTool } from '@/lib/tools';

interface ToolLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
    toolKey: string;
}

export default function ToolLayout({ children, title, description, toolKey }: ToolLayoutProps) {
    const tool = getTool(toolKey);
    const toolUrl = `https://formatmint.com${tool?.path || ''}`;

    // Generate structured data
    const toolSchema = generateToolSchema(title, description, toolUrl);
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: 'https://formatmint.com' },
        { name: title, url: toolUrl },
    ]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
            <StructuredData data={toolSchema} />
            <StructuredData data={breadcrumbSchema} />

            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                            aria-label="FormatMint - Home"
                        >
                            <Image
                                src="/logo.png"
                                alt="FormatMint Logo"
                                width={32}
                                height={32}
                                className="rounded-lg shadow-sm"
                            />
                            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                                FormatMint
                            </span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/blog"
                                className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
                            >
                                Blog
                            </Link>
                            <Link
                                href="/"
                                className="text-teal-600 hover:text-teal-700 text-sm font-medium inline-flex items-center gap-1"
                                aria-label="Back to all tools"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                All Tools
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{title}</h1>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{description}</p>
                </div>

                {children}

                <RelatedTools currentToolKey={toolKey} />
            </main>

            <Footer />
        </div>
    );
}
