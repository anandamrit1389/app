import { useTranslation } from 'react-i18next';

import NavigationLink from './NavigationLink';
import { UserRole } from '@/interfaces/IUser';

interface AdminPanelNavItemsProps {
  activePath: string;
  navItems: NavItem[];
}

export interface NavItem {
  key: string;
  path: string;
  matchPath: (activePath: string) => boolean;
  allowedRoles: UserRole[];
}

const AdminPanelNavItems = ({ activePath, navItems }: AdminPanelNavItemsProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'adminPanel' });

  return (
    <div className="flex flex-col gap-2">
      {navItems.map((item) => (
        <NavigationLink key={item.key} to={item.path} active={item.matchPath(activePath)}>
          {t(item.key)}
        </NavigationLink>
      ))}
    </div>
  );
};

export default AdminPanelNavItems;
