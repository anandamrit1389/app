import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import ArrowBack from '@/assets/arrow-back.svg?react';
import usePaginatedData from '@/hooks/usePaginatedData';
import { ITransaction, TransactionType } from '@/interfaces/IUser';
import transactionService from '@/api/transactionsService';
import ReceiptIcon from '@/assets/receipt.svg?react';

interface IProps {
  open: boolean;
  onOpenChange: () => void;
  isMobile?: boolean;
}

const TrasactionsModal = ({ open, onOpenChange, isMobile }: IProps) => {
  const { t, i18n } = useTranslation('translation', {
    keyPrefix: 'trasactions',
  });

  const {
    data: transactions,
    isLoading,
    loadMore,
    hasMore,
  } = usePaginatedData<ITransaction>(
    transactionService.getPaginatedTransactions,
    (item) => item.id,
    { lang: i18n.language },
    10,
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('uk-UA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(date));
  };

  if (isMobile) {
    return (
      <>
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent
            outsideclose="true"
            side="left"
            className="flex w-full flex-col overflow-auto px-5 pt-0 transition-all"
          >
            <div className="flex items-center justify-between">
              <BaseButton variant="ghost" onClick={onOpenChange} classNames="px-0 h-[56px]">
                <ArrowBack />
              </BaseButton>
              <SheetTitle>{t('title')}</SheetTitle>
              <BaseButton classNames="opacity-0 px-0" variant="ghost" onClick={onOpenChange}>
                <ArrowBack />
              </BaseButton>
            </div>

            <div className="flex justify-between rounded-lg bg-[#F6F7FA] px-4 py-3 text-[16px] font-semibold text-darkHeadline">
              <p>{t('description')}</p>
              <p>{t('price')}</p>
            </div>
            <div>
              {transactions.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-1 border-b px-4 py-2 text-[14px]"
                >
                  <div className="flex grow items-center gap-1 text-tertiaryText">
                    <div className="w-[24px]">
                      <ReceiptIcon />
                    </div>
                    <div>
                      <p>{item.description}</p>
                      <div>{formatDate(item.createdAt)}</div>
                    </div>
                  </div>
                  <div className="basis-3/12 text-right font-semibold text-darkHeadline">
                    {`${item.type === TransactionType.DEDUCT ? '' : '+'} ${item.amount} c`}
                  </div>
                </div>
              ))}
            </div>
            {hasMore && (
              <BaseButton
                onClick={() => loadMore()}
                variant="outline"
                disabled={isLoading}
                loading={isLoading}
                classNames="p-3 text-[16px]"
              >
                {t('loadMore')}
              </BaseButton>
            )}
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex h-[760px] max-w-[760px] flex-col gap-6 overflow-hidden p-10">
          <DialogHeader className="">
            <DialogTitle className="text-left font-semibold">{t('title')}</DialogTitle>
            <DialogDescription className=" text-center text-[18px] leading-4 text-[#6b7280]"></DialogDescription>
          </DialogHeader>
          <div className="flex justify-between rounded-lg bg-[#F6F7FA] px-4 py-3 text-[16px] font-semibold text-darkHeadline">
            <p>{t('description')}</p>
            <p>{t('price')}</p>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {transactions.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-1 border-b px-4 py-2 text-[14px]"
              >
                <div className="flex grow basis-1/2 items-center gap-1 text-tertiaryText">
                  <div className="w-[24px]">
                    <ReceiptIcon />
                  </div>
                  <p>{item.description}</p>
                </div>
                <div className="flex basis-1/4 justify-between gap-1">
                  <div className="text-tertiaryText">{formatDate(item.createdAt)}</div>
                  <div className="font-semibold text-darkHeadline">{`${
                    item.type === TransactionType.DEDUCT ? '' : '+'
                  } ${item.amount} c`}</div>
                </div>
              </div>
            ))}
          </div>
          {hasMore && (
            <BaseButton
              onClick={() => loadMore()}
              disabled={isLoading}
              loading={isLoading}
              variant="outline"
              classNames="p-3 text-[16px]"
            >
              {t('loadMore')}
            </BaseButton>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrasactionsModal;
