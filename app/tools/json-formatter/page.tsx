'use client';

import { useState } from 'react';
import ToolLayout from '@/app/components/ToolLayout';
import Button from '@/app/components/Button';
import Textarea from '@/app/components/Textarea';
import CopyButton from '@/app/components/CopyButton';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getTool } from '@/lib/tools';

export default function JsonFormatterPage() {
    const tool = getTool('json-formatter');
    const [input, setInput, clearInput] = useLocalStorage('json-formatter-input', '');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const formatJson = (indent: number = 2) => {
        try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed, null, indent));
            setError('');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Invalid JSON');
            setOutput('');
        }
    };

    const minifyJson = () => {
        try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed));
            setError('');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Invalid JSON');
            setOutput('');
        }
    };

    const validateJson = () => {
        try {
            JSON.parse(input);
            setError('');
            setOutput('✓ Valid JSON');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Invalid JSON');
            setOutput('');
        }
    };

    const insertExample = () => {
        if (tool?.example) {
            setInput(tool.example);
        }
    };

    if (!tool) return null;

    return (
        <ToolLayout
            title={tool.title}
            description={tool.description}
            toolKey="json-formatter"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Input */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Input JSON</h2>
                        <div className="flex gap-2">
                            <Button
                                onClick={insertExample}
                                variant="secondary"
                                size="sm"
                                aria-label="Insert example JSON"
                            >
                                Insert Example
                            </Button>
                            <Button
                                onClick={() => clearInput()}
                                variant="ghost"
                                size="sm"
                                aria-label="Clear input"
                            >
                                Clear
                            </Button>
                        </div>
                    </div>
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="h-64 sm:h-96"
                        placeholder='{"name": "John", "age": 30}'
                        aria-label="JSON input"
                    />
                </div>

                {/* Output */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Output</h2>
                        {output && <CopyButton text={output} />}
                    </div>
                    <Textarea
                        value={output}
                        readOnly
                        className="h-64 sm:h-96 bg-gray-50"
                        placeholder="Formatted JSON will appear here..."
                        aria-label="JSON output"
                    />
                    {error && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
                            <p className="text-sm text-red-700">
                                <strong>Error:</strong> {error}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
                <Button
                    onClick={() => formatJson(2)}
                    variant="primary"
                    size="md"
                    className="flex-1 sm:flex-none"
                    aria-label="Format JSON with 2 spaces"
                >
                    Format (2 spaces)
                </Button>
                <Button
                    onClick={() => formatJson(4)}
                    variant="primary"
                    size="md"
                    className="flex-1 sm:flex-none"
                    aria-label="Format JSON with 4 spaces"
                >
                    Format (4 spaces)
                </Button>
                <Button
                    onClick={minifyJson}
                    variant="secondary"
                    size="md"
                    className="flex-1 sm:flex-none"
                    aria-label="Minify JSON"
                >
                    Minify
                </Button>
                <Button
                    onClick={validateJson}
                    variant="success"
                    size="md"
                    className="flex-1 sm:flex-none"
                    aria-label="Validate JSON"
                >
                    Validate
                </Button>
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Features:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Format:</strong> Pretty print JSON with 2 or 4 space indentation</li>
                    <li>• <strong>Minify:</strong> Remove all whitespace to compress JSON</li>
                    <li>• <strong>Validate:</strong> Check if your JSON is valid</li>
                    <li>• <strong>Auto-save:</strong> Your input is automatically saved in your browser</li>
                    <li>• All processing happens locally in your browser</li>
                </ul>
            </div>
        </ToolLayout>
    );
}
