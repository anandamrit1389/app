import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { IPromoCode } from '@/interfaces/companies';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import PromoCodeService from '@/api/promoCodeService';
import Trash from '@/assets/trash.svg?react';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import PlusIcon from '@/assets/plus-sign.svg?react';
import { BulkCodeData, diffPromoCodes, validateCodes } from '../helpers';
import ErrorText from '@/components/CustomUI/ErrorText/ErrorText';
import { toast } from 'sonner';
import { DatePickerItem } from './DatePickerItem';

type FormData = {
  id: string;
  label: string;
};

interface IProps {
  isModalOpen: boolean;
  onModalOpenChange: () => void;
  onSave: (id: string, data: BulkCodeData) => Promise<void>;
  formData: FormData;
  promoType: 'pro' | 'enterprise';
}

const newCodePayload: Partial<IPromoCode> = {
  code: '',
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
};

export const PromoCodesModal = ({
  isModalOpen,
  onModalOpenChange,
  formData,
  onSave,
  promoType,
}: IProps) => {
  const [codes, setCodes] = useState<Partial<IPromoCode>[]>([]);
  const [originCodes, setOriginCodes] = useState<IPromoCode[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setError] = useState<(string | null)[] | null>(null);

  const { t } = useTranslation('translation', { keyPrefix: 'adminPanel.promoCodesModal' });

  const handleChangeField = (value: string, index: number) => {
    setCodes((prevCodes) =>
      prevCodes.map((promoCode, i) => ({
        ...promoCode,
        code: i === index ? value : promoCode.code,
      })),
    );
    setIsDirty(true);
    setError(null);
  };

  const handleChangeDate = (value: Date, index: number) => {
    setCodes((prevCodes) =>
      prevCodes.map((promoCode, i) => ({
        ...promoCode,
        expiresAt: i === index ? value : promoCode.expiresAt,
      })),
    );
    setIsDirty(true);
    setError(null);
  };

  const handleRemoveCode = (index: number) => {
    setCodes((prevCodes) => prevCodes.filter((_, i) => i !== index));
    setIsDirty(true);
    setError(null);
  };

  const handleAddNewRow = () => {
    setCodes((prevCodes) => prevCodes.concat([{ ...newCodePayload, promoType }]));
    setIsDirty(true);
  };

  const handleClose = () => {
    if (isDirty) return;
    onModalOpenChange();
  };

  const handleCanel = () => {
    setIsDirty(false);
    setError(null);
    setCodes(originCodes);
    onModalOpenChange();
  };

  const handleSave = async () => {
    const error = validateCodes(codes);
    if (error) {
      setError(error);
      return;
    }
    const bulkData = diffPromoCodes(originCodes, codes);
    if (!formData || !formData.id) return;
    try {
      await onSave(formData.id, bulkData);
      toast.success('Promo codes changes saved');
      handleCanel();
    } catch (error) {
      toast.error('Failed to change promo codes.');
    }
  };

  useEffect(() => {
    if (!formData) return;

    const fetchSchoolCodes = async () => {
      if (!formData.id) return;

      const res = await PromoCodeService.getAllCompanyPromoCodes(formData.id);
      setCodes(res.data.length ? res.data : [{ ...newCodePayload, promoType }]);
      setOriginCodes(res.data);
    };

    fetchSchoolCodes();
  }, [formData]);

  return (
    <Dialog onOpenChange={handleClose} open={isModalOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{formData?.label || ''}</DialogTitle>
          <DialogDescription>{t(`description`)}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-2 max-h-[50vh] overflow-auto">
          {codes.map((code, index) => {
            return (
              <div className="w-full" key={code.id || `${code.expiresAt}`}>
                <div className="flex w-full items-center gap-4 ">
                  <div className="w-8/12">
                    <Input
                      id="code"
                      disabled={code?.redemptionsCount ? code?.redemptionsCount > 0 : false}
                      value={code.code ?? ''}
                      onChange={(e) => handleChangeField(e.target.value, index)}
                      className="w-full h-[48px]"
                    />
                  </div>
                  <div className="flex justify-between w-4/12  items-center">
                    <DatePickerItem
                      expiresAt={code.expiresAt}
                      disabled={false}
                      onChange={(val) => handleChangeDate(val, index)}
                    />

                    <div>
                      <BaseButton
                        size="sm"
                        classNames="p-2"
                        disabled={code?.redemptionsCount ? code?.redemptionsCount > 0 : false}
                        variant="ghost"
                        onClick={() => {
                          handleRemoveCode(index);
                        }}
                        icon={<Trash className="[&_path]:stroke-[#B12525]" />}
                      />
                    </div>
                  </div>
                </div>
                {errors && errors[index] && <ErrorText error={errors[index] || ''} />}
              </div>
            );
          })}
        </div>

        <DialogFooter className="sm:flex sm:justify-end">
          <BaseButton
            variant="outline"
            size="lg"
            classNames="flex gap-1 items-center"
            onClick={handleAddNewRow}
            icon={<PlusIcon />}
          >
            {t('addRowBtn')}
          </BaseButton>
          {isDirty && (
            <BaseButton
              variant="outline"
              size="lg"
              classNames="flex gap-1 items-center"
              onClick={handleCanel}
            >
              {t('cancelBtn')}
            </BaseButton>
          )}
          {isDirty && (
            <BaseButton
              isDark
              variant="secondary"
              size="lg"
              classNames="flex gap-1 items-center"
              onClick={handleSave}
            >
              {t(`saveBtn`)}
            </BaseButton>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
