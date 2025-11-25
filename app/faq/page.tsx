import type { Metadata } from 'next';
import Link from 'next/link';
import PageLayout from '../components/PageLayout';

export const metadata: Metadata = {
    title: 'Frequently Asked Questions - FormatMint',
    description: 'Common questions about FormatMint, our tools, and privacy.',
};

export default function FAQPage() {
    return (
        <PageLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h1>

                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Is FormatMint free to use?</h2>
                        <p className="text-gray-600">
                            Yes, all tools on FormatMint are completely free to use. We believe in providing accessible utilities for everyone.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Do you store my files or data?</h2>
                        <p className="text-gray-600">
                            No. Most of our tools run entirely in your web browser (client-side). This means your files, code, and text never leave your device. For the few tools that might require server processing (if any), we do not store any data after processing is complete.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Are there any limits on usage?</h2>
                        <p className="text-gray-600">
                            Generally, no. You can use the tools as much as you like. However, since most processing happens on your device, very large files might be limited by your browser's memory capabilities.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Can I suggest a new tool?</h2>
                        <p className="text-gray-600">
                            Absolutely! We love hearing from our users. Please use our <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link> to send us your suggestions.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Why do I see ads?</h2>
                        <p className="text-gray-600">
                            To keep the site free and cover hosting costs, we may display advertisements. We try to ensure these ads are non-intrusive and relevant to our users.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">How do I report a bug?</h2>
                        <p className="text-gray-600">
                            If you encounter any issues, please let us know via the <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link>. Please include details about the tool you were using and the browser you are on.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Is there an API available?</h2>
                        <p className="text-gray-600">
                            Currently, we do not offer a public API. Our tools are designed for direct use through the web interface.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Do you use cookies?</h2>
                        <p className="text-gray-600">
                            We use cookies primarily for analytics and to save your preferences (like dark mode or recent inputs). You can read more in our <Link href="/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
