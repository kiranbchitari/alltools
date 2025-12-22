import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    aria-label="FormatMint - Home"
                >
                    <Image
                        src="/logo.png"
                        alt="FormatMint Logo"
                        width={36}
                        height={36}
                        className="rounded-lg shadow-sm"
                    />
                    <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                        FormatMint
                    </span>
                </Link>

                <nav className="flex items-center gap-6">
                    <Link
                        href="/blog"
                        className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
                    >
                        Blog
                    </Link>
                    <Link
                        href="/"
                        className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md"
                    >
                        All Tools
                    </Link>
                </nav>
            </div>
        </header>
    );
}
