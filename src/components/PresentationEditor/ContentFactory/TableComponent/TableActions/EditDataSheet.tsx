import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { Input } from '@/components/ui/input';
import DeleteIcon from '@/assets/delete.svg?react';
import AddIcon from '@/assets/plus-sign.svg?react';
import { useTranslation } from 'react-i18next';
import { useState, useRef, TouchEvent } from 'react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';

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

const EditDataSheet = ({
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

  const [swipedRowIndex, setSwipedRowIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent, index: number) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.touches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      setSwipedRowIndex(index);
    } else if (diff < -50) {
      setSwipedRowIndex(null);
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
  };

  return (
    <Sheet open={isDataEditing} onOpenChange={setIsDataEditing}>
      <SheetContent side="bottom" className="h-full rounded-t-2xl pt-4 pb-6 flex flex-col">
        <div className="mb-2 flex flex-col items-center gap-2">
          <div className="flex h-2.5 w-10 justify-center rounded-full bg-gray-400"></div>
          <SheetTitle>{t('editTableData')}</SheetTitle>
        </div>

        <div className="flex-1 overflow-x-auto px-4">
          {tableData.length === 0 ? (
            <p className="text-gray-500">{t('addRowToEnterData')}</p>
          ) : (
            <div className="w-max min-w-full">
              <div
                className="grid gap-2 pb-2"
                style={{
                  gridTemplateColumns: `repeat(${tableData[0]?.length}, minmax(100px, 1fr))`,
                }}
              >
                {tableData[0].map((_, colIndex) => (
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
              </div>

              {tableData.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="relative"
                  onTouchStart={handleTouchStart}
                  onTouchMove={(e) => handleTouchMove(e, rowIndex)}
                  onTouchEnd={handleTouchEnd}
                >
                  <div
                    className={`grid gap-2 py-1 transition-transform duration-300 ease-out`}
                    style={{
                      gridTemplateColumns: `repeat(${row.length}, minmax(100px, 1fr))`,
                      transform:
                        swipedRowIndex === rowIndex ? 'translateX(-40px)' : 'translateX(0)',
                    }}
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
                  </div>
                  <BaseButton
                    classNames={`text-[#B12525] w-10 h-10 flex items-center justify-center absolute right-0 top-1/2 transform -translate-y-1/2 transition-transform duration-300 ease-out ${
                      swipedRowIndex === rowIndex ? 'translate-x-0' : 'translate-x-full'
                    }`}
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteRow(rowIndex)}
                  >
                    <DeleteIcon />
                  </BaseButton>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-2 px-4">
          <BaseButton
            classNames="px-3 text-black transition-colors hover:border-[#B12525] w-full"
            size="sm"
            variant="outline"
            onClick={addNewRow}
            icon={<AddIcon />}
            disabled={tableData?.length >= 8}
          >
            {t('addRow')}
          </BaseButton>
          <BaseButton
            classNames="px-3 text-black transition-colors hover:border-[#B12525] w-full"
            size="sm"
            variant="outline"
            onClick={addNewColumn}
            icon={<AddIcon />}
            disabled={tableData[0]?.length >= 8}
          >
            {t('addColumn')}
          </BaseButton>
          <BaseButton
            classNames="p-3 text-white bg-black hover:bg-black/80 w-full"
            size="sm"
            variant="outline"
            onClick={handleUpdateTableData}
          >
            {t('save')}
          </BaseButton>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditDataSheet;
