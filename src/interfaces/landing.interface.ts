export interface IFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  btnLabel: string;
}

export interface IFeatureSection {
  label: string;
  title: string;
  features: IFeature[];
}
