import { ISlideVariation } from '../../interfaces/ISlideVariation';

export const getSlideVariation = (variations: ISlideVariation[], variation: string) => {
  return variations.find((v) => v.type === variation);
};
