import { RefObject, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
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
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { toast } from 'sonner';
import { debounce } from '@/helpers/utils/debounce';
import UploadIcon from '@/assets/upload.svg?react';
import DeleteIcon from '@/assets/delete.svg?react';
import useDeviceDetect from '@/hooks/useDeviceDetect';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useTranslation } from 'react-i18next';
import { CompanyInfo } from '@/interfaces/companies';
import { companySettingsSchema } from '@/schemas/companySettings.schema';
import { useCompany } from '@/hooks/useCompany';
import CompanyService from '@/api/companyService';

type CompanySettingsValues = z.infer<typeof companySettingsSchema>;

interface CompanySettingsFormProps {
  company: CompanyInfo;
  sectionRef: RefObject<HTMLDivElement>;
}

interface NewCompanyInfo {
  name: string;
}

const OrganisationDataSection = ({ company, sectionRef }: CompanySettingsFormProps) => {
  const { handleLocalUpdateCompanyInfo } = useCompany();
  const { t } = useTranslation('translation', { keyPrefix: 'company' });

  const { isMobile } = useDeviceDetect();
  const form = useForm<CompanySettingsValues>({
    defaultValues: company
      ? {
          name: company.name,
          imgUrl: company.imgUrl,
        }
      : undefined,

    resolver: zodResolver(companySettingsSchema),
  });

  const debouncedSubmit = useCallback(
    debounce((data) => {
      onSubmit(data);
    }, 700),
    [],
  );

  async function handleFileUpload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const updatedCompany = await CompanyService.uploadLogotype(formData);
    form.setValue('imgUrl', updatedCompany.imgUrl);
    handleLocalUpdateCompanyInfo(updatedCompany);
    toast.success(t('successMessageFileUpload'));
  }

  async function onSubmit(data: CompanySettingsValues) {
    const newCompanyInfo: NewCompanyInfo = {
      name: data.name,
    };

    const updatedInfo = await CompanyService.updateCompanyInfo(newCompanyInfo);
    handleLocalUpdateCompanyInfo(updatedInfo);

    toast.success(t('successMessageCompanyUpdate'));
  }

  const handleRemoveProfilePicture = async () => {
    form.setValue('imgUrl', null);
    // handleUserInfo({ company: { ...company, logo: null } });
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      debouncedSubmit(value);
    });

    return () => subscription.unsubscribe();
  }, [form.watch, debouncedSubmit]);

  return (
    <div className="flex flex-col gap-6 overflow-y-auto">
      <Form {...form}>
        <form className="gap-6 space-y-8">
          <div
            id="organisation-data"
            ref={sectionRef}
            className="flex rounded-lg bg-white px-4 py-6 md:p-10"
          >
            <div className={isMobile ? 'w-full' : 'basis-10/12'}>
              <div className="mb-4">
                <div className="flex justify-between">
                  <div>
                    <p className="mb-4 text-base font-semibold text-darkHeadline">
                      {t('organisationDataSection')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4 flex gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-darkHeadline">{t('name')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('namePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <div className="mb-2 text-sm">{t('logotype')}</div>
                <div className="flex flex-wrap items-center gap-y-4">
                  <img src={company.imgUrl ?? undefined} className="object-cover mr-4 h-8" />

                  <div className="flex items-center">
                    <label
                      htmlFor="logo"
                      className="flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg border-[1.5px] border-lightGreyPress bg-transparent px-3 py-1.5 text-sm font-semibold text-darkText transition-colors hover:border-[#D1D5DB] hover:bg-lightGrey active:bg-lightGreyHover"
                    >
                      <UploadIcon />
                      {t('imgUploadBtn')}
                      <Input
                        id="logo"
                        type="file"
                        accept="image/jpeg, image/png, image/jpg"
                        className="invisible absolute z-[-1] w-0 opacity-0"
                        onChange={(e) => {
                          if (e.target.files) {
                            handleFileUpload(e.target.files[0]);
                          }
                        }}
                      />
                    </label>

                    <AlertDialog>
                      <AlertDialogTrigger>
                        <BaseButton
                          classNames="ml-2 py-1.5 px-3 text-[#B12525] transition-colors hover:border-[#D1D5DB] hover:bg-[#F8F9FA] active:bg-lightGreyHover"
                          size="sm"
                          variant="outline"
                          icon={<DeleteIcon />}
                        >
                          {t('removeBtn')}
                        </BaseButton>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-[440px]">
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('removePictureModalTitle')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('removePictureModalDescription')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="transition-colors hover:border-[#D1D5DB] hover:bg-lightGrey active:bg-lightGreyHover">
                            {t('cancelBtn')}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-[#B12525] transition-colors hover:bg-[#961f1f] active:bg-[#7c1a1a]"
                            onClick={handleRemoveProfilePicture}
                          >
                            {t('removeBtn')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OrganisationDataSection;
