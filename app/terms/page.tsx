import { generatePageMetadata } from '@/lib/metadata';
import Link from 'next/link';
import PageLayout from '../components/PageLayout';

export const metadata = generatePageMetadata({
    title: 'Terms of Service - FormatMint',
    description: 'The terms and conditions for using FormatMint developer tools.',
    path: '/terms',
});

export default function TermsPage() {
    return (
        <PageLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
                <p className="text-sm text-gray-500 mb-8">Last Updated: November 25, 2025</p>

                <div className="prose prose-blue max-w-none text-gray-600">
                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p className="mb-4">
                        By accessing and using FormatMint (https://formatmint.com), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
                    <p className="mb-4">
                        FormatMint provides various online developer tools and utilities. You understand and agree that the Service is provided "AS-IS" and that FormatMint assumes no responsibility for the timeliness, deletion, mis-delivery or failure to store any user communications or personalization settings.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. User Conduct</h2>
                    <p className="mb-4">
                        You agree to use the website only for lawful purposes. You are prohibited from posting on or transmitting through the website any material that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, sexually explicit, profane, hateful, racially, ethnically, or otherwise objectionable.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Intellectual Property</h2>
                    <p className="mb-4">
                        The content, organization, graphics, design, compilation, magnetic translation, digital conversion and other matters related to the Site are protected under applicable copyrights, trademarks and other proprietary (including but not limited to intellectual property) rights.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Disclaimer of Warranties</h2>
                    <p className="mb-4">
                        YOU EXPRESSLY UNDERSTAND AND AGREE THAT YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK. THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. FORMATMINT EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Limitation of Liability</h2>
                    <p className="mb-4">
                        IN NO EVENT SHALL FORMATMINT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO, DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA OR OTHER INTANGIBLE LOSSES.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Changes to Terms</h2>
                    <p className="mb-6">
                        FormatMint reserves the right to update or change these Terms of Service at any time. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms of Service.
                    </p>

                    <div className="bg-gray-50 p-4 rounded-lg mt-8">
                        <p className="text-gray-700">
                            If you have any questions about these Terms, please <Link href="/contact" className="text-blue-600 hover:underline">contact us</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
