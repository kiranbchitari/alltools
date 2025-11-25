'use client';

import { useState } from 'react';
import ToolLayout from '@/app/components/ToolLayout';
import Button from '@/app/components/Button';
import Textarea from '@/app/components/Textarea';
import CopyButton from '@/app/components/CopyButton';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getTool } from '@/lib/tools';

export default function CsvJsonConverterPage() {
    const tool = getTool('csv-json-converter');
    const [input, setInput, clearInput] = useLocalStorage('csv-json-converter-input', '');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const csvToJson = () => {
        try {
            const lines = input.split('\n').filter(l => l.trim());
            if (lines.length === 0) {
                setError('Input is empty');
                return;
            }

            const headers = lines[0].split(',').map(h => h.trim());
            const result = lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim());
                return headers.reduce((obj, header, i) => {
                    obj[header] = values[i] || '';
                    return obj;
                }, {} as Record<string, string>);
            });

            setOutput(JSON.stringify(result, null, 2));
            setError('');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error converting CSV to JSON');
            setOutput('');
        }
    };

    const jsonToCsv = () => {
        try {
            const data = JSON.parse(input);
            if (!Array.isArray(data)) {
                setError('Input must be a JSON array');
                setOutput('');
                return;
            }
            if (data.length === 0) {
                setError('Array is empty');
                setOutput('');
                return;
            }

            const headers = Object.keys(data[0]);
            const csv = [
                headers.join(','),
                ...data.map(row => headers.map(h => {
                    const value = row[h] || '';
                    // Escape commas and quotes
                    return typeof value === 'string' && (value.includes(',') || value.includes('"'))
                        ? `"${value.replace(/"/g, '""')}"`
                        : value;
                }).join(','))
            ].join('\n');

            setOutput(csv);
            setError('');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error converting JSON to CSV');
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
        <ToolLayout title={tool.title} description={tool.description} toolKey="csv-json-converter">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Input</h2>
                        <div className="flex gap-2">
                            <Button onClick={insertExample} variant="secondary" size="sm">Insert Example</Button>
                            <Button onClick={() => clearInput()} variant="ghost" size="sm">Clear</Button>
                        </div>
                    </div>
                    <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="h-64 sm:h-96" placeholder="Paste CSV or JSON here..." />
                </div>

                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Output</h2>
                        {output && <CopyButton text={output} />}
                    </div>
                    <Textarea value={output} readOnly className="h-64 sm:h-96 bg-gray-50" placeholder="Converted output will appear here..." />
                    {error && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
                            <p className="text-sm text-red-700"><strong>Error:</strong> {error}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
                <Button onClick={csvToJson} variant="primary" size="md" className="flex-1 sm:flex-none">CSV → JSON</Button>
                <Button onClick={jsonToCsv} variant="secondary" size="md" className="flex-1 sm:flex-none">JSON → CSV</Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Features:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>CSV to JSON:</strong> Convert CSV data to JSON array format</li>
                    <li>• <strong>JSON to CSV:</strong> Convert JSON arrays to CSV format</li>
                    <li>• Handles commas and quotes in values</li>
                    <li>• Perfect for data transformation and API integrations</li>
                </ul>
            </div>
        </ToolLayout>
    );
}
