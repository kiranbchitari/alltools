'use client';

import { useState } from 'react';
import ToolLayout from '@/app/components/ToolLayout';
import Button from '@/app/components/Button';
import { getTool } from '@/lib/tools';

export default function TimestampConverterPage() {
    const tool = getTool('timestamp-converter');
    const [timestamp, setTimestamp] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [humanReadable, setHumanReadable] = useState('');

    const timestampToDate = () => {
        try {
            const ts = parseInt(timestamp);
            if (isNaN(ts)) {
                setHumanReadable('Invalid timestamp');
                return;
            }
            const date = new Date(ts * 1000);
            setHumanReadable(date.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
            }));
        } catch (e) {
            setHumanReadable('Error converting timestamp');
        }
    };

    const dateToTimestamp = () => {
        try {
            const date = new Date(dateTime);
            if (isNaN(date.getTime())) {
                setTimestamp('Invalid date');
                return;
            }
            setTimestamp(Math.floor(date.getTime() / 1000).toString());
        } catch (e) {
            setTimestamp('Error converting date');
        }
    };

    const getCurrentTimestamp = () => {
        const now = Math.floor(Date.now() / 1000);
        setTimestamp(now.toString());
        const date = new Date(now * 1000);
        setHumanReadable(date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        }));
    };

    if (!tool) return null;

    return (
        <ToolLayout title={tool.title} description={tool.description} toolKey="timestamp-converter">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Timestamp to Date */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Unix Timestamp</h2>
                    <input
                        type="text"
                        value={timestamp}
                        onChange={(e) => setTimestamp(e.target.value)}
                        placeholder="Enter Unix timestamp (e.g., 1700000000)"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                        aria-label="Unix timestamp input"
                    />
                    <Button onClick={timestampToDate} variant="primary" size="md" fullWidth aria-label="Convert timestamp to date">
                        Convert to Date
                    </Button>
                    {humanReadable && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm font-medium text-green-900">Human Readable:</p>
                            <p className="text-sm text-green-800 mt-1">{humanReadable}</p>
                        </div>
                    )}
                </div>

                {/* Date to Timestamp */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Date & Time</h2>
                    <input
                        type="datetime-local"
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                        aria-label="Date time input"
                    />
                    <Button onClick={dateToTimestamp} variant="secondary" size="md" fullWidth aria-label="Convert date to timestamp">
                        Convert to Timestamp
                    </Button>
                </div>
            </div>

            <div className="mt-6">
                <Button onClick={getCurrentTimestamp} variant="success" size="md" aria-label="Get current timestamp">
                    Get Current Timestamp
                </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Features:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Timestamp to Date:</strong> Convert Unix timestamps to human-readable dates</li>
                    <li>• <strong>Date to Timestamp:</strong> Convert dates to Unix timestamps</li>
                    <li>• <strong>Current Time:</strong> Get the current Unix timestamp instantly</li>
                    <li>• Supports multiple date formats and timezones</li>
                </ul>
            </div>
        </ToolLayout>
    );
}
