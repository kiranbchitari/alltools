'use client';

import { useState } from 'react';
import ToolLayout from '@/app/components/ToolLayout';
import Button from '@/app/components/Button';
import Textarea from '@/app/components/Textarea';
import LazyIframe from '@/app/components/LazyIframe';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getTool } from '@/lib/tools';

const EXAMPLE_HTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial; text-align: center; padding: 50px; }
    h1 { color: #3b82f6; }
  </style>
</head>
<body>
  <h1>Hello World!</h1>
  <p>Edit this HTML to see live changes.</p>
</body>
</html>`;

export default function HtmlEditorPage() {
    const tool = getTool('html-editor');
    const [html, setHtml, clearHtml] = useLocalStorage('html-editor-html', '<h1>Hello World</h1>');
    const [css, setCss, clearCss] = useLocalStorage('html-editor-css', 'h1 { color: blue; }');
    const [js, setJs, clearJs] = useLocalStorage('html-editor-js', 'console.log("Hello!");');
    const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');

    const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
    </html>
  `;

    const insertExample = () => {
        setHtml(EXAMPLE_HTML);
        setCss('');
        setJs('');
        setActiveTab('html');
    };

    const clearAll = () => {
        clearHtml();
        clearCss();
        clearJs();
    };

    if (!tool) return null;

    return (
        <ToolLayout
            title={tool.title}
            description={tool.description}
            toolKey="html-editor"
        >
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('html')}
                        className={`px-4 sm:px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'html'
                            ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                        aria-label="HTML tab"
                        aria-selected={activeTab === 'html'}
                    >
                        HTML
                    </button>
                    <button
                        onClick={() => setActiveTab('css')}
                        className={`px-4 sm:px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'css'
                            ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                        aria-label="CSS tab"
                        aria-selected={activeTab === 'css'}
                    >
                        CSS
                    </button>
                    <button
                        onClick={() => setActiveTab('js')}
                        className={`px-4 sm:px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'js'
                            ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                        aria-label="JavaScript tab"
                        aria-selected={activeTab === 'js'}
                    >
                        JavaScript
                    </button>
                </div>

                {/* Actions Bar */}
                <div className="flex flex-wrap gap-2 p-3 sm:p-4 bg-gray-50 border-b border-gray-200">
                    <Button
                        onClick={insertExample}
                        variant="secondary"
                        size="sm"
                        aria-label="Insert example code"
                    >
                        Insert Example
                    </Button>
                    <Button
                        onClick={clearAll}
                        variant="ghost"
                        size="sm"
                        aria-label="Clear all code"
                    >
                        Clear All
                    </Button>
                </div>

                {/* Editor */}
                <div className="p-3 sm:p-4">
                    {activeTab === 'html' && (
                        <Textarea
                            value={html}
                            onChange={(e) => setHtml(e.target.value)}
                            className="h-64 sm:h-80"
                            placeholder="Enter HTML..."
                            aria-label="HTML code editor"
                        />
                    )}
                    {activeTab === 'css' && (
                        <Textarea
                            value={css}
                            onChange={(e) => setCss(e.target.value)}
                            className="h-64 sm:h-80"
                            placeholder="Enter CSS..."
                            aria-label="CSS code editor"
                        />
                    )}
                    {activeTab === 'js' && (
                        <Textarea
                            value={js}
                            onChange={(e) => setJs(e.target.value)}
                            className="h-64 sm:h-80"
                            placeholder="Enter JavaScript..."
                            aria-label="JavaScript code editor"
                        />
                    )}
                </div>
            </div>

            {/* Preview */}
            <div className="mt-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Live Preview</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                    <LazyIframe
                        srcDoc={srcDoc}
                        title="Live preview of HTML, CSS, and JavaScript code"
                        sandbox="allow-scripts"
                        className="w-full h-64 sm:h-96"
                    />
                </div>
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Switch between HTML, CSS, and JavaScript tabs</li>
                    <li>• Edit your code in the editor</li>
                    <li>• See changes instantly in the live preview below</li>
                    <li>• Your work is automatically saved in your browser</li>
                    <li>• Click "Insert Example" to load a sample template</li>
                </ul>
            </div>
        </ToolLayout>
    );
}
