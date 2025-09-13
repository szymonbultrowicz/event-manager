import React from 'react';
import { Event } from '../types/event.types';

interface EventDetailsProps {
  event: Event;
  onCopy: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onCopy }) => {
  return (
    <div className="mt-6 p-4 rounded-md">
      <h3 className="font-semibold mb-2">Event Details</h3>
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">Title:</span>
          <span className="ml-2">{event.title}</span>
        </div>
        <div>
          <span className="font-medium">Start Date:</span>
          <span className="ml-2">
            {new Date(event.start_date).toLocaleDateString()}
          </span>
        </div>
        <div>
          <span className="font-medium">End Date:</span>
          <span className="ml-2">
            {new Date(event.end_date).toLocaleDateString()}
          </span>
        </div>
        {event.description && (
          <div>
            <span className="font-medium">Description:</span>
            <div
              className="ml-2 mt-1"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
          </div>
        )}
        {event.url && (
          <div>
            <span className="font-medium">URL:</span>
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 underline"
            >
              View Event
            </a>
          </div>
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={onCopy}
          className="px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Copy Event
        </button>
      </div>
    </div>
  );
};

export default EventDetails;
