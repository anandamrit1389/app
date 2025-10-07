import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getTemplatesPreview,
  getTemplate,
  getThumbByThemeId,
} from '@/helpers/constants/presentation-templates.const';
import useMobile from '@/hooks/useMobile';
import MobileTemplateSelector from './MobileTemplateSelector';

interface IProps {
  template: string;
  toggleTemplate: (template: string) => void;
}

const TemplateSelector = ({ template, toggleTemplate }: IProps) => {
  const [open, setOpen] = useState(false);

  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const isMobile = useMobile();

  const templates = getTemplatesPreview();
  const templateTitle = getTemplate(template)?.title;

  if (isMobile) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-[12px] font-[500] uppercase">{t('theme')}</p>
        <div
          className="flex cursor-pointer items-center gap-3 rounded-md border p-2"
          onClick={() => setOpen(true)}
        >
          <p>{templateTitle}</p>
        </div>

        <MobileTemplateSelector
          template={template}
          toggleTemplate={toggleTemplate}
          open={open}
          setOpen={setOpen}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-[500] uppercase">{t('theme')}</p>
      </div>
      <Select value={template} onValueChange={toggleTemplate}>
        <SelectTrigger>
          <SelectValue>
            {template && (
              <div className="flex flex-row items-center gap-2">
                <img src={getThumbByThemeId(template)} className="h-6 w-10 rounded-sm" />
                <span>{getTemplate(template)?.title}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="start" className="w-full">
          {templates
            .filter((template) => !template.key.includes('fake'))
            .map((template) => (
              <SelectItem className="!pl-2" key={template.key} value={template.key}>
                <div className="flex flex-row items-center gap-2">
                  <img src={getThumbByThemeId(template.key)} className="h-6 w-10 rounded-sm" />
                  <span>{template.name}</span>
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TemplateSelector;
