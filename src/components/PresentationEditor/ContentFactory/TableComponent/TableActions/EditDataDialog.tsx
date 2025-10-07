import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { Input } from '@/components/ui/input';
import DeleteIcon from '@/assets/delete.svg?react';
import AddIcon from '@/assets/plus-sign.svg?react';
import { useTranslation } from 'react-i18next';

interface IProps {
  isDataEditing: boolean;
  setIsDataEditing: (val: boolean) => void;
  tableData: string[][];
  addNewRow: () => void;
  addNewColumn: () => void;
  handleUpdateTableData: () => void;
  deleteRow: (index: number) => void;
  deleteColumn: (index: number) => void;
  handleInputChange: (rowIndex: number, colIndex: number, value: string) => void;
}

const EditDataDialog = ({
  isDataEditing,
  setIsDataEditing,
  tableData,
  addNewRow,
  addNewColumn,
  handleUpdateTableData,
  deleteRow,
  deleteColumn,
  handleInputChange,
}: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });

  return (
    <Dialog open={isDataEditing} onOpenChange={setIsDataEditing}>
      <DialogContent className="gap-0 p-5 sm:p-8 max-w-[90%]">
        <DialogHeader className="mb-4">
          <DialogTitle>{t('editTableData')}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[500px] w-full overflow-y-auto" onWheel={(e) => e.stopPropagation()}>
          {tableData.length === 0 && <p className="text-gray-500">{t('addRowToEnterData')}</p>}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2 pb-2">
            {tableData[0]?.map((_, colIndex) => (
              <div key={colIndex} className="flex justify-end">
                <BaseButton
                  classNames="px-1 text-[#B12525] transition-colors hover:border-[#B12525]"
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteColumn(colIndex)}
                  icon={<DeleteIcon />}
                />
              </div>
            ))}
            <div />
          </div>

          {tableData.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2 py-1"
            >
              {row.map((cell, colIndex) => (
                <Input
                  key={colIndex}
                  value={cell}
                  placeholder={`Col ${colIndex + 1} Row ${rowIndex + 1}`}
                  className="w-full"
                  onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                />
              ))}
              <div className="flex items-center justify-end">
                <BaseButton
                  classNames="px-1 text-[#B12525] transition-colors hover:border-[#B12525]"
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteRow(rowIndex)}
                  icon={<DeleteIcon />}
                />
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="flex gap-2 pt-8">
          <BaseButton
            classNames="px-3 text-black transition-colors hover:border-[#B12525]"
            size="sm"
            variant="outline"
            onClick={addNewRow}
            icon={<AddIcon />}
            disabled={tableData?.length >= 8}
          >
            {t('addRow')}
          </BaseButton>
          <BaseButton
            classNames="px-3 text-black transition-colors hover:border-[#B12525]"
            size="sm"
            variant="outline"
            onClick={addNewColumn}
            icon={<AddIcon />}
            disabled={tableData[0]?.length >= 8}
          >
            {t('addColumn')}
          </BaseButton>
          <BaseButton
            classNames="p-3 text-white bg-black hover:bg-black/80"
            size="sm"
            variant="outline"
            onClick={handleUpdateTableData}
          >
            {t('save')}
          </BaseButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDataDialog;
