import { useContext, useEffect, useRef, useState } from 'react';
import { PresentationContext } from '@/contexts/Presentation.context';
import { getSlideVariation } from '../../../../helpers/utils/renderHelpers';
import { ISlide } from '../../../../interfaces/ISlides';
import TextComponent from '../../ContentFactory/TextComponent/TextComponent';
import AnimatedText from '../../ContentFactory/TextComponent/AnimatedText';
import AIStar from '@/assets/ai-stars-1.svg?react';
import { mobileTableVariations, tableVariations } from './variations/simple-table';
import { cn } from '@/lib/utils';
import EditDataComponent from '../../ContentFactory/TableComponent/TableActions/EditDataComponent';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import TableActions from '../../ContentFactory/TableComponent/TableActions/TableAction';
import useMobile from '@/hooks/useMobile';
import { updateTranslatableField } from '@/helpers/utils/updateTranslatabeField';

export type TableData = string[];

interface IProps {
  slide: ISlide;
  isPreview?: boolean;
  mobile?: boolean;
}

const SimpleTable = ({ slide, isPreview, mobile }: IProps) => {
  const [isDataEditing, setIsDataEditing] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const isMobile = useMobile();
  const variation = mobile
    ? getSlideVariation(mobileTableVariations, slide.variation)
    : getSlideVariation(tableVariations, 'default');

  const { updateSlide, currentElement, selectedLanguage, originLanguage } =
    useContext(PresentationContext);

  const getCurrentTableData = (): TableData[] => {
    if (originLanguage === selectedLanguage) {
      return slide.tableData || [];
    }
    return slide.tableDataTranslations?.[selectedLanguage] || slide.tableData || [];
  };

  useEffect(() => {
    document.addEventListener('click', handleisEditingClick);

    return () => {
      document.removeEventListener('click', handleisEditingClick);
    };
  }, []);

  const handleInputChange = (rowIndex: number, colIndex: number, value: string) => {
    const currentData = getCurrentTableData();
    const updatedData = [...currentData];
    if (!updatedData[rowIndex]) return;
    updatedData[rowIndex][colIndex] = value;
    
    const updatedSlide = updateTranslatableField(
      slide,
      'tableData',
      updatedData,
      selectedLanguage,
      originLanguage === selectedLanguage,
    );
    
    updateSlide?.(updatedSlide);
  };

  const addNewRow = () => {
    const currentData = getCurrentTableData();
    const columnCount = currentData[0]?.length;
    const newRow = new Array(columnCount).fill('');
    const updatedData = [...currentData, newRow];
    
    const updatedSlide = updateTranslatableField(
      slide,
      'tableData',
      updatedData,
      selectedLanguage,
      originLanguage === selectedLanguage,
    );
    
    updateSlide?.(updatedSlide);
  };

  const addNewColumn = () => {
    const currentData = getCurrentTableData();
    const updatedData = currentData.map((row) => [...row, '']);
    
    const updatedSlide = updateTranslatableField(
      slide,
      'tableData',
      updatedData,
      selectedLanguage,
      originLanguage === selectedLanguage,
    );
    
    updateSlide?.(updatedSlide);
  };

  const deleteRow = (index: number) => {
    const currentData = getCurrentTableData();
    const updatedData = currentData.filter((_, i) => i !== index);
    
    const updatedSlide = updateTranslatableField(
      slide,
      'tableData',
      updatedData,
      selectedLanguage,
      originLanguage === selectedLanguage,
    );
    
    updateSlide?.(updatedSlide);
  };

  const deleteColumn = (index: number) => {
    const currentData = getCurrentTableData();
    const updatedData = currentData.map((row) => row.filter((_, i) => i !== index));
    
    const updatedSlide = updateTranslatableField(
      slide,
      'tableData',
      updatedData,
      selectedLanguage,
      originLanguage === selectedLanguage,
    );
    
    updateSlide?.(updatedSlide);
  };

  const handleUpdateData = () => {
    setIsEditing(false);
    setIsDataEditing(false);
  };

  const handleActions = (event: React.MouseEvent) => {
    setMenuPosition({ x: event.clientX, y: event.clientY });
    setIsOpen(true);
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName.toLowerCase() === 'textarea') {
      setIsEditing(false);
      return;
    }

    if (!isPreview) {
      setIsEditing(true);
    }
  };

  const handleIsDataEditingChange = (value: boolean) => {
    handleUpdateData();
    setIsDataEditing(value);
  };

  const handleisEditingClick = (event: MouseEvent) => {
    if (buttonRef.current && buttonRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    if (tableRef.current && tableRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setIsEditing(false);
  };

  const handleUpdateField = (val: string, field: 'title' | 'subtitle') => {
    const updSlide = updateTranslatableField(
      slide,
      field,
      val,
      selectedLanguage,
      originLanguage === selectedLanguage,
    );

    updateSlide?.(updSlide);
  };

  if(!getCurrentTableData() || getCurrentTableData().length === 0) {
    return null
  }

  // Loading state
  if (currentElement && currentElement.slideId === slide.id) {
    const tableData = getCurrentTableData();
    const headers = tableData[0] || [];
    const rows = tableData.slice(1);

    return (
      <div className={variation?.pageContainerClassName}>
        <AnimatedText
          classNames={variation?.slideHeadingClassName}
          text={slide.titleTranslations?.[selectedLanguage] ?? slide.title ?? ''}
          speed={20}
          skipSwitch={isPreview}
        />
        <AnimatedText
          classNames={variation?.subtitleClassName}
          text={slide.subtitleTranslations?.[selectedLanguage] ?? slide.subtitle ?? ''}
          speed={10}
          delay={50}
          skipSwitch={isPreview}
        />
        <div className={variation?.containerClassName}>
          <table className={variation?.tableClassName}>
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className={`${
                      (index || slide.variation !== 'default') && variation?.tableHeaderClassName
                    }`}
                  >
                    <AnimatedText
                      classNames={cn(variation?.plainTextClassName, 'font-bold')}
                      text={`${index || slide.variation !== 'default' ? header : ''}`}
                      speed={10}
                      delay={100 + index * 10}
                      skipSwitch={isPreview}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className={variation?.tableRowClassName}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={cn(
                        variation?.tableCellClassName,
                        !cellIndex && slide.variation === 'default' && 'bg-shape',
                      )}
                    >
                      <AnimatedText
                        classNames={cn(
                          variation?.plainTextClassName,
                          cellIndex === 0 && 'font-bold',
                        )}
                        text={cell}
                        speed={5}
                        delay={200 + rowIndex * 50 + cellIndex * 5}
                        skipSwitch={isPreview}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Edit state
  const currentTableData = getCurrentTableData();
  const headers = currentTableData[0] || [];
  const rows = currentTableData.slice(1);

  const handleUpdateTableData = (value: string, rowIndex: number, cellIndex: number) => {
    const tableData = getCurrentTableData();
    if (!tableData) return;
    
    const newTableData = [...tableData];
    if (newTableData[rowIndex]) {
      newTableData[rowIndex] = [...newTableData[rowIndex]];
      newTableData[rowIndex][cellIndex] = value;

      const updatedSlide = updateTranslatableField(
        slide,
        'tableData',
        newTableData,
        selectedLanguage,
        originLanguage === selectedLanguage,
      );

      updateSlide?.(updatedSlide);
    }
  };

  return (
    <div className={variation?.pageContainerClassName}>
      <TextComponent
        className={variation?.slideHeadingClassName}
        content={slide.titleTranslations?.[selectedLanguage] ?? slide.title}
        isPreview={isPreview}
        onUpdate={(val) => handleUpdateField(val, 'title')}
      />
      <TextComponent
        className={variation?.subtitleClassName}
        content={slide.subtitleTranslations?.[selectedLanguage] ?? slide.subtitle ?? ''}
        isPreview={isPreview}
        onUpdate={(val) => handleUpdateField(val, 'subtitle')}
      />
      <div
        onClick={handleClick}
        ref={tableRef}
        className={`relative ${variation?.containerClassName} ${
          isEditing
            ? 'rounded-sm outline outline-1 outline-offset-8 outline-grey/25'
            : 'outline-none'
        }`}
      >
        <table className={variation?.tableClassName}>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`table-text ${
                    (index || slide.variation !== 'default') && variation?.tableHeaderClassName
                  }`}
                >
                  {index && slide.variation === 'default' ? (
                    <TextComponent
                      className={cn(variation?.plainTextClassName, 'font-bold')}
                      content={header}
                      isPreview={isPreview}
                      onUpdate={(val) => handleUpdateTableData(val, 0, index)}
                    />
                  ) : (
                    <TextComponent
                      className={cn(variation?.plainTextClassName, 'font-bold')}
                      content={`${index || slide.variation !== 'default' ? header : ''}`}
                      isPreview={isPreview}
                      onUpdate={(val) => handleUpdateTableData(val, 0, index)}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={cn(
                      variation?.tableCellClassName,
                      !cellIndex && slide.variation === 'default' && 'bg-shape',
                    )}
                  >
                    <TextComponent
                      className={cn(variation?.plainTextClassName, !cellIndex && 'font-bold')}
                      content={cell}
                      isPreview={isPreview}
                      onUpdate={(val) => handleUpdateTableData(val, rowIndex + 1, cellIndex)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {isEditing && (
          <div ref={buttonRef} className="absolute left-[17%] top-[-60px] z-30">
            <TableActions
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              x={menuPosition.x}
              y={menuPosition.y}
              setIsDataEditing={setIsDataEditing}
              setIsOpen={setIsOpen}
            />
            <BaseButton
              variant="secondary"
              classNames="rounded-full size-12 p-0 shadow-xl"
              onClick={handleActions}
            >
              <AIStar />
            </BaseButton>
          </div>
        )}

        <EditDataComponent
          isDataEditing={isDataEditing}
          setIsDataEditing={handleIsDataEditingChange}
          tableData={getCurrentTableData()}
          addNewRow={addNewRow}
          addNewColumn={addNewColumn}
          handleUpdateTableData={handleUpdateData}
          deleteRow={deleteRow}
          deleteColumn={deleteColumn}
          handleInputChange={handleInputChange}
          mobile={isMobile}
        />
      </div>
    </div>
  );
};

export default SimpleTable;
