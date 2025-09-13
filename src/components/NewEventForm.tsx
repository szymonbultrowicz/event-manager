'use client';

interface NewEventFormProps {
  startDate: string;
  startTime: string;
  endTime: string;
  onStartDateChange: (date: string) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  onDateChange: (date: string) => void;
  isPublic: boolean;
  onPublicChange: (isPublic: boolean) => void;
}

const NewEventForm = ({
  startDate,
  startTime,
  endTime,
  onStartDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onConfirm,
  onCancel,
  onDateChange,
  isPublic,
  onPublicChange,
}: NewEventFormProps) => {
  return (
    <div className="space-y-6">
      {/* Date Section */}
      <div>
        <label htmlFor="event-date" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Event Date
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v5a2 2 0 002 2h4a2 2 0 002-2v-5m-6 0h8m-8 0V7a2 2 0 012-2h4a2 2 0 012 2v4m-8 0h8" />
            </svg>
          </div>
          <input
            type="date"
            id="event-date"
            value={startDate}
            onChange={(e) => onDateChange ? onDateChange(e.target.value) : onStartDateChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 transition-colors duration-200"
          />
        </div>
      </div>

      {/* Time Section */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
          <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mr-3"></div>
          Event Time
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="start-time" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Start Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                type="time"
                id="start-time"
                value={startTime}
                onChange={(e) => onStartTimeChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 text-gray-900 dark:text-gray-100 transition-colors duration-200"
              />
            </div>
          </div>
          <div>
            <label htmlFor="end-time" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              End Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                type="time"
                id="end-time"
                value={endTime}
                onChange={(e) => onEndTimeChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 text-gray-900 dark:text-gray-100 transition-colors duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Visibility Section */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
        <h4 className="text-sm font-semibold text-purple-800 dark:text-purple-300 mb-3 flex items-center">
          <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full mr-3"></div>
          Event Visibility
        </h4>
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => onPublicChange(e.target.checked)}
              className="sr-only"
            />
            <div className={`block w-14 h-8 rounded-full transition-colors duration-200 ${
              isPublic 
                ? 'bg-purple-500 dark:bg-purple-400' 
                : 'bg-gray-300 dark:bg-gray-600'
            }`}>
              <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 transform ${
                isPublic ? 'translate-x-6' : 'translate-x-0'
              }`}></div>
            </div>
          </div>
          <div className="ml-3">
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              {isPublic ? 'Public Event' : 'Private Event'}
            </span>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              {isPublic 
                ? 'Event will be visible to all visitors' 
                : 'Event will only be visible to logged-in users'
              }
            </p>
          </div>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
        <button
          onClick={onConfirm}
          className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-opacity-50"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Create Event
        </button>
        <button
          onClick={onCancel}
          className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-opacity-50"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NewEventForm;
