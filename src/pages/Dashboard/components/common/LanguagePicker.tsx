import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { DropdownMenu, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { reversedLanguageMap } from '@/helpers/constants/languages.const';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';

type IProps = {
  languages: string[];
  onSelect: (lang: string) => void;
  label: string;
  selected?: string;
};

export const LanguagePicker = ({ languages, onSelect, label }: IProps) => {
  if (languages.length <= 2) {
    return languages.map((lang, index) => (
      <div key={lang} className="flex items-center">
        <div
          onClick={() => onSelect(lang)}
          className="cursor-pointer text-[14px] capitalize text-darkText opacity-50"
        >
          {reversedLanguageMap[lang]}
        </div>
        {index < languages.length - 1 && <span className="mx-2 text-darkText opacity-30">|</span>}
      </div>
    ));
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <div
          className={`cursor-pointer p-0 text-[14px] text-darkText opacity-50 transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent`}
        >
          {languages.length} {label}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex w-[200px] flex-col gap-1 p-2">
        {languages.map((lang) => {
          return (
            <BaseButton
              key={lang}
              variant="ghost"
              onClick={() => onSelect(lang)}
              classNames={`p-2 w-full justify-start items-center font-normal text-[14px] capitalize`}
            >
              {lang}
            </BaseButton>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
