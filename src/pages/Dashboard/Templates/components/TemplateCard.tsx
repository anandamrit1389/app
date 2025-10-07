import { ITemplatePreview } from '@/helpers/constants/presentation-templates.const';
import classNames from 'classnames';
import { LockKeyhole } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface IProps {
  template: ITemplatePreview;
  mobile?: boolean;
  hideNumber?: boolean;
}

const TemplateCard = ({ template, mobile, hideNumber }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });
  const hasFakeKey = template.key.includes('fake');

  return (
    <div className="relative w-full">
      {hasFakeKey && (
        <div className="absolute right-2 top-2 z-20 flex size-6 items-center justify-center rounded-full bg-black p-1 text-white">
          <LockKeyhole />
        </div>
      )}
      <div
        className={classNames(
          'transition-all outline rounded-md outline-1 outline-black/[0.08] object-cover mb-1.5',
          { 'hover:brightness-75': !hasFakeKey },
        )}
      >
        <img src={template.src} className="w-full rounded-md" />
      </div>
      <div className="">
        <p
          className={classNames('font-semibold line-clamp-2', {
            'text-[14px]': mobile,
          })}
        >
          {template.name}
        </p>
        {!hideNumber && (
          <p className="text-[10px] text-grey">
            {template.length} {t('slides')}
          </p>
        )}
      </div>
    </div>
  );
};

export default TemplateCard;
