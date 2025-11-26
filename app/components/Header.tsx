import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
    return (
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Link
                        href="/"
                        className="flex items-center gap-3 w-fit hover:opacity-80 transition-opacity"
                        aria-label="FormatMint - Home"
                    >
                        <Image
                            src="/logo.jpg"
                            alt="FormatMint Logo"
                            width={40}
                            height={40}
                            className="rounded-lg shadow-sm"
                        />
                        <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            FormatMint
                        </span>
                    </Link>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base">
                        Fast, clean and free online tools for developers.
                    </p>
                </div>
                <nav className="flex items-center gap-6">
                    <Link
                        href="/blog"
                        className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        Blog
                    </Link>
                </nav>
            </div>
        </header>
    );
}
