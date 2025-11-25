import ToolLayout from '@/app/components/ToolLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Image Compressor - Coming Soon',
    description: 'Image compression tool coming soon. Compress images to reduce file size while maintaining quality.',
    keywords: 'image compressor, compress images, reduce image size',
};

export default function ImageCompressorPage() {
    return (
        <ToolLayout
            title="Image Compressor"
            description="Compress images to reduce file size (coming soon)"
        >
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="max-w-md mx-auto">
                    <div className="text-6xl mb-4">🚧</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Coming Soon</h2>
                    <p className="text-gray-600 mb-6">
                        The Image Compressor tool is currently under development. Check back soon!
                    </p>
                    <a
                        href="/"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Back to All Tools
                    </a>
                </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-yellow-900 mb-2">Planned Features:</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Compress JPG, PNG, and WebP images</li>
                    <li>• Adjust compression quality</li>
                    <li>• Batch processing support</li>
                    <li>• Client-side processing (no upload required)</li>
                </ul>
            </div>
        </ToolLayout>
    );
}
