import { CompanyInfo, ThemeColors } from '@/interfaces/companies';
import { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { themeCatalog } from '@/helpers/constants/themes.const';
import { useCompany } from '@/hooks/useCompany';
import { IFont, IFontSet } from '@/interfaces/font.interface';
import { presentationFonts } from '@/helpers/constants/fonts.const';
import useMobile from '@/hooks/useMobile';
import { cn } from '@/lib/utils';
import ThemeSelector from '@/components/Selects/ThemeSelector';
import FontSelector from '@/components/Selects/FontSelector';

interface IProps {
  company: CompanyInfo;
  sectionRef: RefObject<HTMLDivElement>;
}

const ThemeSection = ({ company, sectionRef }: IProps) => {
  const { uploadCompanyFont, handleUpdateCompanyInfo } = useCompany();
  const isMobile = useMobile();

  const { t } = useTranslation('translation', { keyPrefix: 'company' });

  const toggleTheme = (val: string) => {
    handleUpdateCompanyInfo({
      themeId: val,
      themeColors: themeCatalog[val]?.colors,
    });
  };

  const handleApplyCompanyColors = (colors: ThemeColors) => {
    handleUpdateCompanyInfo({ themeId: 'custom', themeColors: colors });
  };

  const handleChangeFont = (val: string) => {
    const chosenSchema = presentationFonts.find((schema) => schema.id === val);
    if (chosenSchema) {
      handleUpdateCompanyInfo({
        fontId: val,
        companyFonts: chosenSchema.fonts,
      });
    }
  };

  const handleApplyCompanyFonts = (companyFonts: IFontSet, ownFonts: IFont[]) => {
    handleUpdateCompanyInfo({
      fontId: 'custom',
      uploadedFonts: ownFonts,
      companyFonts: companyFonts,
    });
  };

  const handleUploadFont = (formData: FormData) => {
    uploadCompanyFont(formData);
  };

  return (
    <div id="company-theme" ref={sectionRef} className="flex rounded-lg bg-white px-4 py-6 md:p-10">
      <div
        className={cn('basis-11/12', {
          'basis-12/12': isMobile,
        })}
      >
        <p className="mb-4 text-base font-semibold text-darkHeadline">{t('themeTitle')}</p>
        <p className="mb-4 text-[14px] text-darkHeadline">{t('themeDescription')}</p>
        <div
          className={cn('w-7/12 mb-4', {
            'w-full': isMobile,
          })}
        >
          <p className="mb-2 text-[14px] font-medium text-darkHeadline">{t('colorTitle')}</p>
          <ThemeSelector
            isCustom
            value={company.themeId || undefined}
            onChange={toggleTheme}
            isMobile={isMobile}
            onChangeCustomColors={handleApplyCompanyColors}
            customColors={company.themeColors}
          />
        </div>
        <div
          className={cn('w-7/12', {
            'w-full': isMobile,
          })}
        >
          <p className="mb-2 text-[14px] font-medium text-darkHeadline">{t('fontsTitle')}</p>
          <FontSelector
            isCustom
            isMobile={isMobile}
            value={company.fontId}
            onChange={handleChangeFont}
            onChangeCustomFonts={handleApplyCompanyFonts}
            uploadCompanyFont={handleUploadFont}
            uploadedFonts={company.uploadedFonts}
            customFonts={company.companyFonts}
          />
        </div>
      </div>
    </div>
  );
};

export default ThemeSection;
