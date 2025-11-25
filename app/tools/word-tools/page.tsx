'use client';

import { useMemo } from 'react';
import ToolLayout from '@/app/components/ToolLayout';
import Button from '@/app/components/Button';
import Textarea from '@/app/components/Textarea';
import CopyButton from '@/app/components/CopyButton';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getTool } from '@/lib/tools';

export default function WordToolsPage() {
    const tool = getTool('word-tools');
    const [text, setText, clearText] = useLocalStorage('word-tools-text', '');

    const stats = useMemo(() => {
        const trimmed = text.trim();
        const words = trimmed ? trimmed.split(/\s+/).filter(w => w.length > 0) : [];
        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, '').length;
        const lines = text.split('\n').length;

        return {
            words: words.length,
            characters,
            charactersNoSpaces,
            lines
        };
    }, [text]);

    const toUpperCase = () => {
        setText(text.toUpperCase());
    };

    const toLowerCase = () => {
        setText(text.toLowerCase());
    };

    const toTitleCase = () => {
        setText(
            text.replace(/\w\S*/g, (txt) =>
                txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            )
        );
    };

    const removeExtraSpaces = () => {
        setText(text.replace(/\s+/g, ' ').trim());
    };

    const insertExample = () => {
        if (tool?.example) {
            setText(tool.example);
        }
    };

    if (!tool) return null;

    return (
        <ToolLayout
            title={tool.title}
            description={tool.description}
            toolKey="word-tools"
        >
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 border-l-4 border-blue-500">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.words}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Words</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 border-l-4 border-green-500">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.characters}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Characters</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 border-l-4 border-purple-500">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.charactersNoSpaces}</div>
                    <div className="text-xs sm:text-sm text-gray-600">No Spaces</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 border-l-4 border-orange-500">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.lines}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Lines</div>
                </div>
            </div>

            {/* Text Area */}
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">Your Text</h2>
                    <div className="flex gap-2">
                        {text && <CopyButton text={text} />}
                        <Button
                            onClick={insertExample}
                            variant="secondary"
                            size="sm"
                            aria-label="Insert example text"
                        >
                            Insert Example
                        </Button>
                        <Button
                            onClick={() => clearText()}
                            variant="ghost"
                            size="sm"
                            aria-label="Clear text"
                        >
                            Clear
                        </Button>
                    </div>
                </div>
                <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="h-64 sm:h-80"
                    placeholder="Type or paste your text here..."
                    aria-label="Text input for word tools"
                />
            </div>

            {/* Actions */}
            <div className="mt-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Text Transformations</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                    <Button
                        onClick={toUpperCase}
                        variant="primary"
                        size="md"
                        fullWidth
                        aria-label="Convert to uppercase"
                    >
                        UPPERCASE
                    </Button>
                    <Button
                        onClick={toLowerCase}
                        variant="primary"
                        size="md"
                        fullWidth
                        aria-label="Convert to lowercase"
                    >
                        lowercase
                    </Button>
                    <Button
                        onClick={toTitleCase}
                        variant="secondary"
                        size="md"
                        fullWidth
                        aria-label="Convert to title case"
                    >
                        Title Case
                    </Button>
                    <Button
                        onClick={removeExtraSpaces}
                        variant="success"
                        size="md"
                        fullWidth
                        aria-label="Remove extra spaces"
                    >
                        Remove Spaces
                    </Button>
                </div>
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Features:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Real-time stats:</strong> Word count, character count, and line count update as you type</li>
                    <li>• <strong>Case conversion:</strong> Convert to uppercase, lowercase, or title case</li>
                    <li>• <strong>Clean up:</strong> Remove extra spaces between words</li>
                    <li>• <strong>Copy:</strong> Easily copy transformed text to clipboard</li>
                    <li>• <strong>Auto-save:</strong> Your text is automatically saved in your browser</li>
                </ul>
            </div>
        </ToolLayout>
    );
}
