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

type TransformAction = 'proofread' | 'rewrite' | 'professional' | 'funny' | 'concise';

export default function AITextEnhancer() {
    const [apiKey, setApiKey] = useState('');
    const [apiKeyInput, setApiKeyInput] = useState('');
    const [apiKeySaved, setApiKeySaved] = useState(false);
    const [showApiKeyInput, setShowApiKeyInput] = useState(false);

    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [selectedModel, setSelectedModel] = useState(GROQ_MODELS[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

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

    const getPrompt = (action: TransformAction, text: string): string => {
        const prompts = {
            proofread: `Proofread the following text and return ONLY the corrected version without any explanations or descriptions:\n\n${text}`,
            rewrite: `Rewrite the following text in different wording and return ONLY the rewritten version without any explanations:\n\n${text}`,
            professional: `Rewrite the following text in a professional and formal tone. Return ONLY the rewritten text without any explanations:\n\n${text}`,
            funny: `Rewrite the following text in a humorous way. Return ONLY the rewritten text without any explanations:\n\n${text}`,
            concise: `Make the following text concise while preserving key meaning. Return ONLY the concise version without any explanations:\n\n${text}`,
        };
        return prompts[action];
    };

    const handleTransform = async (action: TransformAction) => {
        if (!inputText.trim()) {
            setStatusMessage('Please enter some text to transform');
            return;
        }

        if (!apiKey) {
            setStatusMessage('Please save your API key first');
            return;
        }

        setIsLoading(true);
        setStatusMessage('Processing...');
        setOutputText('');

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
                            content: getPrompt(action, inputText),
                        },
                    ],
                    temperature: 0.7,
                    max_tokens: 2048,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `API error: ${response.status}`);
            }

            const data = await response.json();
            const result = data.choices?.[0]?.message?.content || 'No response generated';

            setOutputText(result);
            setStatusMessage('✓ Transformation complete!');
            setTimeout(() => setStatusMessage(''), 3000);
        } catch (error: any) {
            console.error('API Error:', error);
            setStatusMessage(`Error: ${error.message || 'Failed to process text'}`);
            setOutputText('');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ToolLayout
            title="AI Text Enhancer"
            description="Improve and rewrite text using Groq AI models"
            toolKey="ai-text-enhancer"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <Button onClick={handleSaveApiKey}>
                                Save API Key
                            </Button>
                        </div>
                    )}
                </div>

                {/* Text Processing Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Text Processing</h2>

                    {/* Model Selection */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            AI Model
                        </label>
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={!apiKey}
                        >
                            {GROQ_MODELS.map((model) => (
                                <option key={model} value={model}>
                                    {model}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Input Text */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Input Text
                        </label>
                        <Textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Enter text to enhance..."
                            rows={8}
                            disabled={!apiKey}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="mb-4 flex flex-wrap gap-2">
                        <Button
                            onClick={() => handleTransform('proofread')}
                            disabled={!apiKey || !inputText.trim() || isLoading}
                            variant="secondary"
                        >
                            📝 Proofread
                        </Button>
                        <Button
                            onClick={() => handleTransform('rewrite')}
                            disabled={!apiKey || !inputText.trim() || isLoading}
                            variant="secondary"
                        >
                            ✍️ Rewrite
                        </Button>
                        <Button
                            onClick={() => handleTransform('professional')}
                            disabled={!apiKey || !inputText.trim() || isLoading}
                            variant="secondary"
                        >
                            💼 Professional
                        </Button>
                        <Button
                            onClick={() => handleTransform('funny')}
                            disabled={!apiKey || !inputText.trim() || isLoading}
                            variant="secondary"
                        >
                            😄 Funny
                        </Button>
                        <Button
                            onClick={() => handleTransform('concise')}
                            disabled={!apiKey || !inputText.trim() || isLoading}
                            variant="secondary"
                        >
                            ⚡ Concise
                        </Button>
                    </div>

                    {/* Status Message */}
                    {statusMessage && (
                        <div className={`mb-4 p-3 rounded-lg text-sm ${statusMessage.includes('Error') || statusMessage.includes('Failed')
                            ? 'bg-red-50 text-red-700'
                            : statusMessage.includes('✓')
                                ? 'bg-green-50 text-green-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}>
                            {statusMessage}
                        </div>
                    )}

                    {/* Output Text */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Output
                            </label>
                            {outputText && (
                                <CopyButton text={outputText} />
                            )}
                        </div>
                        <Textarea
                            value={outputText}
                            readOnly
                            placeholder={isLoading ? 'Processing...' : 'Enhanced text will appear here...'}
                            rows={8}
                            className={isLoading ? 'animate-pulse' : ''}
                        />
                    </div>
                </div>

                {/* Info Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                    <p className="font-medium mb-2">ℹ️ How to use:</p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Save your Groq API key (stored securely in your browser)</li>
                        <li>Enter or paste text you want to enhance</li>
                        <li>Select an AI model</li>
                        <li>Click a transformation button</li>
                        <li>Copy the enhanced output</li>
                    </ol>
                </div>
            </div>
        </ToolLayout>
    );
}
