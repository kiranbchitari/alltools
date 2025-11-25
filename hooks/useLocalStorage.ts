import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T, debounceMs: number = 500) {
    const [value, setValue] = useState<T>(initialValue);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setValue(JSON.parse(item));
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        } finally {
            setIsLoaded(true);
        }
    }, [key]);

    // Save to localStorage with debounce
    useEffect(() => {
        if (!isLoaded) return;

        const timeoutId = setTimeout(() => {
            try {
                window.localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.error('Error saving to localStorage:', error);
            }
        }, debounceMs);

        return () => clearTimeout(timeoutId);
    }, [key, value, debounceMs, isLoaded]);

    const clearStorage = useCallback(() => {
        try {
            window.localStorage.removeItem(key);
            setValue(initialValue);
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }, [key, initialValue]);

    return [value, setValue, clearStorage, isLoaded] as const;
}
