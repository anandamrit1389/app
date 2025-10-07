import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export default function useToastGoogleSlides() {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  const handleClick = (url: string) => {
    window.open(url, '_blank');
  };

  const toastText = (url: string, source: string) => (
    <div className="w-80 rounded-lg">
      <h1 className="mb-4 text-xl font-semibold">
        {source === 'googleSlides' ? t('toastGoogleTitle') : t('toastPdfForPrintText')}
      </h1>
      <p className="text-sm">
        {source === 'googleSlides' ? t('toastGoogleSubtext') : t('toastPdfForPrintSubtext')}{' '}
        <Button onClick={() => handleClick(url)} variant="ghost">
          {t('toastButtonText')}
        </Button>
      </p>
    </div>
  );

  const callToast = (url: string, source: string) => {
    return toast.success(toastText(url, source), {
      duration: 10000,
    });
  };

  return { callToast };
}
