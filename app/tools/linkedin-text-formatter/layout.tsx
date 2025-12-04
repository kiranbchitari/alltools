import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'LinkedIn Text Formatter | Bold, Italic & Script Generator',
    description: 'Format your LinkedIn posts with Bold, Italic, Script, and Monospace text. Free online tool to make your posts stand out.',
    keywords: ['linkedin text formatter', 'linkedin bold text', 'linkedin italic generator', 'unicode text converter', 'social media formatter'],
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
