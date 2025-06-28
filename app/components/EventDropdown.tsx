'use client';

import { useState, useEffect } from 'react';
import CredentialsInput from './CredentialsInput';
import EventSelector from './EventSelector';

interface EventTag {
  id: number;
  name: string;
  slug: string;
}

interface Event {
  id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  url?: string;
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

  const handleConfirmCopy = () => {
    // Here you would typically make an API call to create a new event
    // For now, we'll just show an alert with the new event details
    const newEvent = {
      ...selectedEventDetails,
      start_date: `${newStartDate}T${newStartTime}:00`,
      end_date: `${newEndDate}T${newEndTime}:00`,
      title: `${selectedEventDetails?.title} (Copy)`
    };
    
    alert(`Event would be copied with:\nTitle: ${newEvent.title}\nStart: ${newEvent.start_date}\nEnd: ${newEvent.end_date}`);
    setShowDateTimeSelector(false);
  };

  const selectedEventDetails = events.find(event => event.id.toString() === selectedEvent);

  if (loading) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
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
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="font-semibold text-gray-800 mb-2">Event Details</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-600">Title:</span>
              <span className="ml-2 text-gray-800">{selectedEventDetails.title}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Start Date:</span>
              <span className="ml-2 text-gray-800">
                {new Date(selectedEventDetails.start_date).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">End Date:</span>
              <span className="ml-2 text-gray-800">
                {new Date(selectedEventDetails.end_date).toLocaleDateString()}
              </span>
            </div>
            {selectedEventDetails.description && (
              <div>
                <span className="font-medium text-gray-600">Description:</span>
                <div 
                  className="ml-2 text-gray-800 mt-1"
                  dangerouslySetInnerHTML={{ __html: selectedEventDetails.description }}
                />
              </div>
            )}
            {selectedEventDetails.url && (
              <div>
                <span className="font-medium text-gray-600">URL:</span>
                <a 
                  href={selectedEventDetails.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:text-blue-800 underline"
                >
                  View Event
                </a>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <button
              onClick={handleCopyEvent}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Copy Event
            </button>
          </div>
        </div>
      )}

      {showDateTimeSelector && selectedEventDetails && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-semibold text-gray-800 mb-4">Set New Event Dates</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="start-date"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  id="start-time"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="end-date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  id="end-time"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleConfirmCopy}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Confirm Copy
            </button>
            <button
              onClick={handleCancelCopy}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDropdown;
