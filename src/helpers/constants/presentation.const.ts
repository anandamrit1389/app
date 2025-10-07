import inspiration4 from '@/assets/inspiration4.png';
import inspiration5 from '@/assets/inspiration5.png';

export const DEFAULT_VOICE_ID = 'pMsXgVXv3BLzUgSXRplE';

export const PRESENTATION_URL = import.meta.env.VITE_TUTORIAL_PRESENTATION_URL;
export const GALLERY_IMAGES = [
  {
    src: inspiration4,
    alt: 'Inspiration 4',
    mobileStyles: 'h-[100px] w-[160px]',
    desktopStyles: 'h-[215px] w-[315px]',
  },
  {
    src: inspiration5,
    alt: 'Inspiration 5',
    mobileStyles: 'h-[90px] w-[160px]',
    desktopStyles: 'h-[175px] w-[315px]',
  },
];