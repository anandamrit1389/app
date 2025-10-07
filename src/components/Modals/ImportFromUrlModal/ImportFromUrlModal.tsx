import { useContext, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { PromptPageContext } from '@/contexts/PromptPage.context';
import Url from '@/assets/url.svg?react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import ArrowBack from '@/assets/arrow-back.svg?react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';

const ImportFromUrlModal = ({ mobile }: { mobile?: boolean }) => {
  const { showUrlModal, setShowUrlModal, addImportUrl } = useContext(PromptPageContext);
  const { t } = useTranslation('translation', { keyPrefix: 'modals' });

  const [url, setUrl] = useState<string>('');

  const onAction = () => {
    addImportUrl(url);
    setShowUrlModal(!showUrlModal);
    setUrl('');
  };

  const handleClose = () => {
    setShowUrlModal(!showUrlModal);
    setUrl('');
  };

  if (mobile) {
    return (
      <Sheet open={showUrlModal} onOpenChange={handleClose}>
        <SheetContent
          hideclose="true"
          className="flex size-full flex-col items-start justify-start"
        >
          <Button variant={'ghost'} className="ps-0" onClick={handleClose}>
            <ArrowBack />
          </Button>
          <SheetTitle className="w-full text-center text-[24px] font-bold">
            {t('importFromURL')}
          </SheetTitle>
          <p className="mb-4 text-center">{t('importFromURLDescription')}</p>
          <div className="relative w-full">
            <input
              placeholder="http://www.example.com/"
              className={`w-full rounded-sm p-3 pl-10 text-[14px] outline outline-1 outline-lightGreyPress`}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
            />
            <Url className="absolute left-2 top-3" />
          </div>
          <div className="flex w-full justify-end gap-x-4">
            <BaseButton variant="default" onClick={onAction} classNames="text-white w-full">
              {t('import')}
            </BaseButton>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={showUrlModal} onOpenChange={handleClose}>
      <DialogContent className="max-w-[552px] gap-0 px-6 py-10">
        <DialogTitle className="mb-2 text-center text-[24px] font-bold">
          {t('importFromURL')}
        </DialogTitle>
        <p className="text-center">{t('importFromURLDescription')}</p>
        <div className="relative mb-6 mt-4 w-full">
          <input
            placeholder="http://www.example.com/"
            className={`w-full rounded-sm p-3 pl-10 text-[14px] outline outline-1 outline-lightGreyPress focus:outline-disabled`}
            value={url}
            autoFocus
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          />
          <Url className="absolute left-2 top-3" />
        </div>
        <div className="flex justify-end gap-x-4">
          <BaseButton variant="outline" onClick={handleClose}>
            {t('cancel')}
          </BaseButton>
          <BaseButton variant="default" onClick={onAction} classNames="text-white">
            {t('import')}
          </BaseButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportFromUrlModal;
