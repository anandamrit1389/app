import { IFeatureSection } from '@/interfaces/landing.interface';

import FeatureIcon1 from '@/assets/landing/feature-icon-1.svg?react';
import FeatureIcon2 from '@/assets/landing/feature-icon-2.svg?react';
import FeatureIcon4 from '@/assets/landing/feature-icon-4.svg?react';

export const selectedFeatureSection: IFeatureSection = {
  label: 'featureTagline',
  title: 'featureTitle',
  features: [
    {
      title: 'featureItem1Title',
      description: 'featureItem1Description',
      icon: <FeatureIcon2 />,
      btnLabel: 'featureItem1Button',
    },
    {
      title: 'featureItem2Title',
      description: 'featureItem2Description',
      icon: <FeatureIcon1 />,
      btnLabel: 'featureItem2Button',
    },
    {
      title: 'featureItem3Title',
      description: 'featureItem3Description',
      icon: <FeatureIcon4 />,
      btnLabel: 'featureItem3Button',
    },
  ],
};
