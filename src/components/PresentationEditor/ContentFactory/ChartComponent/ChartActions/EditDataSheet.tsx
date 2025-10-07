import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { Input } from '@/components/ui/input';
import DeleteIcon from '@/assets/delete.svg?react';
import AddIcon from '@/assets/plus-sign.svg?react';
import { useTranslation } from 'react-i18next';
import { useState, useRef, TouchEvent } from 'react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { ChartData } from '../../../SlideFactory/Slides/ChartSlide';

interface IProps {
  isDataEditing: boolean;
  setIsDataEditing: (val: boolean) => void;
  chartData: ChartData[];
  addNewRow: () => void;
  handleUpdateChartData: () => void;
  deleteRow: (index: number) => void;
  handleInputChange: (index: number, key: keyof ChartData, value: string | number) => void;
}

const EditDataSheet = ({
  isDataEditing,
  setIsDataEditing,
  chartData,
  handleInputChange,
  deleteRow,
  addNewRow,
  handleUpdateChartData,
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
      <SheetContent side="bottom" className="rounded-t-2xl pt-4">
        <div className="mb-2 flex flex-col items-center gap-2">
          <div className="flex h-2.5 w-10 justify-center rounded-full bg-gray-400"></div>
          <SheetTitle>{t('editChartData')}</SheetTitle>
        </div>
        <div>
          <div
            className="max-h-[284px] w-full overflow-y-auto"
            onWheel={(e) => e.stopPropagation()}
          >
            {chartData.length !== 0 && (
              <div className="flex gap-2 py-1 text-sm text-gray-500">
                <div className="flex-1">
                  <p>{t('label')}</p>
                </div>
                <div className="flex-1">
                  <p>{t('value')}</p>
                </div>
              </div>
            )}
            {chartData.length === 0 && <p className="text-gray-500">{t('addRowToEnterData')}</p>}
            {chartData.map((point, index) => (
              <div
                key={index}
                className="relative flex items-center gap-2 overflow-hidden py-1"
                onTouchStart={handleTouchStart}
                onTouchMove={(e) => handleTouchMove(e, index)}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className={`flex w-full gap-2 transition-transform duration-300 ease-out ${
                    swipedRowIndex === index ? '-translate-x-10' : ''
                  }`}
                >
                  <div className="flex-1">
                    <Input
                      value={point.name}
                      className="w-full"
                      placeholder="Label"
                      onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="number"
                      value={point.value === 0 ? '' : point.value}
                      placeholder="Value"
                      className="w-full"
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          'value',
                          e.target.value === '' ? 0 : +e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
                <BaseButton
                  classNames={`text-[#B12525] w-10 h-10 flex items-center justify-center absolute right-0 top-1/2 transform -translate-y-1/2 transition-transform duration-300 ease-out ${
                    swipedRowIndex === index ? 'translate-x-0' : 'translate-x-full'
                  }`}
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteRow(index)}
                >
                  <DeleteIcon />
                </BaseButton>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-8">
            <BaseButton
              classNames={`px-3 text-black transition-colors hover:border-[#B12525] w-full`}
              size="sm"
              variant="outline"
              onClick={addNewRow}
              icon={<AddIcon />}
            >
              {t('addRow')}
            </BaseButton>
            <BaseButton
              classNames={`p-3 text-white bg-black hover:bg-black/80 w-full`}
              size="sm"
              variant="outline"
              onClick={handleUpdateChartData}
            >
              {t('saveChanges')}
            </BaseButton>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditDataSheet;
