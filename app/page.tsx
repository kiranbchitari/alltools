'use client';

import type { Metadata } from 'next';
import { useState } from 'react';
import ToolCard from './components/ToolCard';
import Footer from './components/Footer';
import Header from './components/Header';
import SearchBar, { useToolSearch } from './components/SearchBar';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredTools = useToolSearch(searchQuery);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Available Tools</h2>
          <p className="text-sm sm:text-base text-gray-600">
            All tools run entirely in your browser. No data is sent to any server.
          </p>
        </div>

        <SearchBar onSearch={setSearchQuery} />

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTools.map((tool) => (
              <div key={tool.key}>
                <ToolCard
                  title={tool.title}
                  description={tool.description}
                  path={tool.path}
                />
                {tool.keywords && tool.keywords.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {tool.keywords.slice(0, 3).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No tools found matching "{searchQuery}"</p>
            <p className="text-gray-400 text-sm mt-2">Try a different search term</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
