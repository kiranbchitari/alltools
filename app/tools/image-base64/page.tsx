'use client';

import { useState } from 'react';
import ToolLayout from '@/app/components/ToolLayout';
import Button from '@/app/components/Button';
import CopyButton from '@/app/components/CopyButton';
import { getTool } from '@/lib/tools';

export default function ImageBase64Page() {
    const tool = getTool('image-base64');
    const [base64, setBase64] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState('');
    const [preview, setPreview] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        setFileName(file.name);
        setFileSize((file.size / 1024).toFixed(2) + ' KB');

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setBase64(result);
            setPreview(result);
        };
        reader.readAsDataURL(file);
    };

    const clearAll = () => {
        setBase64('');
        setFileName('');
        setFileSize('');
        setPreview('');
    };

    if (!tool) return null;

    return (
        <ToolLayout title={tool.title} description={tool.description} toolKey="image-base64">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Upload */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Upload Image</h2>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                            <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP</p>
                        </label>
                    </div>

                    {fileName && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900">{fileName}</p>
                            <p className="text-xs text-gray-600 mt-1">Size: {fileSize}</p>
                        </div>
                    )}

                    {preview && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-900 mb-2">Preview:</p>
                            <img src={preview} alt="Preview" className="max-w-full h-auto rounded-lg border border-gray-200" />
                        </div>
                    )}
                </div>

                {/* Base64 Output */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Base64 Output</h2>
                        <div className="flex gap-2">
                            {base64 && <CopyButton text={base64} />}
                            <Button onClick={clearAll} variant="ghost" size="sm">Clear</Button>
                        </div>
                    </div>
                    <textarea
                        value={base64}
                        readOnly
                        className="w-full p-3 sm:p-4 font-mono text-xs border border-gray-300 rounded-lg bg-gray-50 resize-none h-96 sm:h-[500px]"
                        placeholder="Base64 encoded image will appear here..."
                        aria-label="Base64 output"
                    />
                </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Features:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Convert images to Base64 data URI format</li>
                    <li>• Supports PNG, JPG, GIF, WebP formats</li>
                    <li>• Perfect for embedding images in HTML, CSS, or JSON</li>
                    <li>• Preview image before conversion</li>
                    <li>• Copy Base64 string with one click</li>
                </ul>
            </div>
        </ToolLayout>
    );
}
