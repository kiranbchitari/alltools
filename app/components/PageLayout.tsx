import Header from './Header';
import Footer from './Footer';

interface PageLayoutProps {
    children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
            <Header />
            <main className="flex-grow w-full">
                {children}
            </main>
            <Footer />
        </div>
    );
}
