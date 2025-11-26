import { generateToolMetadata } from '@/lib/metadata';

export const metadata = generateToolMetadata('ai-regex-generator');

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
