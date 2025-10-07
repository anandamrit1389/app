import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CompanyType } from '@/interfaces/companies';
import { useTranslation } from 'react-i18next';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';

type BaseForm = {
  id: string;
  name: string;
  maxMembers: number | null;
  usedMembers: number;
};

type SchoolForm = BaseForm & {
  type: CompanyType.EDUCATIONAL;
};

type EnterpriseForm = BaseForm & {
  type: CompanyType.ENTERPRISE;
  assignedEmail: string;
};

export type CompanyFormValues = SchoolForm | EnterpriseForm;

interface IProps {
  isModalOpen: boolean;
  onModalOpenChange: () => void;
  onSave: () => void;
  onChangeField: (
    fildName: 'name' | 'maxMembers' | 'assignedEmail',
    value: string | number,
  ) => void;
  formData: Partial<CompanyFormValues> | null;
  type: 'new' | 'edit';
}

export const CompanyModal = ({
  isModalOpen,
  onModalOpenChange,
  onChangeField,
  formData,
  onSave,
  type,
}: IProps) => {
  const { t } = useTranslation('translation', {
    keyPrefix:
      formData?.type === CompanyType.EDUCATIONAL
        ? 'adminPanel.schoolModal'
        : 'adminPanel.enterpriseModal',
  });

  return (
    <Dialog onOpenChange={onModalOpenChange} open={isModalOpen}>
      <DialogContent className="sm:max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>{t(`${type}Title`)}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between space-x-2 w-full">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              value={formData?.name ?? ''}
              onChange={(e) => onChangeField('name', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="seats">{t('seats')}</Label>
            <Input
              id="seats"
              type="number"
              min={formData?.usedMembers ?? 1}
              value={formData?.maxMembers ?? 1}
              onChange={(e) => onChangeField('maxMembers', Number(e.target.value))}
            />
          </div>
        </div>
        {formData?.type === CompanyType.ENTERPRISE && (
          <div className="grid gap-2">
            <Label htmlFor="assignedEmail">{t('assignedEmail')}</Label>
            <Input
              id="assignedEmail"
              type="email"
              value={formData?.assignedEmail ?? ''}
              onChange={(e) => onChangeField('assignedEmail', e.target.value)}
            />
          </div>
        )}

        <DialogFooter className="sm:flex sm:justify-end">
          <BaseButton
            variant="outline"
            size="lg"
            onClick={onModalOpenChange}
            classNames="flex gap-1 items-center"
          >
            {t('cancelBtn')}
          </BaseButton>
          <BaseButton
            isDark
            variant="secondary"
            size="lg"
            onClick={onSave}
            classNames="flex gap-1 items-center"
          >
            {t(`${type}SaveBtn`)}
          </BaseButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
