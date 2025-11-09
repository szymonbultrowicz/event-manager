import { Event, EventCopyData } from '../types/event.types';

const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

export const copyEventService = async (
  selectedEvent: Event,
  copyData: EventCopyData,
  username: string,
  password: string
): Promise<Event> => {
  const baseUrl = 'https://skos.studio/wp-json';
  
  const newStartDateTime = `${copyData.newStartDate}T${copyData.newStartTime}:00`;
  const newEndDateTime = `${copyData.newEndDate}T${copyData.newEndTime}:00`;
  const slugWithDate = `${selectedEvent.slug.replace(/\s+/g, '-')}-${copyData.newStartDate}`;

  const eventDetailsWithoutIds = omit(selectedEvent, ['id', 'global_id', 'global_id_lineage', 'organizer', 'venue', 'tags', 'image']);

  const newEventPayload = {
    ...eventDetailsWithoutIds,
    title: `${selectedEvent.title}`,
    start_date: newStartDateTime,
    end_date: newEndDateTime,
    status: copyData.isPublic ? 'publish' : 'private',
    slug: slugWithDate,
    image: selectedEvent.image?.url,
    tags: selectedEvent.tags
      ?.filter((tag: { id: number; name?: string; slug?: string }) => 
        tag.slug !== 'template' && tag.name?.toLowerCase() !== 'template'
      )
      .map((tag: { id: number }) => tag.id) || [],
    venue: selectedEvent.venue?.id || null,
    organizer: selectedEvent.organizer?.id || null,
  };

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
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || `Failed to create event: ${response.status}`;
    throw new Error(errorMessage);
  }

  return await response.json();
};
