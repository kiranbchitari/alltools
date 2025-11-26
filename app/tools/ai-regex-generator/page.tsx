'use client';

import { useState, useEffect } from 'react';
import ToolLayout from '@/app/components/ToolLayout';
import Button from '@/app/components/Button';
import Textarea from '@/app/components/Textarea';
import CopyButton from '@/app/components/CopyButton';
import { saveApiKey, loadApiKey, clearApiKey } from '@/lib/storage';

const GROQ_MODELS = [
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'llama-3.1-8b-instant',
    'llama-3.3-70b-versatile',
];

type RegexOption = 'strict' | 'loose' | 'global' | 'single' | 'case-insensitive' | 'case-sensitive';

interface RegexOutput {
    regex: string;
    explanation: string;
    example: string;
}

export default function AIRegexGenerator() {
    const [apiKey, setApiKey] = useState('');
    const [apiKeyInput, setApiKeyInput] = useState('');
    const [apiKeySaved, setApiKeySaved] = useState(false);
    const [showApiKeyInput, setShowApiKeyInput] = useState(false);

    const [description, setDescription] = useState('');
    const [selectedModel, setSelectedModel] = useState(GROQ_MODELS[0]);
    const [regexOption, setRegexOption] = useState<RegexOption>('strict');
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const [output, setOutput] = useState<RegexOutput | null>(null);
    const [testText, setTestText] = useState('');
    const [matches, setMatches] = useState<RegExpMatchArray[]>([]);

    // Load API key on mount
    useEffect(() => {
        const loadSavedApiKey = async () => {
            const savedKey = await loadApiKey();
            if (savedKey) {
                setApiKey(savedKey);
                setApiKeySaved(true);
            } else {
                setShowApiKeyInput(true);
            }
        };
        loadSavedApiKey();
    }, []);

    // Test regex when output or test text changes
    useEffect(() => {
        if (!output?.regex || !testText) {
            setMatches([]);
            return;
        }

        try {
            const regex = new RegExp(output.regex, 'g');
            const foundMatches = [...testText.matchAll(regex)];
            setMatches(foundMatches);
        } catch (error) {
            setMatches([]);
        }
    }, [output?.regex, testText]);

    const handleSaveApiKey = async () => {
        if (!apiKeyInput.trim()) {
            setStatusMessage('Please enter an API key');
            return;
        }

        try {
            await saveApiKey(apiKeyInput);
            setApiKey(apiKeyInput);
            setApiKeySaved(true);
            setShowApiKeyInput(false);
            setStatusMessage('API key saved successfully!');
            setTimeout(() => setStatusMessage(''), 3000);
        } catch (error) {
            setStatusMessage('Failed to save API key');
            console.error(error);
        }
    };

    const handleChangeApiKey = () => {
        setShowApiKeyInput(true);
        setApiKeyInput('');
        setApiKeySaved(false);
    };

    const handleClearApiKey = async () => {
        await clearApiKey();
        setApiKey('');
        setApiKeyInput('');
        setApiKeySaved(false);
        setShowApiKeyInput(true);
        setStatusMessage('API key cleared');
        setTimeout(() => setStatusMessage(''), 3000);
    };

    const getPrompt = (desc: string, option: RegexOption): string => {
        const optionInstructions = {
            'strict': 'Create a strict regex that matches only exact patterns.',
            'loose': 'Create a loose regex that is more permissive.',
            'global': 'Include the global flag (g) to match all occurrences.',
            'single': 'Match only the first occurrence (no global flag).',
            'case-insensitive': 'Include the case-insensitive flag (i).',
            'case-sensitive': 'Make the regex case-sensitive (no i flag).',
        };

        return `Generate a Regular Expression based on the following description:

${desc}

${optionInstructions[option]}

Return ONLY a valid JSON object in this exact format (no markdown, no code blocks):
{
  "regex": "the regex pattern without delimiters",
  "explanation": "clear explanation of what the regex does",
  "example": "JavaScript code example showing how to use it"
}`;
    };

    const handleGenerate = async () => {
        if (!description.trim()) {
            setStatusMessage('Please enter a description');
            return;
        }

        if (!apiKey) {
            setStatusMessage('Please save your API key first');
            return;
        }

        setIsLoading(true);
        setStatusMessage('Generating regex...');
        setOutput(null);

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: selectedModel,
                    messages: [
                        {
                            role: 'user',
                            content: getPrompt(description, regexOption),
                        },
                    ],
                    temperature: 0.3,
                    max_tokens: 1024,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `API error: ${response.status}`);
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || '';

            // Parse JSON response
            const parsed = JSON.parse(content);

            if (!parsed.regex || !parsed.explanation || !parsed.example) {
                throw new Error('Invalid response format');
            }

            setOutput(parsed);
            setStatusMessage('✓ Regex generated successfully!');
            setTimeout(() => setStatusMessage(''), 3000);
        } catch (error: any) {
            console.error('API Error:', error);
            setStatusMessage(`Error: ${error.message || 'Failed to generate regex'}`);
            setOutput(null);
        } finally {
            setIsLoading(false);
        }
    };

    const highlightMatches = (text: string): React.ReactNode[] => {
        if (!matches.length) {
            return [<span key="0">{text}</span>];
        }

        const parts: React.ReactNode[] = [];
        let lastIndex = 0;

        matches.forEach((match, i) => {
            const matchIndex = match.index ?? 0;

            // Add text before match
            if (matchIndex > lastIndex) {
                parts.push(
                    <span key={`text-${i}`}>
                        {text.substring(lastIndex, matchIndex)}
                    </span>
                );
            }

            // Add highlighted match
            parts.push(
                <span key={`match-${i}`} className="bg-yellow-200 font-semibold">
                    {match[0]}
                </span>
            );

            lastIndex = matchIndex + match[0].length;
        });

        // Add remaining text
        if (lastIndex < text.length) {
            parts.push(
                <span key="text-end">
                    {text.substring(lastIndex)}
                </span>
            );
        }

        return parts;
    };

    return (
        <ToolLayout
            title="AI Regex Generator"
            description="Generate accurate regular expressions from text descriptions using AI"
            toolKey="ai-regex-generator"
        >
            <div className="space-y-6">
                {/* API Key Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        API Key Configuration
                    </h2>

                    {apiKeySaved && !showApiKeyInput ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-green-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="font-medium">API Key Saved</span>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleChangeApiKey} variant="secondary">
                                    Change API Key
                                </Button>
                                <Button onClick={handleClearApiKey} variant="secondary">
                                    Clear API Key
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="text-sm text-gray-600 mb-2">
                                Enter your Groq API key. Get one at{' '}
                                <a
                                    href="https://console.groq.com/keys"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    console.groq.com
                                </a>
                            </div>
                            <input
                                type="password"
                                value={apiKeyInput}
                                onChange={(e) => setApiKeyInput(e.target.value)}
                                placeholder="gsk_..."
                                className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <Button onClick={handleSaveApiKey}>
                                Save API Key
                            </Button>
                        </div>
                    )}
                </div>

                {/* Regex Generation Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate Regex</h2>

                    {/* Model Selection */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            AI Model
                        </label>
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={!apiKey}
                        >
                            {GROQ_MODELS.map((model) => (
                                <option key={model} value={model}>
                                    {model}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Regex Options */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Regex Type
                        </label>
                        <select
                            value={regexOption}
                            onChange={(e) => setRegexOption(e.target.value as RegexOption)}
                            className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={!apiKey}
                        >
                            <option value="strict">Strict Match</option>
                            <option value="loose">Loose Match</option>
                            <option value="global">Global Match (all occurrences)</option>
                            <option value="single">Single Match (first only)</option>
                            <option value="case-insensitive">Case Insensitive</option>
                            <option value="case-sensitive">Case Sensitive</option>
                        </select>
                    </div>

                    {/* Description Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Describe what you want to match
                        </label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Example: extract all email addresses from text"
                            rows={4}
                            disabled={!apiKey}
                        />
                    </div>

                    {/* Generate Button */}
                    <Button
                        onClick={handleGenerate}
                        disabled={!apiKey || !description.trim() || isLoading}
                        className="w-full"
                    >
                        {isLoading ? 'Generating...' : '🤖 Generate Regex'}
                    </Button>

                    {/* Status Message */}
                    {statusMessage && (
                        <div className={`mt-4 p-3 rounded-lg text-sm ${statusMessage.includes('Error') || statusMessage.includes('Failed')
                            ? 'bg-red-50 text-red-700'
                            : statusMessage.includes('✓')
                                ? 'bg-green-50 text-green-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}>
                            {statusMessage}
                        </div>
                    )}
                </div>

                {/* Output Section */}
                {output && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Generated Regex</h2>

                        {/* Regex Pattern */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Pattern
                                </label>
                                <CopyButton text={output.regex} />
                            </div>
                            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 font-mono text-sm break-all">
                                {output.regex}
                            </div>
                        </div>

                        {/* Explanation */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Explanation
                                </label>
                                <CopyButton text={output.explanation} />
                            </div>
                            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-sm">
                                {output.explanation}
                            </div>
                        </div>

                        {/* Example Usage */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Example Usage
                                </label>
                                <CopyButton text={output.example} />
                            </div>
                            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto">
                                <code>{output.example}</code>
                            </pre>
                        </div>
                    </div>
                )}

                {/* Test Regex Section */}
                {output && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Regex</h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enter text to test
                            </label>
                            <Textarea
                                value={testText}
                                onChange={(e) => setTestText(e.target.value)}
                                placeholder="Enter text to test the regex pattern..."
                                rows={6}
                            />
                        </div>

                        {testText && (
                            <>
                                <div className="mb-2 text-sm font-medium text-gray-700">
                                    {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
                                </div>
                                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-sm whitespace-pre-wrap break-words">
                                    {highlightMatches(testText)}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Info Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                    <p className="font-medium mb-2">ℹ️ How to use:</p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Save your Groq API key (stored securely in your browser)</li>
                        <li>Describe what pattern you want to match</li>
                        <li>Select regex type and AI model</li>
                        <li>Click "Generate Regex"</li>
                        <li>Test the regex with sample text</li>
                        <li>Copy the regex pattern for use in your code</li>
                    </ol>
                </div>
            </div>
        </ToolLayout>
    );
}
