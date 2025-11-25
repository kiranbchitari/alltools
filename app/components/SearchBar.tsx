'use client';

import { useState, useMemo } from 'react';
import { getEnabledTools } from '@/lib/tools';

interface SearchBarProps {
    onSearch?: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState('');

    const handleSearch = (value: string) => {
        setQuery(value);
        onSearch?.(value);
    };

    return (
        <div className="mb-8">
            <div className="relative max-w-2xl">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search tools by name or keyword..."
                    className="w-full px-4 py-3 pl-12 text-base border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            shadow-sm"
                    aria-label="Search tools"
                />
                <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                {query && (
                    <button
                        onClick={() => handleSearch('')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label="Clear search"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}

export function useToolSearch(query: string) {
    const tools = getEnabledTools();

    return useMemo(() => {
        if (!query.trim()) return tools;

        const lowerQuery = query.toLowerCase();
        return tools.filter(tool => {
            const titleMatch = tool.title.toLowerCase().includes(lowerQuery);
            const descMatch = tool.description.toLowerCase().includes(lowerQuery);
            const keywordMatch = tool.keywords?.some(k => k.toLowerCase().includes(lowerQuery));

            return titleMatch || descMatch || keywordMatch;
        });
    }, [tools, query]);
}
