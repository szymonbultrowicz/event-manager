// Types for the Event Management system

export interface EventTag {
  id: number;
  name: string;
  slug: string;
}

export interface Event {
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
  tags?: { id: number }[];
  venue?: { id: number };
  organizer?: { id: number };
  global_id?: string;
  global_id_lineage?: string[];
}

export interface ApiResponse<T> {
  events?: T[];
  tags?: T[];
}

export interface EventCopyData {
  newStartDate: string;
  newStartTime: string;
  newEndDate: string;
  newEndTime: string;
  isPublic: boolean;
}
