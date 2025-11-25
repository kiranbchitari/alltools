'use client';

import { useState } from 'react';
import ToolLayout from '@/app/components/ToolLayout';
import Button from '@/app/components/Button';
import Textarea from '@/app/components/Textarea';
import CopyButton from '@/app/components/CopyButton';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getTool } from '@/lib/tools';

export default function SlugGeneratorPage() {
    const tool = getTool('slug-generator');
    const [input, setInput, clearInput] = useLocalStorage('slug-generator-input', '');
    const [output, setOutput] = useState('');

    const generateSlug = () => {
        const slug = input
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        setOutput(slug);
    };

    const insertExample = () => {
        if (tool?.example) {
            setInput(tool.example);
        }
    };

    if (!tool) return null;

    return (
        <ToolLayout title={tool.title} description={tool.description} toolKey="slug-generator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Input Text</h2>
                        <div className="flex gap-2">
                            <Button onClick={insertExample} variant="secondary" size="sm">Insert Example</Button>
                            <Button onClick={() => clearInput()} variant="ghost" size="sm">Clear</Button>
                        </div>
                    </div>
                    <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="h-64 sm:h-96" placeholder="Enter your title or text..." />
                </div>

                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Generated Slug</h2>
                        {output && <CopyButton text={output} />}
                    </div>
                    <Textarea value={output} readOnly className="h-64 sm:h-96 bg-gray-50" placeholder="SEO-friendly slug will appear here..." />
                </div>
            </div>

            <div className="mt-6">
                <Button onClick={generateSlug} variant="primary" size="md" fullWidth className="sm:w-auto">Generate Slug</Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Features:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Converts text to lowercase</li>
                    <li>• Replaces spaces with hyphens</li>
                    <li>• Removes special characters</li>
                    <li>• Perfect for blog URLs and permalinks</li>
                    <li>• SEO-friendly output</li>
                </ul>
            </div>
        </ToolLayout>
    );
}
