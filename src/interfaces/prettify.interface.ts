import { IPrettifyOutlineSlide } from './ISlides';

export interface Stage {
  label: string;
  delay: number;
}

export enum ProgressState {
  PREPARING,
  PROCESSING,
  FINALISING,
}

export interface DemoPrettifyOutlineResponse {
  slidesOutline: IPrettifyOutlineSlide[];
  registrationId: string;
}
