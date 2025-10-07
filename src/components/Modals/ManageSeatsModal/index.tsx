import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import useMobile from '@/hooks/useMobile';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import ArrowBack from '@/assets/arrow-back.svg?react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import ErrorText from '@/components/CustomUI/ErrorText/ErrorText';
import { Input } from '@/components/ui/input';
import { createManageSeatsSchema, ManageSeatsData } from '@/schemas/manage.seats.schema';

interface IProps {
  open: boolean;
  minValue: number;
  initValue: number;
  onOpenChange: () => void;
  onAction: (seats: number) => void;
}

const ManageSeatsModal = ({ open, onOpenChange, onAction, minValue, initValue }: IProps) => {
  const isMobile = useMobile();
  const { t } = useTranslation('translation', { keyPrefix: 'manageSeats' });
  const [schema, setSchema] = useState(createManageSeatsSchema(minValue));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isLoading },
  } = useForm<ManageSeatsData>({
    resolver: zodResolver(schema),
    defaultValues: { seats: initValue },
  });

  const onSubmit: SubmitHandler<ManageSeatsData> = async (data) => {
    onAction(data.seats);
    reset();
    onOpenChange();
  };

  const handleCancelClick = () => {
    reset();
    onOpenChange();
  };

  useEffect(() => {
    if (minValue && minValue > 0) setSchema(createManageSeatsSchema(minValue));
  }, [minValue]);

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={handleCancelClick}>
        <SheetContent
          outsideclose="true"
          side="left"
          className="flex w-full flex-col gap-0 overflow-auto px-4 pb-4 pt-0 transition-all"
        >
          <div className="flex items-center justify-between py-[7px]">
            <BaseButton variant="ghost" onClick={handleCancelClick} classNames="px-0 h-[56px]">
              <ArrowBack />
            </BaseButton>
            <SheetHeader className="">
              <SheetTitle>{t('title')}</SheetTitle>
            </SheetHeader>

            <BaseButton classNames="opacity-0 px-0" variant="ghost" onClick={onOpenChange}>
              <ArrowBack />
            </BaseButton>
          </div>
          <div className="mb-2 mt-4 flex flex-col items-start ">
            <p>{t('description')}</p>
          </div>
          <div className="flex h-full flex-col justify-between ">
            <div className="mb-2 w-full flex-initial">
              <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
                <div className="relative flex gap-2">
                  <Input
                    {...register('seats', {
                      required: true,
                      valueAsNumber: true,
                    })}
                    placeholder="Seats"
                    type="number"
                    className="h-10"
                  />
                </div>
                {errors.seats && <ErrorText error={errors.seats.message || ''} />}
              </form>
            </div>

            <div className="mt-auto flex justify-between gap-2">
              <BaseButton
                loading={isLoading}
                variant="outline"
                classNames="px-9 w-full"
                onClick={handleCancelClick}
              >
                {t('cancelBtn')}
              </BaseButton>
              <BaseButton
                loading={isLoading}
                classNames="text-white w-full  px-10 bg-[#111827] focus:bg-[#000000] hover:bg-[#374151]
                h-[48px]"
                type="submit"
              >
                {t('inviteBtn')}
              </BaseButton>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleCancelClick}>
      <DialogContent className="flex max-h-[calc(100dvh-32px)] max-w-[544px] flex-col gap-0 overflow-hidden p-8">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-[24px] font-bold">{t('title')}</DialogTitle>
          <DialogDescription className="mb-6 flex flex-col items-start">
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col  justify-center">
          <div className="mb-2 flex-initial">
            <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
              <div className="relative flex gap-2">
                <Input
                  {...register('seats', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  placeholder="Seats"
                  type="text"
                  className="h-10"
                />
              </div>
              {errors.seats && <ErrorText error={errors.seats.message || ''} />}
              <div className="mt-4 flex justify-end gap-2">
                <BaseButton
                  loading={isLoading}
                  variant="outline"
                  classNames="px-9"
                  onClick={handleCancelClick}
                >
                  {t('cancelBtn')}
                </BaseButton>
                <BaseButton
                  loading={isLoading}
                  classNames="text-white px-10 bg-[#111827] focus:bg-[#000000] hover:bg-[#374151]
                h-[40px]"
                  type="submit"
                >
                  {t('inviteBtn')}
                </BaseButton>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageSeatsModal;
