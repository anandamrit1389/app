import TextSize from '@/assets/text-size.svg?react';
import { IFontSet } from '@/interfaces/font.interface';

interface IProp {
  fontSet: IFontSet | undefined | null;
}

const FontSetOption = ({ fontSet }: IProp) => {
  return (
    <div className={`flex items-center gap-3 text-[14px]`}>
      <TextSize />
      <div className="flex flex-col justify-start">
        <p style={{ fontFamily: fontSet?.header?.label }} className="font-semibold">
          {fontSet?.header?.label}
        </p>
        <p style={{ fontFamily: fontSet?.body?.label }} className="text-start">
          {fontSet?.body?.label}
        </p>
      </div>
    </div>
  );
};

export default FontSetOption;
