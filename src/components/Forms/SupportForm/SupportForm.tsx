import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import SendIcon from '@/assets/send.svg?react';
import FileUploadIcon from '@/assets/file-upload.svg?react';
import FileUploadColorIcon from '@/assets/file-upload-color.svg?react';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { Textarea } from '@/components/ui/textarea';
import SupportService from '@/api/supportService';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext } from 'react';
import { AuthContext } from '@/providers/auth.provider';
import { cn } from '@/lib/utils';
import CloseIcon from '@/assets/x.svg?react';
import { supportSchema } from '@/schemas/support.schema';

type SupportValues = z.infer<typeof supportSchema>;

const SupportForm = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'support' });
  const { user } = useContext(AuthContext);

  const form = useForm<SupportValues>({
    defaultValues: {
      message: '',
      files: null,
    },
    resolver: zodResolver(supportSchema),
  });
  const {
    watch,
    reset,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(data: SupportValues) {
    try {
      if (!user) {
        return;
      }

      const formData = new FormData();
      if (data.files?.length) {
        for (const file of data.files) {
          if (file.size > 1000000) {
            toast.error(t('errorMessageFileSize'));
            return;
          }
          formData.append('files', file);
        }
      }

      formData.append('message', data.message);
      formData.append('email', user.email);

      await SupportService.reportBug(formData);

      reset();

      toast.success(t('successReportBug'));
    } catch (error) {
      toast.error(t('errorReportBug'));
      console.error(error);
    }
  }

  const handleRemoveAttachment = (index: number) => {
    const currentFiles = watch('files');
    if (!currentFiles) return;

    const filesArray = Array.from(currentFiles);

    const newFiles = filesArray.filter((_, i) => i !== index);

    const dataTransfer = new DataTransfer();
    newFiles.forEach((file) => dataTransfer.items.add(file));

    setValue('files', dataTransfer.files.length ? dataTransfer.files : null);
  };

  const formatFileName = (fileName: string) => {
    const [name, extension] = fileName.split(/\.(?=[^.]+$)/);
    if (name.length > 4) {
      return `${name.substring(0, 4)}....${extension}`;
    }
    return `${name}....${extension}`;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const prevList = watch('files') || [];
      const prevListArray = Array.from(prevList);
      const newFilesArray = [...files, ...prevListArray];

      const dataTransfer = new DataTransfer();
      newFilesArray.forEach((file) => dataTransfer.items.add(file));

      setValue('files', dataTransfer.files.length ? dataTransfer.files : null);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex w-full">
              <FormField
                control={control}
                name="message"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="mb-4 inline-block text-darkHeadline">
                      {t('supportInputLabel')}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="!m-0"
                        disabled={isSubmitting}
                        placeholder={t('supportInputPlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <label
                htmlFor="files"
                className={cn(
                  'absolute bg-white right-2 bottom-2 w-12 h-12 border-[1px] flex items-center cursor-pointer justify-center rounded-full',
                  {
                    'border-lightGreyPress hover:borger-lightGreyPress active:borger-lightGreyPress:':
                      isSubmitting,
                    'border-lightGreyPress hover:border-[#D1D5DB] active:border-[#9ca3af]':
                      !isSubmitting,
                  },
                )}
              >
                <FileUploadIcon
                  className={cn({
                    '[&_path]:stroke-[#00000010] cursor-not-allowed': isSubmitting,
                  })}
                />
                <Input
                  disabled={isSubmitting}
                  id="files"
                  type="file"
                  accept="image/jpeg, image/png, image/jpg, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="invisible absolute z-[-1] w-0 opacity-0"
                  multiple
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {watch('files')?.length && !isSubmitting && (
              <ul className="flex flex-wrap gap-2 pt-4">
                {!!watch('files') &&
                  Array.from(watch('files')!).map((file, index) => (
                    <li
                      title={file.name}
                      key={index}
                      className="flex items-center gap-1 rounded-full border border-[#F8D7D7] bg-[#FFF0F0] px-2 py-1.5 hover:bg-[#ffe7e7]"
                    >
                      <FileUploadColorIcon />
                      <span className="pr-1 text-sm text-darkText">
                        {formatFileName(file.name)}
                      </span>
                      <BaseButton
                        classNames="p-0 m-0 w-5 h-5 hover:bg-transparent active:bg-transparent focus:bg-transparent"
                        size="icon"
                        variant="ghost"
                        icon={<CloseIcon className="[&_path]:stroke-darkText" />}
                        onClick={() => handleRemoveAttachment(index)}
                      />
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
        <BaseButton
          disabled={isSubmitting || (watch('message') === '' && watch('files') === null)}
          classNames="m-0 py-[9px] px-[11px] gap-1"
          type="submit"
          size="sm"
          variant="outline"
          icon={<SendIcon />}
        >
          {t('send')}
        </BaseButton>
      </form>
    </Form>
  );
};

export default SupportForm;
