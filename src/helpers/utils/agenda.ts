import { IContent, ISlide } from '@/interfaces/ISlides';
import { v4 as uuidv4 } from 'uuid';

export const remapAgenda = (updatedSlides: ISlide[], isDoubleAgenda?: boolean): ISlide[] => {
  const offSet = isDoubleAgenda ? 2 : 1;
  const fromSlide =
    updatedSlides.findIndex((slide) => slide.slideType === 'content-slide') + offSet;

  const contentSlides = updatedSlides.filter((slide) => slide.slideType === 'content-slide');

  const otherSlides = updatedSlides.filter(
    (slide) =>
      slide.slideNumber > fromSlide &&
      slide.slideNumber !== updatedSlides.length &&
      slide.slideType !== 'content-slide',
  );

  const result = updatedSlides.map((s) => {
    if (s.slideType !== 'content-slide') {
      return s;
    }

    const contentIndex = contentSlides.findIndex((slide) => slide.id === s.id);
    let startIndex = 0;
    let endIndex = otherSlides.length;

    if (isDoubleAgenda) {
      if (contentIndex === 0) {
        endIndex = Math.min(16, otherSlides.length);
      } else if (contentIndex === 1) {
        startIndex = 16;
      }
    }

    return {
      ...s,
      content: otherSlides.slice(startIndex, endIndex).map((slide, index) => {
        return {
          id: s.content[index]?.id ?? uuidv4(),
          contentType: 'text',
          text: slide.title,
          slide: slide,
          sortOrder: index,
          textTranslations: slide.titleTranslations,
          titleTranslations: {},
          subtitleTranslations: {},
        } as IContent;
      }),
    };
  });

  return result;
};

export const updateTitleByAgenda = (slides: ISlide[], updSlide: ISlide): ISlide[] => {
  return slides.map((s: ISlide) => {
    return s.slideNumber <= 2
      ? s
      : ({
          ...s,
          title: updSlide.content[s.slideNumber - 3]?.text
            ? updSlide.content[s.slideNumber - 3].text
            : s.title,
        } as ISlide);
  });
};

export const getPageWithOffset = (slides: ISlide[] | null, slide: ISlide, showAgenda: boolean) => {
  if (showAgenda || !slides) {
    return slide.slideNumber;
  }

  const nextSlide = slides[slide.slideNumber];

  const agendaOffSet =
    slide.slideType === 'content-slide' && nextSlide?.slideType === 'content-slide' ? 2 : 1;

  const pageNumber = slide.slideNumber - agendaOffSet;

  return pageNumber;
};
