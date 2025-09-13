import { useState, useEffect } from 'react';

const useEventApi = (username: string, password: string) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const tagsResponse = await fetch('https://skos.studio/wp-json/tribe/events/v1/tags', {
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
          },
        });

        if (!tagsResponse.ok) {
          throw new Error(`Failed to fetch tags: ${tagsResponse.status}`);
        }

        const tagsData = await tagsResponse.json();
        const tags = tagsData.tags || [];
        const templateTag = tags.find((tag: { name: string; slug: string }) => tag.name.toLowerCase() === 'template' || tag.slug === 'template');

        if (!templateTag) {
          throw new Error('No "template" tag found');
        }

        const eventsResponse = await fetch(
          `https://skos.studio/wp-json/tribe/events/v1/events?starts_after=1980-01-01&tags=${templateTag.id}`,
          {
            headers: {
              Authorization: authHeader,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!eventsResponse.ok) {
          throw new Error(`Failed to fetch events: ${eventsResponse.status}`);
        }

        const eventsData = await eventsResponse.json();
        setEvents(eventsData.events || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEventsWithTags();
  }, [username, password]);

  return { events, loading, error };
};

export default useEventApi;
