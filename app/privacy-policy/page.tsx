import type { Metadata } from 'next';
import PageLayout from '../components/PageLayout';

export const metadata: Metadata = {
    title: 'Privacy Policy - FormatMint',
    description: 'Privacy Policy for FormatMint. Learn how we handle your data and protect your privacy.',
};

export default function PrivacyPolicyPage() {
    return (
        <PageLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
                <p className="text-sm text-gray-500 mb-8">Last Updated: November 25, 2025</p>

                <div className="prose prose-blue max-w-none text-gray-600">
                    <p className="mb-6">
                        At FormatMint, accessible from https://formatmint.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by FormatMint and how we use it.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Information Collection</h2>
                    <p className="mb-4">
                        We believe in data minimization. Most of our tools run entirely on the client-side (in your browser), meaning your data (such as code snippets, images, or text you process) is <strong>never sent to our servers</strong>.
                    </p>
                    <p className="mb-4">
                        However, we may collect standard log files and use analytics services to understand how our site is used. This information includes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li>Internet Protocol (IP) addresses</li>
                        <li>Browser type and version</li>
                        <li>Date and time stamp</li>
                        <li>Referring/exit pages</li>
                        <li>Number of clicks</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Cookies and Web Beacons</h2>
                    <p className="mb-4">
                        Like any other website, FormatMint uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
                    </p>
                    <p className="mb-4">
                        We may use third-party services like Google Analytics which use cookies to collect anonymous usage data.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Third Party Privacy Policies</h2>
                    <p className="mb-4">
                        FormatMint's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
                    <p className="mb-4">
                        Under the CCPA, among other rights, California consumers have the right to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li>Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
                        <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
                        <li>Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">GDPR Data Protection Rights</h2>
                    <p className="mb-4">
                        We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li>The right to access – You have the right to request copies of your personal data.</li>
                        <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate.</li>
                        <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Children's Information</h2>
                    <p className="mb-6">
                        Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. DevTools Hub does not knowingly collect any Personal Identifiable Information from children under the age of 13.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Consent</h2>
                    <p className="mb-6">
                        By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
                    </p>
                </div>
            </div>
        </PageLayout>
    );
}
