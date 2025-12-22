import Link from 'next/link';
import { getRelatedTools } from '@/lib/tools';

interface RelatedToolsProps {
    currentToolKey: string;
}

export default function RelatedTools({ currentToolKey }: RelatedToolsProps) {
    const relatedTools = getRelatedTools(currentToolKey, 3);

    if (relatedTools.length === 0) {
        return null;
    }

    return (
        <div className="mt-12 pt-8 border-t border-slate-200">
            <nav aria-label="Related tools">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Related Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {relatedTools.map((tool) => (
                        <Link
                            key={tool.key}
                            href={tool.path}
                            className="p-4 bg-white border border-slate-200/60 rounded-xl hover:border-teal-300 hover:shadow-md transition-all group"
                        >
                            <h3 className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors mb-1">
                                {tool.title}
                            </h3>
                            <p className="text-sm text-slate-500 line-clamp-2">
                                {tool.description}
                            </p>
                        </Link>
                    ))}
                </div>
                <div className="flex justify-center">
                    <Link
                        href="/"
                        className="text-teal-600 hover:text-teal-700 font-medium hover:underline"
                    >
                        View all developer tools →
                    </Link>
                </div>
            </nav>
        </div>
    );
}
