'use client';

import { useState, useEffect } from 'react';
import ToolLayout from '@/app/components/ToolLayout';
import Button from '@/app/components/Button';
import Textarea from '@/app/components/Textarea';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getTool } from '@/lib/tools';


export default function MarkdownPreviewPage() {
    const tool = getTool('markdown-preview');
    const [markdown, setMarkdown, clearMarkdown] = useLocalStorage('markdown-preview-input', '');
    const [html, setHtml] = useState('');

    useEffect(() => {
        const renderMarkdown = async () => {
            try {
                const { marked } = await import('marked');
                const rendered = await marked(markdown);
                setHtml(rendered);
            } catch (e) {
                setHtml('<p class="text-red-600">Error rendering markdown</p>');
            }
        };
        renderMarkdown();
    }, [markdown]);

    const insertExample = () => {
        if (tool?.example) {
            setMarkdown(tool.example);
        }
    };

    if (!tool) return null;

    return (
        <ToolLayout title={tool.title} description={tool.description} toolKey="markdown-preview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Editor */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Markdown Editor</h2>
                        <div className="flex gap-2">
                            <Button onClick={insertExample} variant="secondary" size="sm">Insert Example</Button>
                            <Button onClick={() => clearMarkdown()} variant="ghost" size="sm">Clear</Button>
                        </div>
                    </div>
                    <Textarea
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        className="h-96 sm:h-[500px]"
                        placeholder="# Write your markdown here..."
                        aria-label="Markdown editor"
                    />
                </div>

                {/* Preview */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Live Preview</h2>
                    <div
                        className="prose prose-sm sm:prose max-w-none p-4 border border-gray-200 rounded-lg bg-gray-50 h-96 sm:h-[500px] overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: html }}
                        aria-label="Markdown preview"
                    />
                </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Supported Markdown:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Headers:</strong> # H1, ## H2, ### H3</li>
                    <li>• <strong>Emphasis:</strong> **bold**, *italic*, ~~strikethrough~~</li>
                    <li>• <strong>Lists:</strong> Ordered and unordered lists</li>
                    <li>• <strong>Links:</strong> [text](url)</li>
                    <li>• <strong>Code:</strong> Inline `code` and code blocks with ```</li>
                    <li>• <strong>Tables, blockquotes, and more</strong></li>
                </ul>
            </div>
        </ToolLayout>
    );
}
