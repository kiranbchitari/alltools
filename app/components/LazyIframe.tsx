'use client';

import { useState, useEffect, useRef } from 'react';

interface LazyIframeProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
    title: string;
}

export default function LazyIframe({ title, className, ...props }: LazyIframeProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsLoaded(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' }
        );

        if (iframeRef.current) {
            observer.observe(iframeRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={iframeRef as any} className={`relative ${className}`}>
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center rounded-lg">
                    <span className="text-gray-400 text-sm">Loading preview...</span>
                </div>
            )}
            {isLoaded && (
                <iframe
                    {...props}
                    title={title}
                    className={`w-full h-full border-0 ${className}`}
                    loading="lazy"
                />
            )}
        </div>
    );
}
