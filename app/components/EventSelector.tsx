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
    <div className="mb-4">
      <label htmlFor="event-select" className="block text-sm font-medium mb-2">
        Select an Event:
      </label>
      <select
        id="event-select"
        value={selectedEvent}
        onChange={handleEventChange}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">-- Choose an event --</option>
        {events.map((event) => (
          <option key={event.id} value={event.id.toString()}>
            {event.title}
          </option>
        ))}
      </select>
      
      {events.length === 0 && (
        <p className="text-sm mt-2">
          No events found with &quot;recurring&quot; or &quot;template&quot; tags.
        </p>
      )}
    </div>
  );
};

export default EventSelector;
