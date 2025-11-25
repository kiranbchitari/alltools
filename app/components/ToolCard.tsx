import Link from 'next/link';

interface ToolCardProps {
  title: string;
  description: string;
  path: string;
}

export default function ToolCard({ title, description, path }: ToolCardProps) {
  return (
    <Link href={path}>
      <div className="group p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-400 cursor-pointer h-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
        <div className="mt-4 text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">
          Try it now →
        </div>
      </div>
    </Link>
  );
}
