// Storage utilities for API key management
// Supports both localStorage and IndexedDB for redundancy

const DB_NAME = 'ai-tool';
const STORE_NAME = 'settings';
const LOCALSTORAGE_KEY = 'groq_api_key';

// IndexedDB helper functions
async function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
    });
}

async function saveToIndexedDB(key: string, value: string): Promise<void> {
    try {
        const db = await openDB();
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        store.put(value, key);

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    } catch (error) {
        console.error('IndexedDB save error:', error);
        throw error;
    }
}

async function loadFromIndexedDB(key: string): Promise<string | null> {
    try {
        const db = await openDB();
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('IndexedDB load error:', error);
        return null;
    }
}

async function deleteFromIndexedDB(key: string): Promise<void> {
    try {
        const db = await openDB();
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        store.delete(key);

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    } catch (error) {
        console.error('IndexedDB delete error:', error);
        throw error;
    }
}

// Public API
export async function saveApiKey(apiKey: string): Promise<void> {
    // Save to localStorage
    try {
        localStorage.setItem(LOCALSTORAGE_KEY, apiKey);
    } catch (error) {
        console.error('localStorage save error:', error);
    }

    // Save to IndexedDB
    try {
        await saveToIndexedDB('apiKey', apiKey);
    } catch (error) {
        console.error('Failed to save to IndexedDB:', error);
    }
}

export async function loadApiKey(): Promise<string | null> {
    // Try IndexedDB first
    try {
        const key = await loadFromIndexedDB('apiKey');
        if (key) return key;
    } catch (error) {
        console.error('Failed to load from IndexedDB:', error);
    }

    // Fallback to localStorage
    try {
        return localStorage.getItem(LOCALSTORAGE_KEY);
    } catch (error) {
        console.error('localStorage load error:', error);
        return null;
    }
}

export async function clearApiKey(): Promise<void> {
    // Clear from localStorage
    try {
        localStorage.removeItem(LOCALSTORAGE_KEY);
    } catch (error) {
        console.error('localStorage clear error:', error);
    }

    // Clear from IndexedDB
    try {
        await deleteFromIndexedDB('apiKey');
    } catch (error) {
        console.error('Failed to clear from IndexedDB:', error);
    }
}
