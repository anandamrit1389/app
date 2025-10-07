import subscriptionService from '@/api/subscriptionService';
import PaymentSuccessModal from '@/components/Modals/PaymentSuccessModal/PaymentSuccessModal';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PurchaseData } from '@/interfaces/IPayment';
import { analyticsService } from '@/helpers/services/AnalyticsService';

const SuccessPage = ({ mode }: { mode: string }) => {
  const [purchaseData, setPurchaseData] = useState<PurchaseData | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId) {
        setError('No session ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const sessionResponse = await subscriptionService.getSessionData(sessionId);

        if (!sessionResponse) {
          throw new Error('No response received from API');
        }

        setPurchaseData(sessionResponse);
        
        if (sessionResponse) {
          const planType = mode === 'pro' ? 'pro' : 'enterprise';
          const billingCycle = sessionResponse.interval === 'year' ? 'yearly' : 'monthly';
          analyticsService.trackSubscriptionSuccess(
            planType, 
            sessionResponse.amount || 0, 
            sessionResponse.currency || 'USD', 
            billingCycle
          );
        }
      } catch (error: any) {
        setError(error.message || 'Failed to fetch session data');

        setPurchaseData({
          planName: 'Subscription Plan',
          amount: 0,
          nextBillingDate: null,
          status: 'completed',
          paymentMethod: 'Credit Card',
        } as PurchaseData);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-b-2 border-[#FF6B47]"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-red">Invalid Payment Session</h1>
          <p className="mb-4 text-gray-600">No session ID found in the URL.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded bg-[#FF6B47] px-4 py-2 text-white hover:bg-[#e55a41]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      {error && (
        <div className="absolute right-4 top-4 rounded border-l-4 border-yellow-500 bg-yellow-100 p-4 text-yellow-700">
          <p className="font-bold">Warning</p>
          <p>{error}</p>
        </div>
      )}

      <PaymentSuccessModal
        open={true}
        mode={mode}
        onSuccessPage={true}
        purchaseData={purchaseData}
      />
    </div>
  );
};

export default SuccessPage;
