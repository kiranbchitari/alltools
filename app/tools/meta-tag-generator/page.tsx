'use client';

import { useState } from 'react';
import ToolLayout from '@/app/components/ToolLayout';
import Button from '@/app/components/Button';
import CopyButton from '@/app/components/CopyButton';
import { getTool } from '@/lib/tools';

export default function MetaTagGeneratorPage() {
    const tool = getTool('meta-tag-generator');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [url, setUrl] = useState('');
    const [siteName, setSiteName] = useState('');
    const [twitterHandle, setTwitterHandle] = useState('');
    const [output, setOutput] = useState('');

    const generateMetaTags = () => {
        const tags = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${image}">
${siteName ? `<meta property="og:site_name" content="${siteName}">` : ''}

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${image}">
${twitterHandle ? `<meta property="twitter:site" content="@${twitterHandle.replace('@', '')}">` : ''}`;

        setOutput(tags);
    };

    const clearAll = () => {
        setTitle('');
        setDescription('');
        setImage('');
        setUrl('');
        setSiteName('');
        setTwitterHandle('');
        setOutput('');
    };

    if (!tool) return null;

    return (
        <ToolLayout title={tool.title} description={tool.description} toolKey="meta-tag-generator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Input Form */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Page Information</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Page Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="My Awesome Website"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                aria-label="Page title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="A brief description of your page..."
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-20"
                                aria-label="Page description"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Page URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com/page"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                aria-label="Page URL"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Image URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                aria-label="Image URL"
                            />
                            <p className="text-xs text-gray-500 mt-1">Recommended: 1200x630px</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Site Name (Optional)
                            </label>
                            <input
                                type="text"
                                value={siteName}
                                onChange={(e) => setSiteName(e.target.value)}
                                placeholder="My Website"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                aria-label="Site name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Twitter Handle (Optional)
                            </label>
                            <input
                                type="text"
                                value={twitterHandle}
                                onChange={(e) => setTwitterHandle(e.target.value)}
                                placeholder="@username"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                aria-label="Twitter handle"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <Button onClick={generateMetaTags} variant="primary" size="md" fullWidth>
                            Generate Meta Tags
                        </Button>
                        <Button onClick={clearAll} variant="ghost" size="md">
                            Clear
                        </Button>
                    </div>
                </div>

                {/* Output */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Generated Meta Tags</h2>
                        {output && <CopyButton text={output} />}
                    </div>
                    <textarea
                        value={output}
                        readOnly
                        className="w-full p-3 sm:p-4 font-mono text-xs border border-gray-300 rounded-lg bg-gray-50 resize-none h-96 sm:h-[500px]"
                        placeholder="Generated meta tags will appear here..."
                        aria-label="Generated meta tags"
                    />
                </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Features:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Primary Meta Tags:</strong> Title and description for search engines</li>
                    <li>• <strong>Open Graph:</strong> Rich previews for Facebook and LinkedIn</li>
                    <li>• <strong>Twitter Cards:</strong> Beautiful previews for Twitter</li>
                    <li>• Copy and paste directly into your HTML &lt;head&gt;</li>
                    <li>• Improves SEO and social media sharing</li>
                </ul>
            </div>
        </ToolLayout>
    );
}
