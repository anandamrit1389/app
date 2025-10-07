import { TableData } from '@/components/PresentationEditor/SlideFactory/Slides/SimpleTable';
import EditDataDialog from './EditDataDialog';
import EditDataSheet from './EditDataSheet';

interface IProps {
  isDataEditing: boolean;
  setIsDataEditing: (val: boolean) => void;
  tableData: TableData[];
  addNewRow: () => void;
  addNewColumn: () => void;
  handleUpdateTableData: () => void;
  deleteRow: (index: number) => void;
  deleteColumn: (index: number) => void;
  handleInputChange: (rowIndex: number, colIndex: number, value: string) => void;
  mobile?: boolean;
}

const EditDataComponent = ({
  isDataEditing,
  setIsDataEditing,
  tableData,
  addNewRow,
  addNewColumn,
  handleUpdateTableData,
  deleteRow,
  deleteColumn,
  handleInputChange,
  mobile,
}: IProps) => {
  if (mobile) {
    return (
      <EditDataSheet
        isDataEditing={isDataEditing}
        setIsDataEditing={setIsDataEditing}
        tableData={tableData}
        addNewRow={addNewRow}
        addNewColumn={addNewColumn}
        handleUpdateTableData={handleUpdateTableData}
        deleteRow={deleteRow}
        deleteColumn={deleteColumn}
        handleInputChange={handleInputChange}
      />
    );
  }

  return (
    <EditDataDialog
      isDataEditing={isDataEditing}
      setIsDataEditing={setIsDataEditing}
      tableData={tableData}
      addNewRow={addNewRow}
      addNewColumn={addNewColumn}
      handleUpdateTableData={handleUpdateTableData}
      deleteRow={deleteRow}
      deleteColumn={deleteColumn}
      handleInputChange={handleInputChange}
    />
  );
};

export default EditDataComponent;
