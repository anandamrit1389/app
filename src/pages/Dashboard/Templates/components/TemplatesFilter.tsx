import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';

interface IProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  mobile?: boolean;
}

const filters = [
  {
    label: 'All',
    value: 'all',
  },
  // {
  //   label: "Start ups",
  //   value: "start",
  // },
  // {
  //   label: "Pitch",
  //   value: "pitch",
  // },
  // {
  //   label: "Business",
  //   value: "business",
  // },
];

const TemplatesFilter = ({ activeFilter, setActiveFilter, mobile }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });
  
  return (
    <div className="flex gap-2">
      {filters.map((f) => (
        <BaseButton
          classNames={mobile ? 'px-2 font-[500]' : ''}
          key={f.value}
          variant="outline"
          active={activeFilter === f.value}
          onClick={() => setActiveFilter(f.value)}
        >
          {t(f.value)}
        </BaseButton>
      ))}
    </div>
  );
};

export default TemplatesFilter;
