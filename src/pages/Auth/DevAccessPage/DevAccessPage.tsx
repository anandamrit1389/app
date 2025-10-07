import { useEffect, useState } from 'react';
import bcrypt from 'bcryptjs';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import EyeIcon from '@/assets/eye.svg?react';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import Loader from '@/assets/loader-color.svg?react';
import AuthLayout from '@/components/Layouts/AuthLayout/Layouts';
import InabitLogo from '@/assets/dev-logo-color.svg?react';
import { DevAccessCredentials } from '@/interfaces/auth.interface';
import { zodResolver } from '@hookform/resolvers/zod';
import { DevAccessSchema } from '@/schemas/auth.schema';
import ErrorText from '@/components/CustomUI/ErrorText/ErrorText';

const saltRounds = 10;

interface IProps {
  onAccessGranted: () => void;
}

const DevAccessPage = ({ onAccessGranted }: IProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isLoading, isValid },
  } = useForm<DevAccessCredentials>({
    resolver: zodResolver(DevAccessSchema),
  });

  const [correctHash, setCorrectHash] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<DevAccessCredentials> = async (data) => {
    if (data.password && correctHash && bcrypt.compareSync(data.password, correctHash)) {
      sessionStorage.setItem('devAccess', correctHash);
      onAccessGranted();
    } else {
      setError('password', { message: 'Incorrect password' });
    }
  };

  const [isShowPassword, setIsShowPassword] = useState(false);
  const handleTogglePassword = () => setIsShowPassword((prev) => !prev);

  useEffect(() => {
    const fetchCorrectHash = async () => {
      setLoading(true);
      const envPassword = import.meta.env.VITE_EXTERNAL_PROTECTION_PASSWORD;

      if (import.meta.env.VITE_EXTERNAL_PROTECTION_PASSWORD) {
        const hashedEnvPassword = await bcrypt.hash(envPassword, saltRounds);
        setCorrectHash(hashedEnvPassword);

        const storedHash = sessionStorage.getItem('devAccess');
        if (storedHash && bcrypt.compareSync(envPassword, storedHash)) {
          onAccessGranted();
        }
        setLoading(false);
      }
    };

    fetchCorrectHash();
  }, [onAccessGranted]);

  return (
    <>
      {loading ? (
        <div className="flex size-full items-center justify-center">
          <Loader className="fixed top-1/2 size-16 animate-spin" />
        </div>
      ) : (
        <AuthLayout>
          <div className="w-[464px] max-w-full px-10 py-8">
            <div className="mb-8 flex flex-col items-center">
              <InabitLogo />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[12px] px-3 ">
              <div className="relative">
                <Input
                  {...register('password', {
                    required: true,
                  })}
                  placeholder="Password"
                  type={isShowPassword ? 'text' : 'password'}
                  className="h-12"
                />
                <BaseButton
                  onClick={handleTogglePassword}
                  icon={<EyeIcon />}
                  variant="ghost"
                  size="icon"
                  classNames="absolute top-1/2 -translate-y-1/2 right-2"
                />
              </div>
              {errors.password && <ErrorText error={errors.password.message || ''} />}

              <BaseButton
                type="submit"
                size="lg"
                loading={isLoading || isSubmitting}
                disabled={!isValid}
                classNames="text-white"
              >
                Continue
              </BaseButton>
            </form>
          </div>
        </AuthLayout>
      )}
    </>
  );
};

export default DevAccessPage;
