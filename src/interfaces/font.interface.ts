export interface IFont {
  name: string;
  label: string;
  key?: string;
  link: string;
}

export interface IFontSet {
  header: IFont | null | undefined;
  body: IFont | null | undefined;
}

export interface FontScheme {
  id: string;
  fonts: IFontSet;
  templates?: string[];
}

export interface IFontCatalog {
  [key: string]: IFont;
}
