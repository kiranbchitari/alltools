import Link from 'next/link';
import RelatedTools from './RelatedTools';
import Footer from './Footer';

interface ToolLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
    toolKey: string;
}

export default function ToolLayout({ children, title, description, toolKey }: ToolLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <Link
                            href="/"
                            className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                            aria-label="DevTools Hub - Home"
                        >
                            FormatMint
                        </Link>
                        <Link
                            href="/"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
                            aria-label="Back to all tools"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            All Tools
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
                </div>

                {children}

                <RelatedTools currentToolKey={toolKey} />
            </main>

            <Footer />
        </div>
    );
}
