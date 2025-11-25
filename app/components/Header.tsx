import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <Link
                    href="/"
                    className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                    aria-label="DevTools Hub - Home"
                >
                    FormatMint
                </Link>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                    Fast, clean and free online tools for developers.
                </p>
            </div>
        </header>
    );
}
