import CapabilityIcon1 from '@/assets/landing/capability-icon-1.svg?react';
import CapabilityIcon2 from '@/assets/landing/capability-icon-2.svg?react';
import CapabilityIcon3 from '@/assets/landing/capability-icon-3.svg?react';

interface ICapability {
  icon: React.ReactNode;
  title: React.ReactNode;
  titleKey: string;
  description: string;
}

export const capabilities: ICapability[] = [
  {
    icon: <CapabilityIcon1 />,
    title: (
      <>
        Stay <span className="underline-svg underline-section">empowered</span> with our AI tools
      </>
    ),
    titleKey: 'landing.capabilitiesItem1Title',
    description: 'capabilitiesItem1Description',
  },
  {
    icon: <CapabilityIcon2 />,
    title: <>Consistency</>,
    titleKey: 'capabilitiesItem2Title',
    description: 'capabilitiesItem2Description',
  },
  {
    icon: <CapabilityIcon3 />,
    title: <>Template quality content.</>,
    titleKey: 'capabilitiesItem3Title',
    description: 'capabilitiesItem3Description',
  },
];
