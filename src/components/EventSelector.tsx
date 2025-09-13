'use client';

interface Event {
  id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  url?: string;
}

interface EventSelectorProps {
  events: Event[];
  selectedEvent: string;
  onEventChange: (eventId: string) => void;
  disabled?: boolean;
}

const EventSelector = ({ 
  events, 
  selectedEvent, 
  onEventChange, 
  disabled = false 
}: EventSelectorProps) => {
  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onEventChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      <label htmlFor="event-select" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Select an Event Template:
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <select
          id="event-select"
          value={selectedEvent}
          onChange={handleEventChange}
          disabled={disabled}
          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200"
        >
          <option value="">-- Choose an event template --</option>
          {events.map((event) => (
            <option key={event.id} value={event.id.toString()}>
              {event.title}
            </option>
          ))}
        </select>
      </div>
      
      {events.length === 0 && !disabled && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-500 dark:text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
              No events found with "template" tag.
            </p>
          </div>
        </div>
      )}

      {disabled && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Please enter your credentials first to load events.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventSelector;
