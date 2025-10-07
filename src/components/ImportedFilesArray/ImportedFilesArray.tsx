import { X } from 'lucide-react';
import Upload from '@/assets/upload-color.svg?react';
import MoreTextColor from '@/assets/more-text-color.svg?react';
import Url from '@/assets/url-color.svg?react';
import Drive from '@/assets/google-drive.svg?react';
import Loader from '@/assets/loader-color.svg?react';
import { useContext } from 'react';
import { PromptPageContext } from '@/contexts/PromptPage.context';
import { useTranslation } from 'react-i18next';
import BaseButton from '../CustomUI/BaseButton/BaseButton';
import useMobile from '@/hooks/useMobile';
import classNames from 'classnames';

const ImportedFilesArray = ({ loading }: { loading?: boolean }) => {
  const isMobile = useMobile();
  const { t } = useTranslation('translation', { keyPrefix: 'prompt' });

  const {
    importUrl,
    removeImportUrl,
    promptContext,
    removePromptContext,
    importDocument,
    importSlides,
    importSheet,
    documentLoading,
    removeImportedDoc,
    removeImportedSheet,
    removeImportedSlides,
  } = useContext(PromptPageContext);

  const wrapperClassnames =
    'flex items-center gap-2 bg-[#FFF0F0] hover:bg-[#FFE7E7] py-2 px-3 rounded-full text-[14px] outline outline-1 outline-[#F8D7D7]';

  if (
    (!importUrl || importUrl.length === 0) &&
    (!promptContext || promptContext.length === 0) &&
    (!importDocument || importDocument.length === 0) &&
    (!importSlides || importSlides.length === 0) &&
    (!importSheet || importSheet.length === 0)
  ) {
    return <></>;
  }

  return (
    <div
      className={classNames('transition-all flex gap-3 mt-6 ', {
        'justify-center w-11/12 flex-wrap': !isMobile,
        'justify-start w-full overflow-auto p-1': isMobile,
        'opacity-0': loading,
        'opacity-1': !loading,
      })}
    >
      {importUrl.map((u) => {
        return (
          <div
            className={`${wrapperClassnames} cursor-pointer`}
            key={u}
            onClick={() => removeImportUrl(u)}
          >
            <Url className="size-4" />
            {u?.replace('https://', '')?.split('/')?.[0]}
            <BaseButton variant="ghost" classNames="p-1 rounded-full">
              <X className="size-4" />
            </BaseButton>
          </div>
        );
      })}
      {promptContext.map((u) => {
        return (
          <div className={wrapperClassnames} key={u}>
            <MoreTextColor className="size-4" />
            <p className="line-clamp-1 text-ellipsis">{t('detailedInstructions')}</p>
            <BaseButton
              variant="ghost"
              classNames="p-1 rounded-full hover:bg-transparent active:bg-transparent"
              onClick={() => removePromptContext(u)}
            >
              <X className="size-4" />
            </BaseButton>
          </div>
        );
      })}
      {importDocument.map((d) => {
        return (
          <div className={wrapperClassnames} key={d.title}>
            {d.isLocal ? <Upload className="size-4" /> : <Drive className="size-4" />}
            <p className="line-clamp-1 w-32 overflow-hidden text-ellipsis">{d.title}</p>
            <BaseButton
              variant="ghost"
              classNames="p-1 rounded-full hover:bg-transparent active:bg-transparent"
              onClick={() => {
                removeImportedDoc(d.title);
              }}
            >
              <X className="size-4" />
            </BaseButton>
          </div>
        );
      })}
      {importSlides.map((d) => {
        return (
          <div className={wrapperClassnames} key={d.title}>
            {d.isLocal ? <Upload className="size-4" /> : <Drive className="size-4" />}
            <p className="line-clamp-1 w-32 overflow-hidden text-ellipsis">{d.title}</p>
            <BaseButton
              variant="ghost"
              classNames="p-1 rounded-full hover:bg-transparent active:bg-transparent"
              onClick={() => {
                removeImportedSlides(d.title);
              }}
            >
              <X className="size-4" />
            </BaseButton>
          </div>
        );
      })}
      {importSheet.map((d) => {
        return (
          <div className={wrapperClassnames} key={d.title}>
            {d.isLocal ? <Upload className="size-4" /> : <Drive className="size-4" />}
            <p className="line-clamp-1 w-32 overflow-hidden text-ellipsis">{d.title}</p>
            <BaseButton
              variant="ghost"
              classNames="p-1 rounded-full hover:bg-transparent active:bg-transparent"
              onClick={() => {
                removeImportedSheet(d.title);
              }}
            >
              <X className="size-4" />
            </BaseButton>
          </div>
        );
      })}
      {documentLoading && (
        <div className="flex items-center rounded-full bg-[#FFF0F0] p-2 text-[14px] outline outline-1 outline-[#F8D7D7]">
          <Loader className="size-6 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default ImportedFilesArray;
