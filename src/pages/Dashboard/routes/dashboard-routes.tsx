import { Routes, Route, useLocation } from 'react-router-dom';
import Workspace from '../Workspace/Workspace';
import Inspiration from '../Inspiration/Inspiration';
import Templates from '../Templates/Templates';
import PageTransition from '@/components/PageTransition/PageTransition';

import EmptyTeam from '../EmptyTeam';
import Team from '../Team/Team';
import ImageLibrary from '../ImageLibrary/ImageLibrary';
import { useContext } from 'react';
import { AuthContext } from '@/providers/auth.provider';

const DashboardRoutes = () => {
  const location = useLocation();
  const { companyMembershipInfo } = useContext(AuthContext);

  return (
    <PageTransition location={location}>
      <Routes>
        <Route path="/" element={<Workspace />} />
        <Route path="team" element={companyMembershipInfo ? <Team /> : <EmptyTeam />} />
        <Route path="inspiration" element={<Inspiration />} />
        <Route path="templates" element={<Templates />} />
        <Route path="image-library" element={<ImageLibrary />} />
      </Routes>
    </PageTransition>
  );
};

export default DashboardRoutes;
