'use client';

import { useState } from 'react';
import ToolLayout from '@/app/components/ToolLayout';
import Button from '@/app/components/Button';
import { getTool } from '@/lib/tools';
import { jsPDF } from 'jspdf';

export default function ImageToPdfPage() {
    const tool = getTool('image-to-pdf');
    const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (index: number) => {
        setImages(prev => {
            const newImages = [...prev];
            URL.revokeObjectURL(newImages[index].preview);
            newImages.splice(index, 1);
            return newImages;
        });
    };

    const generatePdf = async () => {
        if (images.length === 0) return;

        setIsGenerating(true);

        try {
            // Dynamic import to avoid SSR issues
            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF();

            for (let i = 0; i < images.length; i++) {
                if (i > 0) doc.addPage();

                const img = new Image();
                img.src = images[i].preview;
                await new Promise((resolve) => { img.onload = resolve; });

                // Calculate dimensions to fit page
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                const imgRatio = img.width / img.height;
                const pageRatio = pageWidth / pageHeight;

                let renderWidth = pageWidth;
                let renderHeight = pageWidth / imgRatio;

                if (renderHeight > pageHeight) {
                    renderHeight = pageHeight;
                    renderWidth = pageHeight * imgRatio;
                }

                const x = (pageWidth - renderWidth) / 2;
                const y = (pageHeight - renderHeight) / 2;

                doc.addImage(img, 'JPEG', x, y, renderWidth, renderHeight);
            }

            doc.save('images.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF');
        } finally {
            setIsGenerating(false);
        }
    };

    const clearAll = () => {
        images.forEach(img => URL.revokeObjectURL(img.preview));
        setImages([]);
    };

    if (!tool) return null;

    return (
        <ToolLayout title={tool.title} description={tool.description} toolKey="image-to-pdf">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Upload Area */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Upload Images</h2>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                            id="image-upload"
                            aria-label="Upload images"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                            <div className="text-gray-400 mb-2">
                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">Click to upload images</p>
                            <p className="text-xs text-gray-500">PNG, JPG, WebP</p>
                        </label>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={generatePdf}
                            variant="primary"
                            size="md"
                            fullWidth
                            disabled={images.length === 0 || isGenerating}
                            aria-label="Generate PDF"
                        >
                            {isGenerating ? 'Generating...' : 'Convert to PDF'}
                        </Button>
                        <Button onClick={clearAll} variant="ghost" size="md">
                            Clear All
                        </Button>
                    </div>
                </div>

                {/* Preview Area */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                        Selected Images ({images.length})
                    </h2>

                    {images.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-2">
                            {images.map((img, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={img.preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                    />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="Remove image"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                        Page {index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                            <p className="text-gray-400">No images selected</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Features:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Client-side conversion:</strong> Images are processed in your browser</li>
                    <li>• <strong>Multiple images:</strong> Combine multiple images into one PDF</li>
                    <li>• <strong>Auto-scaling:</strong> Images are automatically scaled to fit PDF pages</li>
                    <li>• <strong>Drag & Drop:</strong> Easily reorder images (coming soon)</li>
                    <li>• <strong>Privacy-friendly:</strong> No files uploaded to server</li>
                </ul>
            </div>
        </ToolLayout>
    );
}
