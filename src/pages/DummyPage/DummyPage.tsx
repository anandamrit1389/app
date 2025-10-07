import { useNavigate } from 'react-router-dom';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { getLastVisitedRouteFromStorage, removeLastVisitedRoute } from '@/helpers/utils/storage';

export const DummyPage = ({ title }: { title: string }) => {
  const navigate = useNavigate();

  const handleRedirect = async () => {
    const lastVisitedRoute = await getLastVisitedRouteFromStorage();
    removeLastVisitedRoute();
    navigate(lastVisitedRoute ? lastVisitedRoute : '/dashboard');
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-2 text-successGreen text-primaryTitle">{title}</h1>
      <BaseButton
        onClick={handleRedirect}
        classNames="text-2xl px-8 py-4 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Dashboard
      </BaseButton>
    </div>
  );
};
