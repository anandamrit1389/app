export interface Enhancement {
  enhanceFile: File | null;
  handeAddEnhanceFile: (file: File) => void;
  handleRemoveEnhanceFile: () => void;
  loadEnhanceFile: () => Promise<File | null>;
  thumbnail: string | null;
  setThumbnail: (val: string) => void;
}
