'use client';

import { useState, useEffect } from 'react';
import ToolLayout from '@/app/components/ToolLayout';
import Button from '@/app/components/Button';

interface Device {
    name: string;
    width: number;
    height: number;
    icon: string;
}

const DEVICES: Device[] = [
    { name: 'Mobile', width: 375, height: 812, icon: '📱' },
    { name: 'Tablet', width: 768, height: 1024, icon: '📱' },
    { name: 'Laptop', width: 1366, height: 768, icon: '💻' },
    { name: 'Desktop 1080p', width: 1920, height: 1080, icon: '🖥️' },
    { name: '4K', width: 3840, height: 2160, icon: '🖥️' },
];

export default function ResponsiveChecker() {
    const [url, setUrl] = useState('');
    const [currentUrl, setCurrentUrl] = useState('');
    const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(0);
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
    const [darkBackground, setDarkBackground] = useState(false);
    const [scale, setScale] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Load last URL from localStorage
    useEffect(() => {
        const savedUrl = localStorage.getItem('responsive-checker-url');
        if (savedUrl) {
            setUrl(savedUrl);
        }
    }, []);

    const normalizeUrl = (inputUrl: string): string => {
        let normalized = inputUrl.trim();
        if (!normalized) return '';

        if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
            normalized = 'https://' + normalized;
        }
        return normalized;
    };

    const handleLoad = () => {
        const normalized = normalizeUrl(url);
        if (!normalized) return;

        setCurrentUrl(normalized);
        localStorage.setItem('responsive-checker-url', normalized);
        setLoading(true);
        setError('');
    };

    const handleIframeLoad = () => {
        setLoading(false);
        setError('');
    };

    const handleIframeError = () => {
        setLoading(false);
        setError('This site does not allow iframe embedding.');
    };

    const toggleOrientation = () => {
        setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
    };

    const selectedDevice = DEVICES[selectedDeviceIndex];
    const deviceWidth = orientation === 'portrait' ? selectedDevice.width : selectedDevice.height;
    const deviceHeight = orientation === 'portrait' ? selectedDevice.height : selectedDevice.width;

    // Calculate scale to fit the device in the container
    const maxContainerWidth = typeof window !== 'undefined' ? Math.min(window.innerWidth - 100, 1400) : 1400;
    const maxContainerHeight = 800;
    const autoScale = Math.min(
        maxContainerWidth / deviceWidth,
        maxContainerHeight / deviceHeight,
        1
    );

    const finalScale = autoScale * scale;
    const scaledWidth = deviceWidth * finalScale;
    const scaledHeight = deviceHeight * finalScale;

    return (
        <ToolLayout
            title="Responsive Design Checker"
            description="Preview how a website looks on mobile, tablet, laptop, Full HD and 4K displays"
            toolKey="responsive-checker"
        >
            <div className="space-y-6">
                {/* URL Input Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Enter Website URL</h2>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleLoad()}
                            placeholder="https://example.com"
                            className="flex-1 px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Button onClick={handleLoad} disabled={!url.trim()}>
                            Load
                        </Button>
                    </div>
                </div>

                {/* Device Selector */}
                {currentUrl && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Device</h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {DEVICES.map((device, index) => (
                                <button
                                    key={device.name}
                                    onClick={() => setSelectedDeviceIndex(index)}
                                    className={`p-4 rounded-lg border-2 transition-all ${selectedDeviceIndex === index
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">{device.icon}</div>
                                    <div className="text-sm font-semibold text-gray-900">{device.name}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {device.width} × {device.height}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Display Options */}
                {currentUrl && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Display Options</h2>

                        <div className="space-y-4">
                            {/* Orientation Toggle */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Orientation</span>
                                <button
                                    onClick={toggleOrientation}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    {orientation === 'portrait' ? 'Portrait' : 'Landscape'}
                                </button>
                            </div>

                            {/* Dark Background Toggle */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Background</span>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={darkBackground}
                                        onChange={(e) => setDarkBackground(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Dark Background</span>
                                </label>
                            </div>

                            {/* Scale Slider */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Zoom</span>
                                    <span className="text-sm text-gray-500">{Math.round(scale * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.25"
                                    max="1"
                                    step="0.05"
                                    value={scale}
                                    onChange={(e) => setScale(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>25%</span>
                                    <span>50%</span>
                                    <span>75%</span>
                                    <span>100%</span>
                                </div>
                            </div>

                            {/* Current Resolution Display */}
                            <div className="pt-2 border-t border-gray-200">
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Current Resolution:</span> {deviceWidth} × {deviceHeight}px
                                </div>
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Display Size:</span> {Math.round(scaledWidth)} × {Math.round(scaledHeight)}px
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Device Preview */}
                {currentUrl && (
                    <div className={`rounded-lg p-6 flex items-center justify-center ${darkBackground ? 'bg-gray-900' : 'bg-gray-100'}`}>
                        <div className="flex flex-col items-center">
                            {/* Device Frame */}
                            <div
                                className="bg-white rounded-lg shadow-2xl overflow-hidden"
                                style={{
                                    width: scaledWidth,
                                    height: scaledHeight,
                                }}
                            >
                                {loading && (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-gray-500 text-sm">Loading...</div>
                                    </div>
                                )}

                                {error ? (
                                    <div className="flex items-center justify-center h-full p-4">
                                        <div className="text-center">
                                            <svg className="w-12 h-12 text-red-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <p className="text-sm text-red-600">{error}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <iframe
                                        src={currentUrl}
                                        style={{
                                            width: deviceWidth,
                                            height: deviceHeight,
                                            transform: `scale(${finalScale})`,
                                            transformOrigin: 'top left',
                                            border: 'none',
                                        }}
                                        onLoad={handleIframeLoad}
                                        onError={handleIframeError}
                                        title={`${selectedDevice.name} preview`}
                                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                    <p className="font-medium mb-2">ℹ️ How to use:</p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Enter a website URL in the input field</li>
                        <li>Click "Load" to preview the website</li>
                        <li>Select a device to see how it looks on different screen sizes</li>
                        <li>Toggle orientation between portrait and landscape</li>
                        <li>Adjust zoom to see more or less detail</li>
                        <li>Enable dark background for better contrast</li>
                    </ol>
                </div>
            </div>
        </ToolLayout>
    );
}
