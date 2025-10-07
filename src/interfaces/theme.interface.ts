export interface ThemeColors {
  backgroundColor: string;
  headlineColor: string;
  textColor: string;
  accentColor: string;
  addition?: string;
  addition2?: string;
  chartColor?: string;
}

export interface ThemeSchema {
  id: string;
  colors: ThemeColors;
  templates: string[];
}

export interface ThemeCatalog {
  [key: string]: ThemeSchema;
}
