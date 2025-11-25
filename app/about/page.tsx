import type { Metadata } from 'next';
import Link from 'next/link';
import PageLayout from '../components/PageLayout';

export const metadata: Metadata = {
    title: 'About Us - FormatMint',
    description: 'Learn about FormatMint, our mission to provide fast, free, and privacy-focused developer tools.',
};

export default function AboutPage() {
    return (
        <PageLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">About FormatMint</h1>

                <div className="prose prose-blue max-w-none text-gray-600">
                    <p className="text-lg mb-6">
                        Welcome to <strong>FormatMint</strong>, your go-to destination for fast, free, and privacy-focused developer tools.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
                    <p className="mb-4">
                        Our mission is simple: to provide high-quality, reliable tools that help developers, designers, and content creators work more efficiently. We believe that essential utilities should be accessible, fast, and respect your privacy.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Why Choose Us?</h2>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>Privacy First:</strong> Most of our tools run entirely in your browser. Your data rarely leaves your device.</li>
                        <li><strong>Speed:</strong> We optimize for performance so you can get your task done quickly.</li>
                        <li><strong>Simplicity:</strong> Clean interfaces without unnecessary clutter or distractions.</li>
                        <li><strong>Free Forever:</strong> Our core tools are and will always be free to use.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Story</h2>
                    <p className="mb-6">
                        FormatMint started as a personal collection of scripts and utilities. Realizing that many developers face the same small but repetitive tasks daily, we decided to package these into a unified, easy-to-use platform. Today, we offer a growing suite of tools ranging from code formatters to image converters.
                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-8">
                        <p className="text-blue-700">
                            Have a suggestion for a new tool? We'd love to hear from you! Check out our <Link href="/contact" className="underline font-medium hover:text-blue-800">Contact page</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
