import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import WorkspaceIcon from '@/assets/browser.svg?react';
import TeamIcon from '@/assets/users-group.svg?react';
import InspirationIcon from '@/assets/sun-low.svg?react';
import TemplatesIcon from '@/assets/template.svg?react';
import ImageLibraryIcon from '@/assets/photo-2.svg?react';
import CoinsIcon from '@/assets/coins.svg?react';
import NavigationLink from './NavigationLink';
import { cn } from '@/lib/utils';
import { AddPresentationMenu } from '../components/presentations';

interface DashboardNavItemsProps {
  activePath: string;
  onOpenInvite: () => void;
}

interface NavItem {
  key: string;
  path: string;
  icon: ReactNode;
  matchPath: (activePath: string) => boolean;
}

const DashboardNavItems = ({ activePath, onOpenInvite }: DashboardNavItemsProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });

  const navItems: NavItem[] = [
    {
      key: 'workspace',
      path: '/dashboard',
      icon: (
        <WorkspaceIcon
          className={cn({
            '[&_path]:stroke-slushPink': activePath === '/en/dashboard',
          })}
        />
      ),
      matchPath: (path) => path === '/en/dashboard',
    },
    {
      key: 'imageLibrary',
      path: '/dashboard/image-library',
      icon: (
        <ImageLibraryIcon
          className={cn('[&>path]:stroke-neutral-500', {
            '[&_path]:stroke-slushPink': activePath.includes('image-library'),
          })}
        />
      ),
      matchPath: (path) => path.includes('image-library'),
    },
    {
      key: 'team',
      path: '/dashboard/team',
      icon: (
        <TeamIcon
          className={cn({
            '[&_path]:stroke-slushPink': activePath.includes('team'),
          })}
        />
      ),
      matchPath: (path) => path.includes('team'),
    },
    {
      key: 'inspiration',
      path: '/dashboard/inspiration',
      icon: (
        <InspirationIcon
          className={cn({
            '[&_path]:stroke-slushPink': activePath.includes('inspiration'),
          })}
        />
      ),
      matchPath: (path) => path.includes('inspiration'),
    },
    {
      key: 'templates',
      path: '/dashboard/templates',
      icon: (
        <TemplatesIcon
          className={cn({
            '[&_path]:stroke-slushPink': activePath.includes('templates'),
          })}
        />
      ),
      matchPath: (path) => path.includes('templates'),
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <AddPresentationMenu />

      {navItems.map((item) => (
        <NavigationLink key={item.key} to={item.path} active={item.matchPath(activePath)}>
          {item.icon} {t(item.key)}
        </NavigationLink>
      ))}

      <BaseButton
        variant="ghost"
        classNames="justify-start font-normal text-[#6B7280] gap-3 py-2 px-3"
        onClick={onOpenInvite}
      >
        <CoinsIcon /> {t('inviteAndEarn')}
      </BaseButton>
    </div>
  );
};

export default DashboardNavItems;
