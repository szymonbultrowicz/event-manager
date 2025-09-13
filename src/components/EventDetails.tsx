import React from 'react';
import { Event } from '../types/event.types';

interface EventDetailsProps {
  event: Event;
  onCopy: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onCopy }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <h3 className="text-xl font-bold text-white">Event Details</h3>
      </div>

      <div className="p-6">
        {/* Title */}
        <div className="mb-6">
          <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
            {event.title}
          </h4>
        </div>

        {/* Date and Time Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full mr-3"></div>
              <span className="text-sm font-semibold text-green-800 dark:text-green-300 uppercase tracking-wide">Start</span>
            </div>
            <div className="text-green-900 dark:text-green-100">
              <div className="font-semibold">{formatDate(event.start_date)}</div>
              <div className="text-sm opacity-75">{formatTime(event.start_date)}</div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full mr-3"></div>
              <span className="text-sm font-semibold text-red-800 dark:text-red-300 uppercase tracking-wide">End</span>
            </div>
            <div className="text-red-900 dark:text-red-100">
              <div className="font-semibold">{formatDate(event.end_date)}</div>
              <div className="text-sm opacity-75">{formatTime(event.end_date)}</div>
            </div>
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <div className="mb-6">
            <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mr-3"></div>
              Description
            </h5>
            <div 
              className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
          </div>
        )}

        {/* URL */}
        {event.url && (
          <div className="mb-6">
            <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full mr-3"></div>
              Event Link
            </h5>
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200 rounded-lg transition-colors duration-200 border border-purple-200 dark:border-purple-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Event
            </a>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={onCopy}
            className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-opacity-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
