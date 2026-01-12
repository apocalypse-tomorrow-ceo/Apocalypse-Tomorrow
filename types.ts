
export enum EventType {
  CONFLICT = 'CONFLICT',
  PROTEST = 'PROTEST',
  RIOT = 'RIOT',
  MILITARY_MOVE = 'MILITARY_MOVE',
  STRIKE = 'STRIKE'
}

export interface Territory {
  id: string;
  name: string;
  color: string;
  coordinates: [number, number][][]; // Array of polygons (array of lat-lng pairs)
}

export interface ConflictEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  lat: number;
  lng: number;
  timestamp: string;
  sourceUrl?: string;
  sourceCategory: 'mainstream' | 'independent';
  sourceAlignment?: string;
  locationName: string;
}

export interface MonitoredSource {
  name: string;
  url: string;
  alignment: string;
}

export interface Region {
  id: string;
  name: string;
  lat: number;
  lng: number;
  zoom: number;
  description: string;
  monitoredSources?: MonitoredSource[];
  territories?: Territory[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  events: ConflictEvent[];
  summary: string;
  sources: GroundingSource[];
}
