'use client';

import EventSelector from './EventSelector';
import EventDetails from './EventDetails';
import { Event } from '../types/event.types';

interface EventDropdownProps {
  events: Event[];
  selectedEvent: string;
  onEventChange: (eventId: string) => void;
  onCopyEvent: () => void;
  disabled?: boolean;
}

const EventDropdown = ({ 
  events, 
  selectedEvent, 
  onEventChange, 
  onCopyEvent, 
  disabled = false 
}: EventDropdownProps) => {
  const selectedEventDetails = events.find(event => event.id.toString() === selectedEvent);

  return (
    <div>
      <EventSelector
        events={events}
        selectedEvent={selectedEvent}
        onEventChange={onEventChange}
        disabled={disabled}
      />

      {selectedEventDetails && (
        <EventDetails
          event={selectedEventDetails}
          onCopy={onCopyEvent}
        />
      )}
    </div>
  );
};

export default EventDropdown;
