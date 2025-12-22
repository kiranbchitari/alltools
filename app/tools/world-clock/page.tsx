'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import ToolLayout from '@/app/components/ToolLayout';
import Button from '@/app/components/Button';
import { getTool } from '@/lib/tools';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Clock {
    id: string;
    label: string;
    timezone: string;
}

interface TimeDisplay {
    time: string;
    date: string;
    offset: string;
    isWorkingHour: boolean;
    isDaytime: boolean;  // true if 6 AM - 8 PM local time
    hour: number;        // 0-23 hour for calculations
}

// ============================================================================
// CONSTANTS
// ============================================================================

// localStorage keys for persistence
const STORAGE_KEY = 'formatmint_user_clocks';
const THEME_KEY = 'formatmint_world_clock_theme';
const FORMAT_KEY = 'formatmint_world_clock_format';

// Default timezone (India Standard Time)
const DEFAULT_TIMEZONE = 'Asia/Kolkata';

// Common US time zones as specified in requirements (expanded with more cities)
const US_TIMEZONES = [
    { value: 'America/New_York', label: 'New York / Miami / Florida (ET)' },
    { value: 'America/Chicago', label: 'Chicago / Dallas / Houston (CT)' },
    { value: 'America/Denver', label: 'Denver / Salt Lake City (MT)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles / Seattle (PT)' },
    { value: 'America/Phoenix', label: 'Phoenix, Arizona (MST - No DST)' },
    { value: 'America/Anchorage', label: 'Alaska (AKT)' },
    { value: 'Pacific/Honolulu', label: 'Hawaii (HST)' },
];

// Additional popular time zones for user convenience
const POPULAR_TIMEZONES = [
    { value: 'Asia/Kolkata', label: 'India (IST)' },
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Paris / Berlin (CET)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
    { value: 'Asia/Dubai', label: 'Dubai (GST)' },
    { value: 'Asia/Shanghai', label: 'China / Hong Kong (CST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
    { value: 'Pacific/Auckland', label: 'Auckland (NZST)' },
    { value: 'America/Toronto', label: 'Toronto (ET)' },
    { value: 'America/Vancouver', label: 'Vancouver (PT)' },
    { value: 'Europe/Berlin', label: 'Germany (CET)' },
    { value: 'Asia/Seoul', label: 'Seoul (KST)' },
    { value: 'Asia/Bangkok', label: 'Bangkok (ICT)' },
    { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)' },
    { value: 'Africa/Lagos', label: 'Lagos / Nigeria (WAT)' },
    { value: 'Africa/Johannesburg', label: 'South Africa (SAST)' },
];

// All available timezones combined
const ALL_TIMEZONES = [...POPULAR_TIMEZONES, ...US_TIMEZONES];

// Working hours range (9 AM to 6 PM)
const WORK_START_HOUR = 9;
const WORK_END_HOUR = 18;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a unique ID for clock entries
 */
function generateId(): string {
    return `clock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get the user's local timezone using Intl API
 */
function getLocalTimezone(): string {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
        return DEFAULT_TIMEZONE;
    }
}

/**
 * Format time for a specific timezone using Intl.DateTimeFormat (DST-safe)
 */
function formatTimeForTimezone(
    date: Date,
    timezone: string,
    use24Hour: boolean
): TimeDisplay {
    try {
        // Format time
        const timeFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: !use24Hour,
        });

        // Format date
        const dateFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });

        // Get UTC offset for the timezone
        const offsetFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            timeZoneName: 'shortOffset',
        });
        const offsetParts = offsetFormatter.formatToParts(date);
        const offsetPart = offsetParts.find(p => p.type === 'timeZoneName');
        const offset = offsetPart?.value || '';

        // Check if current hour is within working hours (9 AM - 6 PM)
        const hourFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: 'numeric',
            hour12: false,
        });
        const hour = parseInt(hourFormatter.format(date), 10);
        const isWorkingHour = hour >= WORK_START_HOUR && hour < WORK_END_HOUR;
        const isDaytime = hour >= 6 && hour < 20; // 6 AM to 8 PM is daytime

        return {
            time: timeFormatter.format(date),
            date: dateFormatter.format(date),
            offset,
            isWorkingHour,
            isDaytime,
            hour,
        };
    } catch {
        return {
            time: 'Invalid timezone',
            date: '',
            offset: '',
            isWorkingHour: false,
            isDaytime: true,
            hour: 12,
        };
    }
}

/**
 * Load clocks from localStorage or return defaults
 */
function loadClocksFromStorage(): Clock[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch {
        console.warn('Failed to load clocks from localStorage');
    }

    // Default clocks: IST and EST (India and New York/Florida)
    const defaults: Clock[] = [
        {
            id: generateId(),
            label: 'India (IST)',
            timezone: 'Asia/Kolkata',
        },
        {
            id: generateId(),
            label: 'New York / Florida (EST)',
            timezone: 'America/New_York',
        },
    ];

    return defaults;
}

/**
 * Parse URL parameters for preloaded clocks
 */
function parseClocksFromUrl(searchParams: URLSearchParams): Clock[] | null {
    const clocksParam = searchParams.get('clocks');
    if (!clocksParam) return null;

    try {
        const timezones = clocksParam.split(',').map(tz => tz.trim()).filter(Boolean);
        if (timezones.length === 0) return null;

        return timezones.map(tz => ({
            id: generateId(),
            label: ALL_TIMEZONES.find(t => t.value === tz)?.label || tz,
            timezone: tz,
        }));
    } catch {
        return null;
    }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function WorldClockPage() {
    const tool = getTool('world-clock');
    const searchParams = useSearchParams();

    // State for clocks
    const [clocks, setClocks] = useState<Clock[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // State for settings
    const [use24Hour, setUse24Hour] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // State for current time (updates every second)
    const [currentTime, setCurrentTime] = useState(new Date());

    // State for add clock modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedTimezone, setSelectedTimezone] = useState('');
    const [customLabel, setCustomLabel] = useState('');

    // State for editing
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editLabel, setEditLabel] = useState('');

    // State for drag and drop
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [dragOverId, setDragOverId] = useState<string | null>(null);

    // State for copy feedback
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // State for Meeting Planner
    const [showMeetingPlanner, setShowMeetingPlanner] = useState(false);
    const [meetingTime, setMeetingTime] = useState('');
    const [meetingSourceTz, setMeetingSourceTz] = useState('');

    // State for Best Meeting Time finder
    const [showBestTimeModal, setShowBestTimeModal] = useState(false);

    // Refs for input focus
    const editInputRef = useRef<HTMLInputElement>(null);

    // ========================================================================
    // INITIALIZATION - Load settings and clocks
    // ========================================================================

    useEffect(() => {
        // Load theme preference
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
        }

        // Load time format preference
        const savedFormat = localStorage.getItem(FORMAT_KEY);
        if (savedFormat === '24') {
            setUse24Hour(true);
        }

        // Check URL parameters first, then localStorage
        const urlClocks = parseClocksFromUrl(searchParams);
        if (urlClocks) {
            setClocks(urlClocks);
        } else {
            setClocks(loadClocksFromStorage());
        }

        setIsLoaded(true);
    }, [searchParams]);

    // ========================================================================
    // LIVE TIME UPDATE - Update every second
    // ========================================================================

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    // ========================================================================
    // PERSISTENCE - Save clocks to localStorage when they change
    // ========================================================================

    useEffect(() => {
        if (isLoaded && clocks.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(clocks));
        }
    }, [clocks, isLoaded]);

    // ========================================================================
    // THEME TOGGLE
    // ========================================================================

    const toggleDarkMode = useCallback(() => {
        setIsDarkMode(prev => {
            const newValue = !prev;
            localStorage.setItem(THEME_KEY, newValue ? 'dark' : 'light');
            return newValue;
        });
    }, []);

    // ========================================================================
    // TIME FORMAT TOGGLE
    // ========================================================================

    const toggleTimeFormat = useCallback(() => {
        setUse24Hour(prev => {
            const newValue = !prev;
            localStorage.setItem(FORMAT_KEY, newValue ? '24' : '12');
            return newValue;
        });
    }, []);

    // ========================================================================
    // CLOCK MANAGEMENT FUNCTIONS
    // ========================================================================

    const addClock = useCallback(() => {
        if (!selectedTimezone) return;

        // Prevent duplicate timezones
        if (clocks.some(c => c.timezone === selectedTimezone)) {
            alert('This timezone is already added!');
            return;
        }

        const defaultLabel = ALL_TIMEZONES.find(t => t.value === selectedTimezone)?.label || selectedTimezone;

        const newClock: Clock = {
            id: generateId(),
            label: customLabel.trim() || defaultLabel,
            timezone: selectedTimezone,
        };

        setClocks(prev => [...prev, newClock]);
        setShowAddModal(false);
        setSelectedTimezone('');
        setCustomLabel('');
    }, [selectedTimezone, customLabel, clocks]);

    const removeClock = useCallback((id: string) => {
        setClocks(prev => prev.filter(c => c.id !== id));
    }, []);

    const startEditing = useCallback((clock: Clock) => {
        setEditingId(clock.id);
        setEditLabel(clock.label);
        // Focus input after render
        setTimeout(() => editInputRef.current?.focus(), 0);
    }, []);

    const saveEdit = useCallback(() => {
        if (editingId && editLabel.trim()) {
            setClocks(prev =>
                prev.map(c =>
                    c.id === editingId ? { ...c, label: editLabel.trim() } : c
                )
            );
        }
        setEditingId(null);
        setEditLabel('');
    }, [editingId, editLabel]);

    const cancelEdit = useCallback(() => {
        setEditingId(null);
        setEditLabel('');
    }, []);

    // ========================================================================
    // COPY TO CLIPBOARD
    // ========================================================================

    const copyToClipboard = useCallback(async (clock: Clock) => {
        const display = formatTimeForTimezone(currentTime, clock.timezone, use24Hour);
        const textToCopy = `${clock.label}: ${display.time} ${display.offset} (${display.date})`;

        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopiedId(clock.id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            console.error('Failed to copy to clipboard');
        }
    }, [currentTime, use24Hour]);

    // ========================================================================
    // DRAG AND DROP HANDLERS
    // ========================================================================

    const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
        setDraggedId(id);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', id);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent, id: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (id !== draggedId) {
            setDragOverId(id);
        }
    }, [draggedId]);

    const handleDragLeave = useCallback(() => {
        setDragOverId(null);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (!draggedId || draggedId === targetId) {
            setDraggedId(null);
            setDragOverId(null);
            return;
        }

        setClocks(prev => {
            const items = [...prev];
            const draggedIndex = items.findIndex(c => c.id === draggedId);
            const targetIndex = items.findIndex(c => c.id === targetId);

            if (draggedIndex === -1 || targetIndex === -1) return prev;

            // Remove dragged item and insert at new position
            const [removed] = items.splice(draggedIndex, 1);
            items.splice(targetIndex, 0, removed);

            return items;
        });

        setDraggedId(null);
        setDragOverId(null);
    }, [draggedId]);

    const handleDragEnd = useCallback(() => {
        setDraggedId(null);
        setDragOverId(null);
    }, []);

    // ========================================================================
    // GENERATE SHAREABLE URL
    // ========================================================================

    const getShareableUrl = useCallback(() => {
        if (typeof window === 'undefined') return '';
        const timezones = clocks.map(c => c.timezone).join(',');
        return `${window.location.origin}${window.location.pathname}?clocks=${encodeURIComponent(timezones)}`;
    }, [clocks]);

    const copyShareableUrl = useCallback(async () => {
        const url = getShareableUrl();
        try {
            await navigator.clipboard.writeText(url);
            alert('Shareable URL copied to clipboard!');
        } catch {
            // Fallback for older browsers
            prompt('Copy this URL:', url);
        }
    }, [getShareableUrl]);

    // ========================================================================
    // RENDER
    // ========================================================================

    if (!tool) return null;

    // Theme classes
    const themeClasses = isDarkMode
        ? 'bg-gray-900 text-gray-100'
        : 'bg-white text-gray-900';

    const cardClasses = isDarkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200';

    const inputClasses = isDarkMode
        ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
        : 'bg-white border-gray-300 text-gray-900';

    return (
        <ToolLayout title={tool.title} description={tool.description} toolKey="world-clock">
            <div className={`rounded-xl p-4 sm:p-6 transition-colors duration-300 ${themeClasses}`}>
                {/* Header Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Add Clock Button */}
                        <Button
                            onClick={() => setShowAddModal(true)}
                            variant="primary"
                            size="sm"
                            aria-label="Add new clock"
                        >
                            <span className="mr-1">+</span> Add Clock
                        </Button>

                        {/* Share URL Button */}
                        <Button
                            onClick={copyShareableUrl}
                            variant="ghost"
                            size="sm"
                            aria-label="Copy shareable URL"
                            className={isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : ''}
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            Share
                        </Button>

                        {/* Meeting Planner Button */}
                        {clocks.length >= 2 && (
                            <Button
                                onClick={() => setShowMeetingPlanner(true)}
                                variant="ghost"
                                size="sm"
                                aria-label="Plan a meeting across time zones"
                                className={isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : ''}
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Plan Meeting
                            </Button>
                        )}

                        {/* Best Meeting Time Button */}
                        {clocks.length >= 2 && (
                            <Button
                                onClick={() => setShowBestTimeModal(true)}
                                variant="ghost"
                                size="sm"
                                aria-label="Find best meeting time"
                                className={isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : ''}
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Best Time
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* 12/24 Hour Toggle */}
                        <button
                            onClick={toggleTimeFormat}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isDarkMode
                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                            aria-label={`Switch to ${use24Hour ? '12-hour' : '24-hour'} format`}
                        >
                            {use24Hour ? '24h' : '12h'}
                        </button>

                        {/* Dark/Light Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-lg transition-colors ${isDarkMode
                                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                        >
                            {isDarkMode ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Working Hours Legend */}
                <div className={`mb-4 p-3 rounded-lg text-sm ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
                    <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-green-500' : 'bg-green-400'}`}></span>
                        <span className={isDarkMode ? 'text-gray-300' : 'text-blue-800'}>
                            Working hours (9 AM - 6 PM local time)
                        </span>
                    </div>
                </div>

                {/* Clocks Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {clocks.map(clock => {
                        const display = formatTimeForTimezone(currentTime, clock.timezone, use24Hour);
                        const isBeingDragged = draggedId === clock.id;
                        const isDragTarget = dragOverId === clock.id;

                        return (
                            <div
                                key={clock.id}
                                draggable
                                onDragStart={e => handleDragStart(e, clock.id)}
                                onDragOver={e => handleDragOver(e, clock.id)}
                                onDragLeave={handleDragLeave}
                                onDrop={e => handleDrop(e, clock.id)}
                                onDragEnd={handleDragEnd}
                                className={`relative p-4 rounded-xl border-2 transition-all duration-200 cursor-move ${cardClasses} ${isBeingDragged ? 'opacity-50 scale-95' : ''
                                    } ${isDragTarget ? 'border-blue-500 shadow-lg' : ''} ${display.isWorkingHour
                                        ? isDarkMode
                                            ? 'ring-2 ring-green-500/30'
                                            : 'ring-2 ring-green-400/50'
                                        : ''
                                    }`}
                                role="article"
                                aria-label={`Clock for ${clock.label}`}
                            >
                                {/* Working hours indicator */}
                                {display.isWorkingHour && (
                                    <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${isDarkMode ? 'bg-green-500' : 'bg-green-400'
                                        }`} aria-label="Currently in working hours" />
                                )}

                                {/* Day/Night indicator */}
                                <div className={`absolute top-2 ${display.isWorkingHour ? 'right-7' : 'right-2'}`}
                                    aria-label={display.isDaytime ? 'Daytime' : 'Nighttime'}>
                                    {display.isDaytime ? (
                                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                        </svg>
                                    )}
                                </div>

                                {/* Drag handle */}
                                <div
                                    className={`absolute top-2 left-2 cursor-grab ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                                        }`}
                                    aria-hidden="true"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                                    </svg>
                                </div>

                                {/* Clock Label */}
                                <div className="mt-4 mb-3">
                                    {editingId === clock.id ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                ref={editInputRef}
                                                type="text"
                                                value={editLabel}
                                                onChange={e => setEditLabel(e.target.value)}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') saveEdit();
                                                    if (e.key === 'Escape') cancelEdit();
                                                }}
                                                className={`flex-1 px-2 py-1 text-sm rounded border ${inputClasses}`}
                                                aria-label="Edit clock label"
                                            />
                                            <button
                                                onClick={saveEdit}
                                                className="text-green-500 hover:text-green-600"
                                                aria-label="Save label"
                                            >
                                                ✓
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="text-red-500 hover:text-red-600"
                                                aria-label="Cancel editing"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <h3
                                            onClick={() => startEditing(clock)}
                                            className={`text-sm font-medium cursor-pointer hover:opacity-70 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                                }`}
                                            title="Click to edit label"
                                            role="button"
                                            aria-label={`Edit ${clock.label} label`}
                                        >
                                            {clock.label}
                                        </h3>
                                    )}
                                </div>

                                {/* Time Display */}
                                <div className="text-center mb-3">
                                    <div className={`text-3xl font-bold font-mono tracking-wide ${isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {display.time}
                                    </div>
                                    <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                        {display.date}
                                    </div>
                                    <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                                        }`}>
                                        {display.offset}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-dashed ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}">
                                    {/* Copy Button */}
                                    <button
                                        onClick={() => copyToClipboard(clock)}
                                        className={`p-1.5 rounded transition-colors ${copiedId === clock.id
                                            ? 'text-green-500 bg-green-100'
                                            : isDarkMode
                                                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                            }`}
                                        aria-label={copiedId === clock.id ? 'Copied!' : 'Copy time to clipboard'}
                                        title={copiedId === clock.id ? 'Copied!' : 'Copy time'}
                                    >
                                        {copiedId === clock.id ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </button>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeClock(clock.id)}
                                        className={`p-1.5 rounded transition-colors ${isDarkMode
                                            ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/30'
                                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                            }`}
                                        aria-label={`Remove ${clock.label} clock`}
                                        title="Remove clock"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {clocks.length === 0 && isLoaded && (
                    <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg mb-2">No clocks added yet</p>
                        <p className="text-sm mb-4">Add your first clock to start tracking time zones</p>
                        <Button onClick={() => setShowAddModal(true)} variant="primary" size="md">
                            Add Your First Clock
                        </Button>
                    </div>
                )}

                {/* Add Clock Modal */}
                {showAddModal && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                        onClick={() => setShowAddModal(false)}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="add-clock-title"
                    >
                        <div
                            className={`w-full max-w-md p-6 rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                                }`}
                            onClick={e => e.stopPropagation()}
                        >
                            <h2
                                id="add-clock-title"
                                className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}
                            >
                                Add New Clock
                            </h2>

                            {/* Timezone Select */}
                            <div className="mb-4">
                                <label
                                    htmlFor="timezone-select"
                                    className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}
                                >
                                    Select Timezone
                                </label>
                                <select
                                    id="timezone-select"
                                    value={selectedTimezone}
                                    onChange={e => setSelectedTimezone(e.target.value)}
                                    className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputClasses}`}
                                    aria-required="true"
                                >
                                    <option value="">Choose a timezone...</option>
                                    <optgroup label="Popular">
                                        {POPULAR_TIMEZONES.map(tz => (
                                            <option key={tz.value} value={tz.value} disabled={clocks.some(c => c.timezone === tz.value)}>
                                                {tz.label} {clocks.some(c => c.timezone === tz.value) ? '(added)' : ''}
                                            </option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="US Time Zones">
                                        {US_TIMEZONES.map(tz => (
                                            <option key={tz.value} value={tz.value} disabled={clocks.some(c => c.timezone === tz.value)}>
                                                {tz.label} {clocks.some(c => c.timezone === tz.value) ? '(added)' : ''}
                                            </option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>

                            {/* Custom Label Input */}
                            <div className="mb-6">
                                <label
                                    htmlFor="custom-label"
                                    className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}
                                >
                                    Custom Label (optional)
                                </label>
                                <input
                                    id="custom-label"
                                    type="text"
                                    value={customLabel}
                                    onChange={e => setCustomLabel(e.target.value)}
                                    placeholder="e.g., Team LA, Client NYC"
                                    className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputClasses}`}
                                />
                            </div>

                            {/* Modal Actions */}
                            <div className="flex justify-end gap-3">
                                <Button
                                    onClick={() => setShowAddModal(false)}
                                    variant="ghost"
                                    size="md"
                                    className={isDarkMode ? 'text-gray-300 hover:bg-gray-700' : ''}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={addClock}
                                    variant="primary"
                                    size="md"
                                    disabled={!selectedTimezone}
                                >
                                    Add Clock
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Meeting Planner Modal */}
                {showMeetingPlanner && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                        onClick={() => setShowMeetingPlanner(false)}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="meeting-planner-title"
                    >
                        <div
                            className={`w-full max-w-lg p-6 rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 id="meeting-planner-title" className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                📅 Meeting Time Converter
                            </h2>
                            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Pick a time in one timezone to see it across all your clocks.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Time
                                    </label>
                                    <input
                                        type="time"
                                        value={meetingTime}
                                        onChange={e => setMeetingTime(e.target.value)}
                                        className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 ${inputClasses}`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Source Timezone
                                    </label>
                                    <select
                                        value={meetingSourceTz}
                                        onChange={e => setMeetingSourceTz(e.target.value)}
                                        className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 ${inputClasses}`}
                                    >
                                        <option value="">Select timezone...</option>
                                        {clocks.map(c => (
                                            <option key={c.id} value={c.timezone}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Converted times */}
                            {meetingTime && meetingSourceTz && (
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                        Meeting Time Across Zones:
                                    </h3>
                                    <div className="space-y-2">
                                        {clocks.map(clock => {
                                            // Create a date with the selected time in source timezone
                                            const [hours, minutes] = meetingTime.split(':').map(Number);
                                            const now = new Date();
                                            // Get source timezone offset calculation
                                            const sourceFormatter = new Intl.DateTimeFormat('en-US', {
                                                timeZone: meetingSourceTz,
                                                hour: 'numeric', minute: 'numeric', hour12: false
                                            });
                                            const targetFormatter = new Intl.DateTimeFormat('en-US', {
                                                timeZone: clock.timezone,
                                                hour: 'numeric', minute: 'numeric', hour12: !use24Hour
                                            });
                                            // Create a reference date and calculate difference
                                            const refDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
                                            const display = formatTimeForTimezone(refDate, clock.timezone, use24Hour);

                                            return (
                                                <div key={clock.id} className={`flex justify-between items-center py-1 ${display.isWorkingHour ? '' : 'opacity-60'
                                                    }`}>
                                                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                        {clock.label}
                                                    </span>
                                                    <span className={`font-mono font-medium ${display.isWorkingHour
                                                        ? 'text-green-500'
                                                        : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                        }`}>
                                                        {targetFormatter.format(refDate)}
                                                        {display.isWorkingHour && ' ✓'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-4">
                                <Button onClick={() => setShowMeetingPlanner(false)} variant="ghost" size="md"
                                    className={isDarkMode ? 'text-gray-300 hover:bg-gray-700' : ''}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Best Meeting Time Modal */}
                {showBestTimeModal && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                        onClick={() => setShowBestTimeModal(false)}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="best-time-title"
                    >
                        <div
                            className={`w-full max-w-lg p-6 rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 id="best-time-title" className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                ✅ Best Meeting Times
                            </h2>
                            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Find overlapping working hours (9 AM - 6 PM) across all your clocks.
                            </p>

                            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <div className="space-y-3">
                                    {/* Calculate overlapping hours */}
                                    {(() => {
                                        const overlappingSlots: { hour: number; displays: { label: string; time: string; isWorking: boolean }[] }[] = [];

                                        // Check each hour of IST (or first clock's timezone)
                                        const baseTimezone = clocks[0]?.timezone || 'Asia/Kolkata';

                                        for (let hour = 0; hour < 24; hour++) {
                                            const testDate = new Date();
                                            testDate.setHours(hour, 0, 0, 0);

                                            const displays = clocks.map(clock => {
                                                const formatter = new Intl.DateTimeFormat('en-US', {
                                                    timeZone: clock.timezone,
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                    hour12: !use24Hour
                                                });
                                                const hourFormatter = new Intl.DateTimeFormat('en-US', {
                                                    timeZone: clock.timezone,
                                                    hour: 'numeric',
                                                    hour12: false
                                                });
                                                const tzHour = parseInt(hourFormatter.format(testDate), 10);
                                                const isWorking = tzHour >= 9 && tzHour < 18;

                                                return {
                                                    label: clock.label,
                                                    time: formatter.format(testDate),
                                                    isWorking
                                                };
                                            });

                                            const allWorking = displays.every(d => d.isWorking);
                                            if (allWorking) {
                                                overlappingSlots.push({ hour, displays });
                                            }
                                        }

                                        if (overlappingSlots.length === 0) {
                                            return (
                                                <div className={`text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    <p className="text-lg mb-2">😔 No overlapping working hours found</p>
                                                    <p className="text-sm">The time zones you selected don&apos;t have common 9 AM - 6 PM hours.</p>
                                                </div>
                                            );
                                        }

                                        return (
                                            <>
                                                <p className={`text-sm mb-3 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                                    ✓ Found {overlappingSlots.length} overlapping hour(s)
                                                </p>
                                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                                    {overlappingSlots.slice(0, 5).map((slot, idx) => (
                                                        <div key={idx} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'} border ${isDarkMode ? 'border-gray-500' : 'border-gray-200'}`}>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {slot.displays.map((d, i) => (
                                                                    <div key={i} className="flex justify-between text-sm">
                                                                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{d.label}:</span>
                                                                        <span className="font-mono font-medium text-green-500">{d.time}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {overlappingSlots.length > 5 && (
                                                        <p className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            + {overlappingSlots.length - 5} more slots
                                                        </p>
                                                    )}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <Button onClick={() => setShowBestTimeModal(false)} variant="ghost" size="md"
                                    className={isDarkMode ? 'text-gray-300 hover:bg-gray-700' : ''}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Features Info Box */}
            <div className={`mt-6 p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'}`}>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-blue-900'}`}>Features:</h3>
                <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-blue-800'}`}>
                    <li>• <strong>Live Updates:</strong> Times update every second with DST-safe conversions</li>
                    <li>• <strong>Day/Night:</strong> Sun ☀️ and moon 🌙 icons show local day/night status</li>
                    <li>• <strong>Plan Meeting:</strong> Convert a specific time across all your time zones</li>
                    <li>• <strong>Best Time:</strong> Find overlapping working hours (9 AM - 6 PM) for meetings</li>
                    <li>• <strong>Working Hours:</strong> Green indicator shows when it&apos;s business hours</li>
                    <li>• <strong>Drag &amp; Reorder:</strong> Arrange clocks in your preferred order</li>
                </ul>
            </div>
        </ToolLayout >
    );
}
