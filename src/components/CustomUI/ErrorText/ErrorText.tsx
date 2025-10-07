import { cn } from '@/lib/utils';

interface ErrorTextProps {
  error: string;
  classNames?: string;
}

const ErrorText = ({ error, classNames }: ErrorTextProps) => {
  return <span className={cn('text-[#ff2020]  text-sm', classNames)}>{error}</span>;
};

export default ErrorText;
