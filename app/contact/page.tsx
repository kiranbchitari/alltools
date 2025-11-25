import { generatePageMetadata } from '@/lib/metadata';
import PageLayout from '../components/PageLayout';

export const metadata = generatePageMetadata({
    title: 'Contact Us - FormatMint',
    description: 'Get in touch with the FormatMint team. We welcome feedback, suggestions, and bug reports.',
    path: '/contact',
});

export default function ContactPage() {
    return (
        <PageLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>

                <div className="prose prose-blue max-w-none text-gray-600">
                    <p className="text-lg mb-8">
                        We value your feedback! Whether you have a suggestion for a new tool, found a bug, or just want to say hello, we're here to listen.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
                            <p className="mb-4">
                                The best way to reach us is via email. We try to respond to all inquiries within 24-48 hours.
                            </p>
                            <a
                                href="mailto:kiranbchitari@gmail.com"
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                            >
                                Email Us
                            </a>
                            <p className="text-sm text-gray-500 mt-3">
                                kiranbchitari@gmail.com
                            </p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Common Reasons to Contact</h2>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Report a bug or issue with a tool</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Suggest a new feature or tool</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Partnership inquiries</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>General feedback</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Follow Us</h2>
                    <p className="mb-4">
                        Stay updated with the latest tools and features by following us on social media.
                    </p>
                    <div className="flex space-x-4">
                        {/* Add social links here if available */}
                        <span className="text-gray-400 italic">Social media links coming soon...</span>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
