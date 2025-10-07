import { RefObject } from 'react';

export interface IProfileMenuItem {
  id: number;
  titleKey: string;
  ref: RefObject<HTMLDivElement>;
}
