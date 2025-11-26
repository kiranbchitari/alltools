import { generateToolMetadata } from '@/lib/metadata';

export const metadata = generateToolMetadata('responsive-checker');

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
