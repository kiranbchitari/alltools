'use client';

import { useState } from 'react';
import ToolLayout from '@/app/components/ToolLayout';
import Button from '@/app/components/Button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getTool } from '@/lib/tools';
import QRCode from 'qrcode';

export default function QrCodeGeneratorPage() {
    const tool = getTool('qr-code-generator');
    const [text, setText, clearText] = useLocalStorage('qr-code-generator-input', '');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [error, setError] = useState('');

    const generateQR = async () => {
        if (!text.trim()) {
            setError('Please enter text or URL');
            setQrCodeUrl('');
            return;
        }

        try {
            const url = await QRCode.toDataURL(text, {
                width: 400,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF',
                },
            });
            setQrCodeUrl(url);
            setError('');
        } catch (err) {
            setError('Error generating QR code');
            setQrCodeUrl('');
        }
    };

    const downloadQR = () => {
        if (!qrCodeUrl) return;

        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = qrCodeUrl;
        link.click();
    };

    const insertExample = () => {
        if (tool?.example) {
            setText(tool.example);
        }
    };

    if (!tool) return null;

    return (
        <ToolLayout title={tool.title} description={tool.description} toolKey="qr-code-generator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Input */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Text or URL</h2>
                        <div className="flex gap-2">
                            <Button onClick={insertExample} variant="secondary" size="sm">Insert Example</Button>
                            <Button onClick={() => clearText()} variant="ghost" size="sm">Clear</Button>
                        </div>
                    </div>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full p-3 sm:p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
                        placeholder="Enter text, URL, or contact info..."
                        aria-label="QR code text input"
                    />
                    <Button onClick={generateQR} variant="primary" size="md" fullWidth className="mt-3">
                        Generate QR Code
                    </Button>
                    {error && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}
                </div>

                {/* QR Code Display */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">QR Code</h2>
                    <div className="flex items-center justify-center min-h-[300px] border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                        {qrCodeUrl ? (
                            <div className="text-center">
                                <img src={qrCodeUrl} alt="Generated QR Code" className="mx-auto mb-4" />
                                <Button onClick={downloadQR} variant="success" size="md">
                                    Download PNG
                                </Button>
                            </div>
                        ) : (
                            <p className="text-gray-400">QR code will appear here</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Features:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Generate QR codes from any text or URL</li>
                    <li>• Download as PNG image (400x400px)</li>
                    <li>• Perfect for sharing links, contact info, WiFi passwords</li>
                    <li>• High-quality output suitable for printing</li>
                    <li>• Your input is automatically saved</li>
                </ul>
            </div>
        </ToolLayout>
    );
}
