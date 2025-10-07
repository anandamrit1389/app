import { ISlide } from '@/interfaces/ISlides';

export function getUserFirstName(name?: string) {
  if (!name) return '';
  return name.split(' ')[0];
}

export function getUserLastName(name?: string) {
  if (!name) return '';
  return name.split(' ')[1];
}

export function getTextFromSlide(slide: ISlide): string {
  const texts: string[] = [];

  const slideSubtitle = slide.subtitle ? slide.subtitle : '';

  if (!texts.includes(slide.title)) {
    texts.push(slide.title);
  }

  if (!texts.includes(slideSubtitle)) {
    texts.push(slideSubtitle);
  }

  slide.content.forEach((content) => {
    const contentTitle = content.title ? content.title : '';
    const contentSubtitle = content.subtitle ? content.subtitle : '';
    const contentText = content.text ? content.text : '';

    if (!texts.includes(contentTitle)) {
      texts.push(contentTitle);
    }

    if (!texts.includes(contentSubtitle)) {
      texts.push(contentSubtitle);
    }

    if (!texts.includes(contentText)) {
      texts.push(contentText);
    }
  });

  return texts.join('. ');
}

export function getAudioNameFromUrl(audioUrl: string) {
  const regex = /audios\/(audio_\d+\.mp3)/;
  const match = audioUrl.match(regex);

  if (match) {
    return match[0];
  }

  const regexOld = /(\d+\.mp3)/;
  const matchOld = audioUrl.match(regexOld);
  if (matchOld) {
    return matchOld[0];
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function groupDataByField<T extends Record<string, any>>(
  data: T[],
  field: keyof T,
): Record<string, T[]> {
  return data.reduce(
    (acc, item) => {
      const key = item[field];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
