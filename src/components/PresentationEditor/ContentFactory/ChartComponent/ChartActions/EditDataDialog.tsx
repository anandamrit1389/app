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
import { ChartData } from '../../../SlideFactory/Slides/ChartSlide';

interface IProps {
  isDataEditing: boolean;
  setIsDataEditing: (val: boolean) => void;
  chartData: ChartData[];
  addNewRow: () => void;
  addNewCol: () => void;
  handleUpdateChartData: () => void;
  deleteRow: (index: number) => void;
  deleteColumn: (key: string) => void;
  handleInputChange: (index: number, key: keyof ChartData, value: string | number) => void;
}

const EditDataDialog = ({
  isDataEditing,
  setIsDataEditing,
  chartData,
  addNewRow,
  addNewCol,
  handleUpdateChartData,
  deleteRow,
  deleteColumn,
  handleInputChange,
}: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  return (
    <Dialog open={isDataEditing} onOpenChange={setIsDataEditing}>
      <DialogContent className="gap-0 p-5 sm:p-8">
        <DialogHeader className="mb-4">
          <DialogTitle>{t('editChartData')}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[400px] w-full overflow-x-auto overflow-y-auto" onWheel={(e) => e.stopPropagation()}>
          {chartData.length !== 0 && (
            <div className="grid grid-flow-col gap-2 py-1 text-sm text-gray-500">
              <div className="min-w-[200px]">
                <p>{t('name')}</p>
              </div>
              {Object.keys(chartData[0])
                .filter((key) => key.startsWith('value'))
                .map((key, index) => (
                  <div key={key} className="min-w-[160px] flex items-center gap-1">
                    <p className="flex-1">{t('value')} {index + 1}</p>
                    <BaseButton
                      classNames="p-0 text-[#B12525] hover:border-[#B12525]"
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteColumn(key)}
                      icon={<DeleteIcon />}
                    />
                  </div>
              ))}
              <div className="min-w-[80px]"></div>
            </div>
          )}

          {chartData.length === 0 && <p className="text-gray-500">{t('addRowToEnterData')}</p>}

          {chartData.map((point, index) => (
            <div
              key={index}
              className="grid grid-flow-col auto-cols-min gap-2 py-1 items-center"
            >
              <div className="min-w-[200px]">
                <Input
                  value={point.name}
                  className="w-full"
                  placeholder="Name"
                  onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                />
              </div>
              {Object.keys(point)
                .filter((key) => key.startsWith('value'))
                .map((key, valueIdx) => (
                  <div key={key} className="min-w-[160px]">
                    <Input
                      type="number"
                      value={point[key as keyof ChartData] === 0 ? '' : point[key as keyof ChartData]}
                      placeholder={`Value ${valueIdx + 1}`}
                      className="w-full"
                      onChange={(e) =>
                        handleInputChange(index, key as keyof ChartData, e.target.value === '' ? 0 : +e.target.value)
                      }
                    />
                  </div>
                ))}
              <div className="min-w-[20px] flex justify-end">
                <BaseButton
                  classNames="px-1 text-[#B12525] transition-colors hover:border-[#B12525]"
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteRow(index)}
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
            onClick={addNewCol}
            icon={<AddIcon />}
            disabled={(!chartData?.[0] || Object.keys(chartData[0]).length >= 5)}
          >
            {t('addColumn')}
          </BaseButton>
          <BaseButton
            classNames="px-3 text-black transition-colors hover:border-[#B12525]"
            size="sm"
            variant="outline"
            onClick={addNewRow}
            icon={<AddIcon />}
          >
            {t('addRow')}
          </BaseButton>
          <BaseButton
            classNames="p-3 text-white bg-black hover:bg-black/80"
            size="sm"
            variant="outline"
            onClick={handleUpdateChartData}
          >
            {t('save')}
          </BaseButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDataDialog;
