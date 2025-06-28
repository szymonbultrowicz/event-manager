'use client';

import { useState, useEffect } from 'react';
import CredentialsInput from './CredentialsInput';
import EventSelector from './EventSelector';
import DateTimeSelector from './DateTimeSelector';

interface EventTag {
  id: number;
  name: string;
  slug: string;
}

interface Event {
  id: number;
  title: string;
  slug: string;
  description?: string;
  start_date: string;
  end_date: string;
  url?: string;
  image?: {
    id: number;
    url: string;
  };
  tags?: { id: number }[]; // Add tags property
  venue?: { id: number }; // Add venue property
  organizer?: { id: number }; // Add organizer property
  global_id?: string; // Add global_id property
  global_id_lineage?: string[]; // Add global_id_lineage property
}

interface ApiResponse<T> {
  events?: T[];
  tags?: T[];
}

const EventDropdown = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDateTimeSelector, setShowDateTimeSelector] = useState(false);
  const [newStartDate, setNewStartDate] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // API configuration
  const baseUrl = 'https://skos.studio/wp-json';

  // Load credentials from localStorage on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('skos-username');
    const savedPassword = localStorage.getItem('skos-password');
    
    if (savedUsername) setUsername(savedUsername);
    if (savedPassword) setPassword(savedPassword);
  }, []);

  // Save credentials to localStorage when they change
  useEffect(() => {
    if (username) {
      localStorage.setItem('skos-username', username);
    }
  }, [username]);

  useEffect(() => {
    if (password) {
      localStorage.setItem('skos-password', password);
    }
  }, [password]);

  useEffect(() => {
    if (!username || !password) {
      setLoading(false);
      return;
    }

    const auth = `${username}:${password}`;
    const authHeader = `Basic ${btoa(auth)}`;
    const fetchEventsWithTags = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, fetch all event tags
        const tagsResponse = await fetch(`${baseUrl}/tribe/events/v1/tags`, {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          },
        });

        if (!tagsResponse.ok) {
          throw new Error(`Failed to fetch tags: ${tagsResponse.status}`);
        }

        const tagsData: ApiResponse<EventTag> = await tagsResponse.json();
        const tags = tagsData.tags || [];

        // Find the IDs of "recurring" and "template" tags
        const recurringTag = tags.find(tag => 
          tag.name.toLowerCase() === 'recurring' || tag.slug === 'recurring'
        );
        const templateTag = tags.find(tag => 
          tag.name.toLowerCase() === 'template' || tag.slug === 'template'
        );

        if (!recurringTag && !templateTag) {
          throw new Error('Neither "recurring" nor "template" tags found');
        }

        // Build tag IDs array
        const tagIds: number[] = [];
        if (recurringTag) tagIds.push(recurringTag.id);
        if (templateTag) tagIds.push(templateTag.id);

        // Fetch events filtered by the found tag IDs
        const eventsUrl = `${baseUrl}/tribe/events/v1/events?starts_after=1980-01-01&tags=${tagIds.join(',')}`;
        const eventsResponse = await fetch(eventsUrl, {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          },
        });

        if (!eventsResponse.ok) {
          throw new Error(`Failed to fetch events: ${eventsResponse.status}`);
        }

        const eventsData: ApiResponse<Event> = await eventsResponse.json();
        const fetchedEvents = eventsData.events || [];

        setEvents(fetchedEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventsWithTags();
  }, [username, password]);

  const handleCopyEvent = () => {
    setShowDateTimeSelector(true);
    // Pre-populate with current event dates
    if (selectedEventDetails) {
      const startDate = new Date(selectedEventDetails.start_date);
      const endDate = new Date(selectedEventDetails.end_date);
      
      setNewStartDate(startDate.toISOString().split('T')[0]);
      setNewStartTime(startDate.toTimeString().split(' ')[0].slice(0, 5));
      setNewEndDate(endDate.toISOString().split('T')[0]);
      setNewEndTime(endDate.toTimeString().split(' ')[0].slice(0, 5));
    }
  };

  const handleCancelCopy = () => {
    setShowDateTimeSelector(false);
    setNewStartDate('');
    setNewStartTime('');
    setNewEndDate('');
    setNewEndTime('');
  };

  const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
  };

  const handleConfirmCopy = async () => {
    if (!selectedEventDetails) return;

    const newStartDateTime = `${newStartDate}T${newStartTime}:00`;
    const newEndDateTime = `${newEndDate}T${newEndTime}:00`;
    const slugWithDate = `${selectedEventDetails.slug.replace(/\s+/g, '-')}-${newStartDate}`;

    const eventDetailsWithoutIds = omit(selectedEventDetails, ['id', 'global_id', 'global_id_lineage']); // Exclude id, global_id, and global_id_lineage

    const newEventPayload = {
      ...eventDetailsWithoutIds, // Copy all other properties from the selected event
      title: `${selectedEventDetails.title}`,
      start_date: newStartDateTime,
      end_date: newEndDateTime,
      status: 'private',
      slug: slugWithDate, // Use the new slug with date
      image: selectedEventDetails.image?.url, // Preserve image if available
      tags: selectedEventDetails.tags?.map((tag: { id: number }) => tag.id) || [], // Pass only tag IDs
      venue: selectedEventDetails.venue?.id || null, // Pass only venue ID
      organizer: selectedEventDetails.organizer?.id || null, // Pass only organizer ID
    };

    try {
      const auth = `${username}:${password}`;
      const authHeader = `Basic ${btoa(auth)}`;

      const response = await fetch(`${baseUrl}/tribe/events/v1/events`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEventPayload),
      });

      if (!response.ok) {
        throw new Error(`Failed to create event: ${response.status}`);
      }

      const createdEvent = await response.json();
      alert(`Event successfully copied!\nTitle: ${createdEvent.title}\nStart: ${createdEvent.start_date}\nEnd: ${createdEvent.end_date}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while copying the event');
      console.error('Error copying event:', err);
    } finally {
      setShowDateTimeSelector(false);
    }
  };

  const selectedEventDetails = events.find(event => event.id.toString() === selectedEvent);

  if (loading) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="animate-pulse">
          <div className="h-4 rounded w-1/4 mb-4"></div>
          <div className="h-10 rounded mb-4"></div>
          <div className="h-4 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium">Error</h3>
            <div className="mt-2 text-sm">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">
        SKOS Events (Recurring & Template)
      </h2>
      
      {/* Credentials Section */}
      <CredentialsInput
        username={username}
        password={password}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
      />
      
      <EventSelector
        events={events}
        selectedEvent={selectedEvent}
        onEventChange={setSelectedEvent}
        disabled={!username || !password}
      />

      {selectedEventDetails && (
        <div className="mt-6 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Event Details</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Title:</span>
              <span className="ml-2">{selectedEventDetails.title}</span>
            </div>
            <div>
              <span className="font-medium">Start Date:</span>
              <span className="ml-2">
                {new Date(selectedEventDetails.start_date).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="font-medium">End Date:</span>
              <span className="ml-2">
                {new Date(selectedEventDetails.end_date).toLocaleDateString()}
              </span>
            </div>
            {selectedEventDetails.description && (
              <div>
                <span className="font-medium">Description:</span>
                <div 
                  className="ml-2 mt-1"
                  dangerouslySetInnerHTML={{ __html: selectedEventDetails.description }}
                />
              </div>
            )}
            {selectedEventDetails.url && (
              <div>
                <span className="font-medium">URL:</span>
                <a 
                  href={selectedEventDetails.url}
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
              onClick={handleCopyEvent}
              className="px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Copy Event
            </button>
          </div>
        </div>
      )}

      {showDateTimeSelector && selectedEventDetails && (
        <DateTimeSelector
          startDate={newStartDate}
          startTime={newStartTime}
          endDate={newEndDate}
          endTime={newEndTime}
          onStartDateChange={setNewStartDate}
          onStartTimeChange={setNewStartTime}
          onEndDateChange={setNewEndDate}
          onEndTimeChange={setNewEndTime}
          onConfirm={handleConfirmCopy}
          onCancel={handleCancelCopy}
        />
      )}
    </div>
  );
};

export default EventDropdown;
