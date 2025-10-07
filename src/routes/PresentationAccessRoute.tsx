import PresentationService from '@/api/presentationService';
import Loader from '@/assets/loader-color.svg?react';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setPresentationPasswordToStorage } from '@/helpers/utils/storage';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PresentationAccessRoute = ({ children }: PrivateRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState(localStorage.getItem('presentationPassword') || '');
  const [isShowPasswordInput, setIsShowPasswordInput] = useState(false);
  const { alias } = useParams();
  const [searchParams] = useSearchParams();
  const presentationId = searchParams.get('presentationId');

  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  const handleSubmit = async () => {
    setLoading(true);

    try {
      setPresentationPasswordToStorage(password);
      if (alias) {
        await PresentationService.getPresentation(alias);
      } else {
        await PresentationService.getPresentation(presentationId as string);
      }
      setIsShowPasswordInput(false);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong :(');
    } finally {
      setLoading(false);
    }
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    const getPresentation = async () => {
      try {
        if (alias) {
          await PresentationService.getPresentation(alias);
        } else {
          await PresentationService.getPresentation(presentationId as string);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error?.response?.status === 403) {
            setIsShowPasswordInput(true);
          }
        }

        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getPresentation();
  }, []);

  if (loading)
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader className="size-16 animate-spin" />
      </div>
    );

  if (isShowPasswordInput) {
    return (
      <Dialog open>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('needAccess')}</DialogTitle>
            <DialogDescription>{t('accessText')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t('password')}
              </Label>
              <Input
                disabled={loading}
                id="name"
                className="col-span-3"
                onChange={handlePassword}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit} disabled={loading}>
              {t('submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return <>{children}</>;
};

export default PresentationAccessRoute;
