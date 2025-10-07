import '@/App.scss';
import '@/editor.variables.scss';
import { Toaster } from '@/components/ui/sonner';
import AppRoutes from '@/routes/app-routes';
import SocketProvider from '@/contexts/Websocket.context';
import useTempUser from '@/hooks/useTempUser';
import { UserContext } from '@/contexts/User.context';
import AuthProvider from '@/providers/auth.provider';
import { SubscriptionModalProvider } from './contexts/SubscriptionModalContext';
import useRequestCounter from '@/hooks/useRequestCounter';
import { InfoModalProvider } from './contexts/InfoModalContext';
import InfoModal from './components/Modals/InfoModal';
import { PricingProvider } from '@/contexts/Pricing.context';
import CreditsPackModal from './components/Modals/CreditsPackModal';
import SubscriptionModal from './components/Modals/SubscriptionModal/SubscriptionModal';
import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useVersionChecker } from './hooks/useVersionChecker';
import EnhancementProvider from './providers/enhancement.provider';

function App() {
  const { tempUser, handleUpdateTempUser } = useTempUser();
  const { t } = useTranslation();

  useRequestCounter();
  useVersionChecker();

  return (
    <AuthProvider>
      <EnhancementProvider>
        <SocketProvider>
          <UserContext.Provider value={{ tempUser, handleUpdateTempUser }}>
            <SubscriptionModalProvider>
              <InfoModalProvider>
                <PricingProvider>
                  <HelmetProvider>
                    <main className="shrink-0 grow basis-auto">
                      <AppRoutes />
                      <Toaster richColors />
                      <CreditsPackModal />
                      <SubscriptionModal
                        ctaText={t('subscriptionModal.cta')}
                        freeText={t('subscriptionModal.ctaFree')}
                      />
                      <InfoModal />
                    </main>
                  </HelmetProvider>
                </PricingProvider>
              </InfoModalProvider>
            </SubscriptionModalProvider>
          </UserContext.Provider>
        </SocketProvider>
      </EnhancementProvider>
    </AuthProvider>
  );
}

export default App;
