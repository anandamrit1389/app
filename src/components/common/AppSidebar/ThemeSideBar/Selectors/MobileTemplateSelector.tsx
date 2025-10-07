import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useTranslation } from 'react-i18next';
import { getTemplatesPreview } from '@/helpers/constants/presentation-templates.const';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface IProps {
  template: string;
  toggleTemplate: (template: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MobileTemplateSelector = ({ template, toggleTemplate, open, setOpen }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  const templates = getTemplatesPreview();
  const handleTemplateSelect = (templateKey: string) => {
    toggleTemplate(templateKey);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="flex h-[50vh] flex-col rounded-t-3xl">
        <SheetHeader className="shrink-0">
          <SheetTitle className="text-left text-sm font-medium uppercase">{t('theme')}</SheetTitle>
        </SheetHeader>

        <div className="mt-2 flex flex-col gap-2 overflow-hidden">
          {templates
            .filter((template) => !template.key.includes('fake'))
            .map((templateItem) => (
              <div
                key={templateItem.key}
                className={cn(
                  'p-1 flex items-center justify-between rounded',
                  template === templateItem.key && 'bg-gray-50',
                )}
                onClick={() => handleTemplateSelect(templateItem.key)}
              >
                <div className="flex items-center">
                  <span>{templateItem.name}</span>
                </div>
                {template === templateItem.key && <Check className="size-5 text-primary" />}
              </div>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileTemplateSelector;
