import { lazy, Suspense } from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';

import VerifyPage from '@/pages/Auth/VerifyPage/VerifyPage';
import GoogleCallback from '@/pages/Auth/GoogleCallback/GoogleCallback';
// import AppleCallback from "@/pages/Auth/AppleCallback/AppleCallback";
import MicrosoftCallback from '@/pages/Auth/MicrosoftCallback/MicrosoftCallback';
import AccountSettings from '@/pages/AccountSettings/AccountSettings';
// import SupportPage from "@/pages/SupportPage/SupportPage";
import NotificationsPage from '@/pages/NotificationsPage/NotificationsPage';
import ArticleContent from '@/pages/NotificationsPage/ArticleContent/ArticleContent';
import PrivateRoute from '@/routes/PrivateRoute';
import RootRoute from '@/routes/RootRoute';
import InviteRedirectPage from '@/pages/InviteRedirectPage/InviteRedirectPage';
import BillingSuccessRedirect from '@/pages/BillingSuccessRedirect/BillingSuccessRedirect';
import SuccessPage from '@/pages/SubscriptionPage/SuccessPage/SuccessPage';
import CompanySettings from '@/pages/CompanySettings/CompanySettings';
import { CompanyProvider } from '@/providers/company.provider';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import PresentationAccessRoute from './PresentationAccessRoute';
import CookiePolicy from '@/pages/CookiePolicy/CookiePolicy';
import LicenseAgreement from '@/pages/LicenseAgreement/LicenseAgreement';
import PricingPage from '@/pages/Pricing/Pricing';

const SupportPage = lazy(() => import('@/pages/SupportPage/SupportPage'));
const PromptPage = lazy(() => import('@/pages/PromptPage/PromptPage'));
const PresentationPage = lazy(() => import('@/pages/PresentationPage/PresentationPage'));
const PretiffyPage = lazy(() => import('@/pages/PrettifyPage/PrettifyPage'));
const SignUpPage = lazy(() => import('@/pages/Auth/SignUpPage/SignUpPage'));
const LoginPage = lazy(() => import('@/pages/Auth/LoginPage/LoginPage'));
const Dashboard = lazy(() => import('@/pages/Dashboard/Dashboard'));
const Landing = lazy(() => import('@/pages/Landing/Landing'));
const AdminPanelPage = lazy(() => import('@/pages/AdminPanelPage'));
const TermsOfUse = lazy(() => import('@/pages/TermsOfUse/TermsOfUse'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy/PrivacyPolicy'));
const ResetPasswordPage = lazy(() => import('@/pages/Auth/ResetPasswordPage/ResetPasswordPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/Auth/ForgotPasswordPage/ForgotPasswordPage'));
const InspirationArticles = lazy(() => import('@/pages/Dashboard/Inspiration/InspirationArticles'));

const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootRoute />,
      children: [
        {
          path: ':lng',
          element: (
            <ErrorBoundary>
              <Suspense fallback={<div></div>}>
                <Landing />
              </Suspense>
            </ErrorBoundary>
          ),
        },
        {
          path: ':lng/landing/enhance',
          element: (
            <ErrorBoundary>
              <Suspense fallback={<div></div>}>
                <Landing />
              </Suspense>
            </ErrorBoundary>
          ),
        },
        {
          path: ':lng/generate/:type',
          element: (
            <ErrorBoundary>
              <Suspense fallback={<div></div>}>
                <PrivateRoute>
                  <PromptPage />
                </PrivateRoute>
              </Suspense>
            </ErrorBoundary>
          ),
        },
        {
          path: ':lng/enhance',
          element: (
            <ErrorBoundary>
              <Suspense fallback={<div></div>}>
                <PrivateRoute>
                  <PretiffyPage />
                </PrivateRoute>
              </Suspense>
            </ErrorBoundary>
          ),
        },
        {
          path: ':lng/signup',
          element: (
            <ErrorBoundary>
              <Suspense fallback={<div></div>}>
                <SignUpPage />
              </Suspense>
            </ErrorBoundary>
          ),
        },
        {
          path: ':lng/login',
          element: (
            <ErrorBoundary>
              <Suspense fallback={<div></div>}>
                <LoginPage />
              </Suspense>
            </ErrorBoundary>
          ),
        },
        {
          path: ':lng/forgot',
          element: (
            <ErrorBoundary>
              <Suspense fallback={<div></div>}>
                <ForgotPasswordPage />
              </Suspense>
            </ErrorBoundary>
          ),
        },
        {
          path: 'auth/google/callback',
          element: <GoogleCallback />,
        },
        // {
        //   path: "auth/apple/redirect",
        //   element: <AppleCallback />,
        // },
        {
          path: 'auth/microsoft/callback',
          element: (
            <ErrorBoundary>
              <MicrosoftCallback />
            </ErrorBoundary>
          ),
        },
        {
          path: ':lng/verify',
          element: <VerifyPage />,
        },
        {
          path: ':lng/presentation',
          element: (
            <PresentationAccessRoute>
              <ErrorBoundary>
                <Suspense fallback={<div></div>}>
                  <PresentationPage />
                </Suspense>
              </ErrorBoundary>
            </PresentationAccessRoute>
          ),
        },
        {
          path: ':lng/presentation/:alias',
          element: (
            <PresentationAccessRoute>
              <ErrorBoundary>
                <Suspense fallback={<div></div>}>
                  <PresentationPage />
                </Suspense>
              </ErrorBoundary>
            </PresentationAccessRoute>
          ),
        },
        {
          path: ':lng/dashboard/*',
          element: (
            <PrivateRoute>
              <ErrorBoundary>
                <Suspense fallback={<div></div>}>
                  <Dashboard />
                </Suspense>
              </ErrorBoundary>
            </PrivateRoute>
          ),
        },
        {
          path: ':lng/config/*',
          element: (
            <PrivateRoute>
              <ErrorBoundary>
                <Suspense fallback={<div></div>}>
                  <AdminPanelPage />
                </Suspense>
              </ErrorBoundary>
            </PrivateRoute>
          ),
        },
        {
          path: ':lng/profile',
          element: (
            <PrivateRoute>
              <AccountSettings />
            </PrivateRoute>
          ),
        },
        {
          path: ':lng/company',
          element: ['prod'].includes(import.meta.env.VITE_NODE_ENV) ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <PrivateRoute>
              <CompanyProvider>
                <CompanySettings />
              </CompanyProvider>
            </PrivateRoute>
          ),
        },
        {
          path: ':lng/notifications/',
          element: (
            <PrivateRoute>
              <NotificationsPage />
            </PrivateRoute>
          ),
          children: [
            {
              path: ':id',
              element: <ArticleContent />,
            },
          ],
        },
        {
          path: ':lng/terms-of-use',
          element: (
            <ErrorBoundary>
              <Suspense fallback={<div></div>}>
                <TermsOfUse />
              </Suspense>
            </ErrorBoundary>
          ),
        },
        {
          path: ':lng/privacy-policy',
          element: (
            <ErrorBoundary>
              <Suspense fallback={<div></div>}>
                <PrivacyPolicy />
              </Suspense>
            </ErrorBoundary>
          ),
        },
        {
          path: ':lng/cookie-policy',
          element: (
            <ErrorBoundary>
              <Suspense fallback={<div></div>}>
                <CookiePolicy />
              </Suspense>
            </ErrorBoundary>
          ),
        },
        {
          path: ':lng/license-agreement',
          element: (
            <ErrorBoundary>
              <Suspense fallback={<div></div>}>
                <LicenseAgreement />
              </Suspense>
            </ErrorBoundary>
          ),
        },

        {
          path: ':lng/articles/:slug',
          element: (
            <ErrorBoundary>
              <Suspense fallback={<div></div>}>
                <InspirationArticles />
              </Suspense>
            </ErrorBoundary>
          ),
        },
        {
          path: ':lng/support',
          element: (
            <ErrorBoundary>
              <Suspense fallback={<div></div>}>
                <PrivateRoute>
                  <SupportPage />
                </PrivateRoute>
              </Suspense>
            </ErrorBoundary>
          ),
        },
        {
          path: ':lng/subscription/pro/success',
          element: (
            <PrivateRoute>
              <SuccessPage mode="pro" />
            </PrivateRoute>
          ),
        },
        {
          path: ':lng/subscription/enterprise/success',
          element: (
            <PrivateRoute>
              <SuccessPage mode="enterprise" />
            </PrivateRoute>
          ),
        },
        {
          path: ':lng/payment/credit/success',
          element: (
            <PrivateRoute>
              <SuccessPage mode="credit" />
            </PrivateRoute>
          ),
        },
        {
          path: ':lng/subscription/cancel',
          element: (
            <PrivateRoute>
              <Navigate to="/dashboard" replace />
            </PrivateRoute>
          ),
        },
        {
          path: ':lng/payment/cancel',
          element: (
            <PrivateRoute>
              <Navigate to="/dashboard" replace />
            </PrivateRoute>
          ),
        },
        {
          path: ':lng/billing/success',
          element: <BillingSuccessRedirect />,
        },
        {
          path: ':lng/register',
          element: <InviteRedirectPage />,
        },
        {
          path: ':lng/reset',
          element: (
            <ErrorBoundary>
              <Suspense fallback={<div></div>}>
                <ResetPasswordPage />
              </Suspense>
            </ErrorBoundary>
          ),
        },
        {
          path: ':lng/pricing',
          element: (
            <ErrorBoundary>
              <Suspense fallback={<div></div>}>
                <PricingPage />
              </Suspense>
            </ErrorBoundary>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;
