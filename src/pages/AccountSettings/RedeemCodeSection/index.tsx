import { Input } from '@/components/ui/input';
import { User } from '@/interfaces/IUser';
import { RefObject, useContext, useState, useEffect, useRef } from 'react';
import useDeviceDetect from '@/hooks/useDeviceDetect';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import PromoCodeService from '@/api/promoCodeService';
import { AuthContext } from '@/providers/auth.provider';
import { toast } from 'sonner';

interface AccountSettingsFormProps {
  user: User;
  sectionRef: RefObject<HTMLDivElement>;
}

const RedeemCodeSection = ({ sectionRef }: AccountSettingsFormProps) => {
  const [promoCode, setPromoCode] = useState('');
  const { handleRefreshProfile } = useContext(AuthContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const { t } = useTranslation('translation', { keyPrefix: 'account' });

  const { isMobile } = useDeviceDetect();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTimeout(() => inputRef.current?.focus(), 300);
      },
      { threshold: 0.5 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [sectionRef]);

  const handleApplyPromoCode = async () => {
    try {
      await PromoCodeService.redeemPromoCode(promoCode);
      toast.success(t('redeem.success'));
      handleRefreshProfile();
    } catch (error) {
      toast.error(t('redeem.error'));
      console.error(error);
    }
  };

  return (
    <div className="overflow-y-auto flex flex-col gap-6">
      <div
        id="basic-information"
        ref={sectionRef}
        className={cn('p-10 bg-white ', {
          'px-4 py-6': isMobile,
          'rounded-lg': !isMobile,
        })}
      >
        <div
          className={cn('w-11/12 flex flex-col gap-4', {
            'w-12/12': isMobile,
          })}
        >
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-base text-darkHeadline">{t('redeemCode')}</p>
            <p className="text-sm text-tertiaryText">{t('redeemCodeDescription')}</p>
          </div>
          <div className="flex flex-row gap-2">
            <Input
              ref={inputRef}
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder={t('enterCodePlaceholder')}
            />
            <BaseButton
              onClick={handleApplyPromoCode}
              classNames="px-3 py-2 text-sm"
              variant="outline"
            >
              {t('redeemCodeBtn')}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedeemCodeSection;
