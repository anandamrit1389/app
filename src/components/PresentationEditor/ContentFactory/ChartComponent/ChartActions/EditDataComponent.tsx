import { ChartData } from '../../../SlideFactory/Slides/ChartSlide';
import EditDataDialog from './EditDataDialog';
import EditDataSheet from './EditDataSheet';

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
  modal?: boolean;
}

const EditDataComponent = ({
  isDataEditing,
  setIsDataEditing,
  chartData,
  addNewRow,
  addNewCol,
  handleUpdateChartData,
  deleteRow,
  deleteColumn,
  handleInputChange,
  modal = true,
}: IProps) => {
  if (modal) {
    return (
      <EditDataDialog
        isDataEditing={isDataEditing}
        setIsDataEditing={setIsDataEditing}
        chartData={chartData}
        addNewRow={addNewRow}
        addNewCol={addNewCol}
        handleUpdateChartData={handleUpdateChartData}
        deleteRow={deleteRow}
        deleteColumn={deleteColumn}
        handleInputChange={handleInputChange}
      />
    );
  }

  return (
    <EditDataSheet
      isDataEditing={isDataEditing}
      setIsDataEditing={setIsDataEditing}
      chartData={chartData}
      handleInputChange={handleInputChange}
      deleteRow={deleteRow}
      addNewRow={addNewRow}
      handleUpdateChartData={handleUpdateChartData}
    />
  );
};

export default EditDataComponent;
