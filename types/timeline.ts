export interface TimelineMedia {
  id: string;
  type: "image" | "video";
  url: string;
  alt: string;
}

export interface TimelineCoordinates {
  lat: number;
  lng: number;
}

export interface TimelineEvent {
  id: string;
  title: string;
  commitTag: string;
  date: string;
  location: string;
  coordinates: TimelineCoordinates;
  patchNotes: string[];
  media: TimelineMedia[];
}
