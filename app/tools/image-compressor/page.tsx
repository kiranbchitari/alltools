'use client';

import { useState } from 'react';
import ToolLayout from '@/app/components/ToolLayout';
import Button from '@/app/components/Button';
import { getTool } from '@/lib/tools';

export default function ImageCompressorPage() {
    const tool = getTool('image-compressor');
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [originalPreview, setOriginalPreview] = useState('');
    const [compressedPreview, setCompressedPreview] = useState('');
    const [originalSize, setOriginalSize] = useState('');
    const [compressedSize, setCompressedSize] = useState('');
    const [quality, setQuality] = useState(80);
    const [isCompressing, setIsCompressing] = useState(false);
    const [compressionRatio, setCompressionRatio] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        setOriginalFile(file);
        setOriginalSize((file.size / 1024).toFixed(2) + ' KB');

        const reader = new FileReader();
        reader.onloadend = () => {
            setOriginalPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Reset compressed preview
        setCompressedPreview('');
        setCompressedSize('');
        setCompressionRatio('');
    };

    const compressImage = async () => {
        if (!originalFile || !originalPreview) return;

        setIsCompressing(true);

        try {
            const img = new Image();
            img.src = originalPreview;

            await new Promise((resolve) => {
                img.onload = resolve;
            });

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Could not get canvas context');
            }

            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        setIsCompressing(false);
                        return;
                    }

                    const compressedUrl = URL.createObjectURL(blob);
                    setCompressedPreview(compressedUrl);
                    setCompressedSize((blob.size / 1024).toFixed(2) + ' KB');

                    const ratio = ((1 - blob.size / originalFile.size) * 100).toFixed(1);
                    setCompressionRatio(ratio);
                    setIsCompressing(false);
                },
                'image/jpeg',
                quality / 100
            );
        } catch (error) {
            console.error('Compression error:', error);
            alert('Error compressing image');
            setIsCompressing(false);
        }
    };

    const downloadCompressed = () => {
        if (!compressedPreview) return;

        const link = document.createElement('a');
        link.download = `compressed-${originalFile?.name || 'image.jpg'}`;
        link.href = compressedPreview;
        link.click();
    };

    const clearAll = () => {
        setOriginalFile(null);
        setOriginalPreview('');
        setCompressedPreview('');
        setOriginalSize('');
        setCompressedSize('');
        setCompressionRatio('');
        setQuality(80);
    };

    if (!tool) return null;

    return (
        <ToolLayout title={tool.title} description={tool.description} toolKey="image-compressor">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Upload & Settings */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Upload Image</h2>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="image-upload"
                            aria-label="Upload image file"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                            <div className="text-gray-400 mb-2">
                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">Click to upload image</p>
                            <p className="text-xs text-gray-500">PNG, JPG, WebP</p>
                        </label>
                    </div>

                    {originalFile && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900">{originalFile.name}</p>
                            <p className="text-xs text-gray-600 mt-1">Original size: {originalSize}</p>
                        </div>
                    )}

                    {/* Quality Slider */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quality: {quality}%
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="100"
                            value={quality}
                            onChange={(e) => setQuality(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            aria-label="Compression quality"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Smaller file</span>
                            <span>Better quality</span>
                        </div>
                    </div>

                    {/* Original Preview */}
                    {originalPreview && (
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-900 mb-2">Original Preview:</p>
                            <img src={originalPreview} alt="Original" className="max-w-full h-auto rounded-lg border border-gray-200" />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button
                            onClick={compressImage}
                            variant="primary"
                            size="md"
                            fullWidth
                            disabled={!originalFile || isCompressing}
                            aria-label="Compress image"
                        >
                            {isCompressing ? 'Compressing...' : 'Compress Image'}
                        </Button>
                        <Button onClick={clearAll} variant="ghost" size="md">
                            Clear
                        </Button>
                    </div>
                </div>

                {/* Compressed Result */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Compressed Image</h2>

                    {compressedPreview ? (
                        <div>
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-green-900">Compressed size:</span>
                                    <span className="text-sm font-bold text-green-900">{compressedSize}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-green-900">Size reduced by:</span>
                                    <span className="text-lg font-bold text-green-600">{compressionRatio}%</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-900 mb-2">Preview:</p>
                                <img src={compressedPreview} alt="Compressed" className="max-w-full h-auto rounded-lg border border-gray-200" />
                            </div>

                            <Button onClick={downloadCompressed} variant="success" size="md" fullWidth>
                                Download Compressed Image
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                            <p className="text-gray-400">Compressed image will appear here</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Features:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Client-side compression:</strong> All processing happens in your browser</li>
                    <li>• <strong>Adjustable quality:</strong> Control the balance between file size and image quality</li>
                    <li>• <strong>Instant preview:</strong> See the compressed image before downloading</li>
                    <li>• <strong>Size comparison:</strong> View original vs compressed file sizes</li>
                    <li>• <strong>Privacy-friendly:</strong> No images uploaded to any server</li>
                    <li>• Supports PNG, JPG, and WebP formats</li>
                </ul>
            </div>
        </ToolLayout>
    );
}
