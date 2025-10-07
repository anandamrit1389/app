import { useLocation } from 'react-router-dom';
import AdminPanelNavItems, { NavItem } from './Nav/AdminPanelNavItems';
import AdminPanelRoutes from './routes';
import DashboardHeader from '@/pages/Dashboard/DashboardHeader/DashboardHeader';
import { getAccessTokenFromStorage } from '@/helpers/utils/storage';
import LocaleNavigate from '@/components/Locales/LocaleNavigate/LocaleNavigate';
import AdminPanelHeader from './AdminPanelHeader';
import { useContext, useMemo } from 'react';
import { AuthContext } from '@/providers/auth.provider';
import { UserRole } from '@/interfaces/IUser';

const navItems: NavItem[] = [
  {
    key: 'users',
    path: '/config/users',
    matchPath: (path) => path === '/en/config/users',
    allowedRoles: [UserRole.Admin, UserRole.Support],
  },
  {
    key: 'schools',
    path: '/config/schools',
    matchPath: (path) => path.includes('schools'),
    allowedRoles: [UserRole.Admin],
  },
  {
    key: 'enterprises',
    path: '/config/enterprises',
    matchPath: (path) => path.includes('enterprises'),
    allowedRoles: [UserRole.Admin],
  },
];

const AdminPanelPage = () => {
  const location = useLocation();

  const { user } = useContext(AuthContext);

  const filteredNavItems = useMemo(() => {
    if (!user) return [];
    return navItems.filter((item) => item.allowedRoles.includes(user.role as UserRole));
  }, [user]);

  if (!getAccessTokenFromStorage()) {
    return <LocaleNavigate to="/" />;
  }

  return (
    <div>
      <DashboardHeader />
      <div className="flex h-svh w-full bg-lightGrey m-auto pt-16 justify-center">
        <div className="flex flex-col w-max-5/6 mt-16">
          <AdminPanelHeader />
          <div className="flex gap-4">
            <div>
              <div className="flex min-w-[260px] max-w-[260px] flex-col bg-white p-6 rounded-lg">
                <AdminPanelNavItems activePath={location?.pathname} navItems={filteredNavItems} />
              </div>
            </div>
            <div className="min-w-[1200px] max-w-[1200px]">
              <AdminPanelRoutes />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
