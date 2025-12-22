import Link from 'next/link';
import Icon from './Icon';

interface ToolCardProps {
  title: string;
  description: string;
  path: string;
  icon?: string;
  keywords?: string[];
}

export default function ToolCard({ title, description, path, icon = 'code', keywords }: ToolCardProps) {
  return (
    <Link href={path}>
      <div className="group p-5 bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 hover:border-teal-300 hover:-translate-y-0.5 cursor-pointer h-full flex flex-col">
        <div className="flex items-start gap-4 mb-3">
          <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-sm">
            <Icon name={icon} size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-2">
              {title}
            </h2>
          </div>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-grow">
          {description}
        </p>

        {keywords && keywords.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {keywords.slice(0, 3).map((keyword, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 bg-slate-50 text-slate-500 rounded-md border border-slate-100"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        <div className="text-teal-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 mt-auto">
          Try it now
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
