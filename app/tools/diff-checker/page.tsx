'use client';

import { useMemo } from 'react';
import ToolLayout from '@/app/components/ToolLayout';
import Button from '@/app/components/Button';
import Textarea from '@/app/components/Textarea';
import CopyButton from '@/app/components/CopyButton';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getTool } from '@/lib/tools';

export default function DiffCheckerPage() {
    const tool = getTool('diff-checker');
    const [text1, setText1, clearText1] = useLocalStorage('diff-checker-text1', '');
    const [text2, setText2, clearText2] = useLocalStorage('diff-checker-text2', '');

    const differences = useMemo(() => {
        const lines1 = text1.split('\n');
        const lines2 = text2.split('\n');
        const maxLines = Math.max(lines1.length, lines2.length);

        const diffs = [];
        for (let i = 0; i < maxLines; i++) {
            const line1 = lines1[i] || '';
            const line2 = lines2[i] || '';

            if (line1 !== line2) {
                diffs.push({
                    lineNumber: i + 1,
                    left: line1,
                    right: line2,
                    type: !line1 ? 'added' : !line2 ? 'removed' : 'modified'
                });
            }
        }
        return diffs;
    }, [text1, text2]);

    const diffOutput = useMemo(() => {
        if (differences.length === 0) return '';
        return differences.map(diff =>
            `Line ${diff.lineNumber} (${diff.type}):\n  Original: ${diff.left || '(empty)'}\n  Modified: ${diff.right || '(empty)'}`
        ).join('\n\n');
    }, [differences]);

    if (!tool) return null;

    return (
        <ToolLayout
            title={tool.title}
            description={tool.description}
            toolKey="diff-checker"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Text 1 */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Original Text</h2>
                        <Button
                            onClick={() => clearText1()}
                            variant="ghost"
                            size="sm"
                            aria-label="Clear original text"
                        >
                            Clear
                        </Button>
                    </div>
                    <Textarea
                        value={text1}
                        onChange={(e) => setText1(e.target.value)}
                        className="h-64 sm:h-96"
                        placeholder="Paste your first text here..."
                        aria-label="Original text input"
                    />
                </div>

                {/* Text 2 */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Modified Text</h2>
                        <Button
                            onClick={() => clearText2()}
                            variant="ghost"
                            size="sm"
                            aria-label="Clear modified text"
                        >
                            Clear
                        </Button>
                    </div>
                    <Textarea
                        value={text2}
                        onChange={(e) => setText2(e.target.value)}
                        className="h-64 sm:h-96"
                        placeholder="Paste your second text here..."
                        aria-label="Modified text input"
                    />
                </div>
            </div>

            {/* Differences */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-3 sm:p-4">
                <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                        Differences Found: {differences.length}
                    </h2>
                    {differences.length > 0 && <CopyButton text={diffOutput} label="Copy Diff" />}
                </div>

                {differences.length === 0 && text1 && text2 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg" role="status">
                        <p className="text-green-700">✓ No differences found. Texts are identical!</p>
                    </div>
                )}

                {differences.length === 0 && (!text1 || !text2) && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-gray-600">Enter text in both fields to compare</p>
                    </div>
                )}

                {differences.length > 0 && (
                    <div className="space-y-3">
                        {differences.map((diff, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-lg overflow-hidden"
                            >
                                <div className="bg-gray-50 px-3 sm:px-4 py-2 border-b border-gray-200">
                                    <span className="text-sm font-medium text-gray-700">
                                        Line {diff.lineNumber}
                                    </span>
                                    <span className={`ml-3 text-xs px-2 py-1 rounded ${diff.type === 'added' ? 'bg-green-100 text-green-700' :
                                            diff.type === 'removed' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {diff.type}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2">
                                    <div className={`p-3 font-mono text-xs sm:text-sm break-words ${diff.type === 'removed' ? 'bg-red-50' : 'bg-gray-50'
                                        }`}>
                                        <div className="text-xs text-gray-500 mb-1">Original:</div>
                                        {diff.left || <span className="text-gray-400 italic">(empty)</span>}
                                    </div>
                                    <div className={`p-3 font-mono text-xs sm:text-sm break-words border-t lg:border-t-0 lg:border-l border-gray-200 ${diff.type === 'added' ? 'bg-green-50' : 'bg-gray-50'
                                        }`}>
                                        <div className="text-xs text-gray-500 mb-1">Modified:</div>
                                        {diff.right || <span className="text-gray-400 italic">(empty)</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Paste your original text in the left field</li>
                    <li>• Paste your modified text in the right field</li>
                    <li>• Differences are highlighted automatically line by line</li>
                    <li>• Green = added, Red = removed, Yellow = modified</li>
                    <li>• Your texts are automatically saved in your browser</li>
                </ul>
            </div>
        </ToolLayout>
    );
}
