'use client';

import { useState } from 'react';
import ToolLayout from '@/app/components/ToolLayout';
import Button from '@/app/components/Button';
import Textarea from '@/app/components/Textarea';
import CopyButton from '@/app/components/CopyButton';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getTool } from '@/lib/tools';

export default function Base64EncoderPage() {
    const tool = getTool('base64-encoder');
    const [input, setInput, clearInput] = useLocalStorage('base64-encoder-input', '');
    const [output, setOutput] = useState('');

    const encode = () => {
        try {
            setOutput(btoa(input));
        } catch (e) {
            setOutput('Error: Invalid input for Base64 encoding');
        }
    };

    const decode = () => {
        try {
            setOutput(atob(input));
        } catch (e) {
            setOutput('Error: Invalid Base64 string');
        }
    };

    const insertExample = () => {
        if (tool?.example) {
            setInput(tool.example);
        }
    };

    if (!tool) return null;

    return (
        <ToolLayout title={tool.title} description={tool.description} toolKey="base64-encoder">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Input</h2>
                        <div className="flex gap-2">
                            <Button onClick={insertExample} variant="secondary" size="sm">Insert Example</Button>
                            <Button onClick={() => clearInput()} variant="ghost" size="sm">Clear</Button>
                        </div>
                    </div>
                    <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="h-64 sm:h-96" placeholder="Enter text or Base64..." />
                </div>

                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Output</h2>
                        {output && <CopyButton text={output} />}
                    </div>
                    <Textarea value={output} readOnly className="h-64 sm:h-96 bg-gray-50" placeholder="Encoded/decoded output will appear here..." />
                </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
                <Button onClick={encode} variant="primary" size="md" className="flex-1 sm:flex-none">Encode to Base64</Button>
                <Button onClick={decode} variant="secondary" size="md" className="flex-1 sm:flex-none">Decode from Base64</Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Features:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Encode:</strong> Convert text to Base64 format</li>
                    <li>• <strong>Decode:</strong> Convert Base64 back to readable text</li>
                    <li>• Perfect for API integrations and data encoding</li>
                    <li>• Your input is automatically saved</li>
                </ul>
            </div>
        </ToolLayout>
    );
}
