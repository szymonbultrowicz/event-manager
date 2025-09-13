import { useState, useEffect } from 'react';
import { Event, EventTag, ApiResponse } from '../types/event.types';

interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  error: string | null;
  isAuthError: boolean;
}

export const useEvents = (username: string, password: string): UseEventsReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);

  const baseUrl = 'https://skos.studio/wp-json';

  useEffect(() => {
    if (!username || !password) {
      setLoading(false);
      setError(null);
      setIsAuthError(false);
      return;
    }

    const auth = `${username}:${password}`;
    const authHeader = `Basic ${btoa(auth)}`;

    const fetchEventsWithTags = async () => {
      try {
        setLoading(true);
        setError(null);
        setIsAuthError(false);

        // First, fetch all event tags
        const tagsResponse = await fetch(`${baseUrl}/tribe/events/v1/tags`, {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          },
        });

        if (!tagsResponse.ok) {
          if (tagsResponse.status === 401) {
            setIsAuthError(true);
            throw new Error('Invalid credentials. Please check your username and password.');
          }
          throw new Error(`Failed to fetch tags: ${tagsResponse.status}`);
        }

        const tagsData: ApiResponse<EventTag> = await tagsResponse.json();
        const tags = tagsData.tags || [];

        // Find the IDs of the "template" tag
        const templateTag = tags.find(tag => 
          tag.name.toLowerCase() === 'template' || tag.slug === 'template'
        );

        if (!templateTag) {
          throw new Error('No "template" tag found');
        }

        // Build tag IDs array
        const tagIds: number[] = [];
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
          if (eventsResponse.status === 401) {
            setIsAuthError(true);
            throw new Error('Invalid credentials. Please check your username and password.');
          }
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
  }, [username, password, baseUrl]);

  return { events, loading, error, isAuthError };
};
