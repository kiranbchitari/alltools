'use client';

import { useState } from 'react';

interface CopyButtonProps {
    text: string;
    label?: string;
    className?: string;
}

export default function CopyButton({ text, label = 'Copy', className = '' }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            disabled={!text}
            className={`text-sm font-medium transition-colors ${copied
                    ? 'text-green-600'
                    : 'text-blue-600 hover:text-blue-700'
                } disabled:text-gray-400 disabled:cursor-not-allowed ${className}`}
        >
            {copied ? '✓ Copied!' : label}
        </button>
    );
}
