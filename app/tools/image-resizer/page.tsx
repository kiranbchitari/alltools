'use client';

import { useState, useRef, useEffect } from 'react';
import ToolLayout from '@/app/components/ToolLayout';
import Button from '@/app/components/Button';
import { getTool } from '@/lib/tools';

export default function ImageResizerPage() {
    const tool = getTool('image-resizer');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState('');
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
    const [aspectRatio, setAspectRatio] = useState(0);
    const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
    const [resizedPreview, setResizedPreview] = useState('');
    const [isResizing, setIsResizing] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
        setResizedPreview('');

        const img = new Image();
        img.onload = () => {
            setWidth(img.width);
            setHeight(img.height);
            setOriginalDimensions({ width: img.width, height: img.height });
            setAspectRatio(img.width / img.height);
        };
        img.src = objectUrl;
    };

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWidth = parseInt(e.target.value) || 0;
        setWidth(newWidth);
        if (maintainAspectRatio && aspectRatio) {
            setHeight(Math.round(newWidth / aspectRatio));
        }
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHeight = parseInt(e.target.value) || 0;
        setHeight(newHeight);
        if (maintainAspectRatio && aspectRatio) {
            setWidth(Math.round(newHeight * aspectRatio));
        }
    };

    const resizeImage = async () => {
        if (!file || !preview || width <= 0 || height <= 0) return;

        setIsResizing(true);

        try {
            const img = new Image();
            img.src = preview;
            await new Promise((resolve) => { img.onload = resolve; });

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');

            // Better quality resizing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                if (blob) {
                    setResizedPreview(URL.createObjectURL(blob));
                }
                setIsResizing(false);
            }, file.type);
        } catch (error) {
            console.error('Error resizing image:', error);
            alert('Error resizing image');
            setIsResizing(false);
        }
    };

    const downloadResized = () => {
        if (!resizedPreview) return;
        const link = document.createElement('a');
        link.download = `resized-${file?.name}`;
        link.href = resizedPreview;
        link.click();
    };

    const reset = () => {
        setFile(null);
        setPreview('');
        setResizedPreview('');
        setWidth(0);
        setHeight(0);
    };

    if (!tool) return null;

    return (
        <ToolLayout title={tool.title} description={tool.description} toolKey="image-resizer">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Settings Area */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Image Settings</h2>

                    {!file ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="image-upload"
                                aria-label="Upload image"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer">
                                <div className="text-gray-400 mb-2">
                                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">Click to upload image</p>
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="text-sm">
                                    <p className="font-medium text-gray-900">{file.name}</p>
                                    <p className="text-gray-500">Original: {originalDimensions.width} x {originalDimensions.height}</p>
                                </div>
                                <button onClick={reset} className="text-red-500 hover:text-red-700 text-sm">
                                    Change
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                                    <input
                                        type="number"
                                        value={width}
                                        onChange={handleWidthChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={handleHeightChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="aspect-ratio"
                                    checked={maintainAspectRatio}
                                    onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                                />
                                <label htmlFor="aspect-ratio" className="ml-2 text-sm text-gray-700">
                                    Maintain aspect ratio
                                </label>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button
                                    onClick={resizeImage}
                                    variant="primary"
                                    size="md"
                                    fullWidth
                                    disabled={isResizing}
                                >
                                    {isResizing ? 'Resizing...' : 'Resize Image'}
                                </Button>
                                <Button onClick={() => {
                                    setWidth(originalDimensions.width);
                                    setHeight(originalDimensions.height);
                                }} variant="ghost" size="md">
                                    Reset Size
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Preview Area */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Preview</h2>

                    {resizedPreview ? (
                        <div className="space-y-4">
                            <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                                <img src={resizedPreview} alt="Resized" className="max-w-full h-auto" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-2">
                                    New size: {width} x {height}
                                </p>
                                <Button onClick={downloadResized} variant="success" size="md" fullWidth>
                                    Download Resized Image
                                </Button>
                            </div>
                        </div>
                    ) : preview ? (
                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                            <img src={preview} alt="Original" className="max-w-full h-auto opacity-50" />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                            <p className="text-gray-400">Preview will appear here</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Features:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>High quality resizing:</strong> Uses advanced canvas smoothing</li>
                    <li>• <strong>Aspect ratio lock:</strong> Automatically calculates height/width</li>
                    <li>• <strong>Privacy-friendly:</strong> All processing happens in your browser</li>
                    <li>• <strong>Instant preview:</strong> See the result before downloading</li>
                </ul>
            </div>
        </ToolLayout>
    );
}
