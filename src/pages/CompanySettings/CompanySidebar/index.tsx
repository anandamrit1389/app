import { IProfileMenuItem } from '@/interfaces/IProfileSettings';
import { RefObject } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  items: IProfileMenuItem[];
  onSelect: (ref: RefObject<HTMLDivElement>) => void;
}

const ProfileSidebar = ({ onSelect, items }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'company' });

  return (
    <div className="mr-8 md:basis-4/12">
      <div className="sticky h-auto rounded bg-white p-4">
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              onClick={() => onSelect(item.ref)}
              className="mb-[10px] cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-darkText last:mb-0 hover:bg-[#F6F7F8] active:bg-lightGreyHover"
            >
              {t(item.titleKey)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfileSidebar;
