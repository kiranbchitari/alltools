import type { Metadata } from 'next';
import Link from 'next/link';
import PageLayout from '../components/PageLayout';

export const metadata: Metadata = {
    title: 'Cookie Policy - FormatMint',
    description: 'Cookie Policy for FormatMint. Learn how we use cookies and similar technologies.',
};

export default function CookiePolicyPage() {
    return (
        <PageLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
                <p className="text-sm text-gray-500 mb-8">Last Updated: November 25, 2025</p>

                <div className="prose prose-blue max-w-none text-gray-600">
                    <p className="mb-6">
                        This Cookie Policy explains what cookies are, how we use them, and your choices regarding cookies.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What Are Cookies?</h2>
                    <p className="mb-4">
                        Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How We Use Cookies</h2>
                    <p className="mb-4">
                        We use cookies for the following purposes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly. For example, we use local storage (similar to cookies) to save your preferences and tool inputs so you don't lose your work.</li>
                        <li><strong>Analytics Cookies:</strong> We use third-party analytics services (like Google Analytics) to help us understand how our website is used. These cookies track information such as how long you spend on the site and the pages that you visit.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Third-Party Cookies</h2>
                    <p className="mb-4">
                        In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Your Choices</h2>
                    <p className="mb-4">
                        If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.
                    </p>
                    <p className="mb-4">
                        Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">More Information</h2>
                    <p className="mb-6">
                        For more information about cookies, you can visit <a href="https://www.allaboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">All About Cookies</a>.
                    </p>

                    <div className="bg-gray-50 p-4 rounded-lg mt-8">
                        <p className="text-gray-700">
                            If you have any questions about our Cookie Policy, please <Link href="/contact" className="text-blue-600 hover:underline">contact us</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
