import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import UsersPage from '../UsersPage';
import SchoolsPage from '../SchoolsPage';
import EnterprisesPage from '../EnterprisesPage';

const AdminPanelRoutes = () => {
  const location = useLocation();
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`${location.pathname}/users`} replace />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="schools" element={<SchoolsPage />} />
      <Route path="enterprises" element={<EnterprisesPage />} />
    </Routes>
  );
};

export default AdminPanelRoutes;
