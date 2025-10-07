import { ChartData } from '@/components/PresentationEditor/SlideFactory/Slides/ChartSlide';
import { TFunction } from 'i18next';
import * as XLSX from 'xlsx';

type ProcessDataProps = {
  data: ArrayBuffer;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setProcessedData: (data: ChartData[][] | null) => void;
  t: TFunction;
};

export const processExcelData = async ({
  data,
  setIsLoading,
  setError,
  setProcessedData,
  t,
}: ProcessDataProps) => {
  try {
    setIsLoading(true);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

    const datasets: ChartData[][] = [];
    const currentColumns: number[] = [];

    for (let C = range.s.c; C <= range.e.c; C++) {
      const headerRef = XLSX.utils.encode_cell({ r: range.s.r, c: C });
      const headerCell = worksheet[headerRef];
      if (
        headerCell &&
        typeof headerCell.v === 'string' &&
        headerCell.v.toLowerCase().includes('name')
      ) {
        currentColumns.push(C);
      }
    }
    currentColumns.forEach((nameCol) => {
      const dataset: ChartData[] = [];

      for (let R = range.s.r + 1; R <= range.e.r; R++) {
        const nameRef = XLSX.utils.encode_cell({ r: R, c: nameCol });
        const nameCell = worksheet[nameRef];

        if (!nameCell || nameCell.v === undefined || nameCell.v === '') continue;

        const rowData: ChartData = {
          name: String(nameCell.v),
          value: 0,
        };

        let valueIndex = 1;

        for (let col = nameCol + 1; col <= range.e.c; col++) {
          const valueRef = XLSX.utils.encode_cell({ r: R, c: col });
          const valueCell = worksheet[valueRef];

          const parsedValue = Number(valueCell?.v);

          if (!isNaN(parsedValue)) {
            const key = `value${valueIndex}` as keyof ChartData;
            rowData[key as any] = parsedValue;
            valueIndex++;
          }
        }

        dataset.push(rowData);
      }

      if (dataset.length > 0) {
        datasets.push(dataset);
      }
    });

    if (datasets.length === 0) {
      setError(t('noDataFoundInExcelFile'));
      return;
    }

    setProcessedData(datasets);
    setError(null);
    setIsLoading(false);
  } catch (err) {
    setError(t('errorProcessingExcelFile'));
    setIsLoading(false);
  }
};

type ProcessGoogleSheetDataProps = {
  data: string;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setProcessedData: (data: ChartData[][] | null) => void;
  t: TFunction;
};

export const processGoogleSheetData = async ({
  data,
  setIsLoading,
  setError,
  setProcessedData,
  t,
}: ProcessGoogleSheetDataProps) => {
  try {
    setIsLoading(true);

    let rows: string[][];
    try {
      rows = JSON.parse(data);
    } catch (parseError) {
      console.error('Failed to parse Google Sheets data:', parseError);
      setError(t('errorProcessingGoogleSheetData'));
      return;
    }
    if (!rows || rows.length < 2) {
      setError(t('noDataFoundInGoogleSheet'));
      return;
    }

    const headers = rows[0];

    
    const datasets: ChartData[][] = [];
    const nameColumns: number[] = [];

    headers.forEach((header, index) => {
      if (header && typeof header === 'string' && header.toLowerCase().includes('name')) {

        nameColumns.push(index);
      }
    });
    
    if (nameColumns.length === 0) {

      headers.forEach((header, index) => {
        if (header && typeof header === 'string' && header.trim() !== '') {

          nameColumns.push(index);
        }
      });
    }

    nameColumns.forEach((nameCol) => {
      const dataset: ChartData[] = [];

      const valueColsCount = rows[0].length - (nameCol + 1);

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length <= nameCol) continue;

        const name = row[nameCol];
        if (!name || name.trim() === '') continue;

        const item: ChartData = { name: name.trim(), value: 0 }; 

        for (let j = 0; j < valueColsCount; j++) {
          const colIndex = nameCol + 1 + j;
          const rawValue = row[colIndex];
          const parsedValue = rawValue !== undefined && rawValue !== '' ? Number(rawValue) : 0;

          const key = j === 0 ? 'value' : (`value${j + 1}` as keyof ChartData);
          item[key as any] = parsedValue;
        }

        dataset.push(item);
      }

      if (dataset.length > 0) {
        datasets.push(dataset);
      }
    });

    if (datasets.length === 0) {
      setError(t('noDataFoundInGoogleSheet'));
      return;
    }

    setProcessedData(datasets);
    console.log('datasets', datasets);
    setError(null);
    setIsLoading(false);
  } catch (err) {

    setError(t('errorProcessingGoogleSheetData'));
    setIsLoading(false);
  }
};

