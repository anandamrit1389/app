import { analytics } from '@/firebase/firebase';
import { logEvent } from 'firebase/analytics';
import {
  setLandingPromptShuffle,
  setLandingPromptSignup,
  setLandingPromptWrite,
} from '../utils/storage';

class AnalyticsService {
  trackPageView(pagePath: string) {
    logEvent(analytics, 'page_view', {
      event: 'page_view',
      page_path: pagePath,
    });
    window.dataLayer?.push({
      event: 'page_view',
      page_path: pagePath,
    });
    window.ttq?.track('pageView', { page_path: pagePath });
  }

  trackAccountCreation(userId: string) {
    logEvent(analytics, 'account_created', {
      user_id: userId,
    });
    window.dataLayer.push({
      event: 'account_created',
      user_id: userId,
    });
    window.ttq?.track('accountCreated', { user_id: userId });
  }

  trackPresentationCreation(presentationId: string) {
    logEvent(analytics, 'presentation_created', {
      presentation_id: presentationId,
    });
    window.dataLayer.push({
      event: 'presentation_created',
      presentation_id: presentationId,
    });
    window.ttq?.track('accountCreated', { presentation_id: presentationId });
  }

  landingPromptWrite() {
    logEvent(analytics, 'landingpage_prompt_write');
    window.dataLayer.push({
      event: 'landingpage_prompt_write',
    });
    window.ttq?.track('landingpagePromptWrite');

    setLandingPromptWrite();
  }

  landingPromptSignup() {
    logEvent(analytics, 'landingpage_prompt_signup');
    window.dataLayer.push({
      event: 'landingpage_prompt_signup',
    });
    window.ttq?.track('landingpagePromptSignup');
    setLandingPromptSignup();
  }

  landingPromptShufle() {
    logEvent(analytics, 'landingpage_prompt_shuffle');
    window.dataLayer.push({
      event: 'landingpage_prompt_shuffle',
    });
    window.ttq?.track('landingpagePromptShuffle');
    setLandingPromptShuffle();
  }

  landingPagePricing() {
    logEvent(analytics, 'landingpage_pricing');
    window.dataLayer.push({
      event: 'landingpage_pricing',
    });
    window.ttq?.track('landingpagePricing');
  }

  landingPageGetStarted() {
    logEvent(analytics, 'landingpage_getstarted');
    window.dataLayer.push({
      event: 'landingpage_getstarted',
    });
    window.ttq?.track('landingpageGetStarted');
  }

  landingPagePreviewStart() {
    logEvent(analytics, 'landingpage_previewStart');
    window.dataLayer.push({
      event: 'landingpage_previewStart',
    });
    window.ttq?.track('landingpagePreviewStart');
  }

  landingPagePreviewFinished() {
    logEvent(analytics, 'landingpage_previewFinished');
    window.dataLayer.push({
      event: 'landingpage_previewFinished',
    });
    window.ttq?.track('landingpagePreviewFinished');
  }

  landingPagePreviewContinue() {
    logEvent(analytics, 'landingpage_previewContinue');
    window.dataLayer.push({
      event: 'landingpage_previewContinue',
    });
    window.ttq?.track('landingpagePreviewContinue');
  }

  landingPageTryAgain() {
    logEvent(analytics, 'landingpage_tryAgain');
    window.dataLayer.push({
      event: 'landingpage_tryAgain',
    });
    window.ttq?.track('landingpageTryAgain');
  }

  inviteAddEmail() {
    logEvent(analytics, 'invite_addEmail');
    window.dataLayer.push({
      event: 'invite_addEmail',
    });
    window.ttq?.track('inviteAddEmail');
  }

  inviteSend() {
    logEvent(analytics, 'invite_send');
    window.dataLayer.push({
      event: 'invite_send',
    });
    window.ttq?.track('inviteSend');
  }

  myAssetsCreateImage() {
    logEvent(analytics, 'myAssets_createImage');
    window.dataLayer.push({
      event: 'myAssets_createImage',
    });
    window.ttq?.track('myAssetsCreateImage');
  }

  myAssetsEditImage() {
    logEvent(analytics, 'myAssets_editImage');
    window.dataLayer.push({
      event: 'myAssets_editImage',
    });
    window.ttq?.track('myAssetsEditImage');
  }

  myAssetsDownloadImage() {
    logEvent(analytics, 'myAssets_downloadImage');
    window.dataLayer.push({
      event: 'myAssets_downloadImage',
    });
    window.ttq?.track('myAssetsDownloadImage');
  }

  workspaceAddLanguage(languageCode: string) {
    logEvent(analytics, 'workspace_addLanguage', {
      language_code: languageCode,
    });
    window.dataLayer.push({
      event: 'workspace_addLanguage',
      language_code: languageCode,
    });
    window.ttq?.track('workspaceAddLanguage', { language_code: languageCode });
  }

  landingPageSignup() {
    logEvent(analytics, 'landingpage.signup');
    window.dataLayer.push({
      event: 'landingpage.signup',
    });
    window.ttq?.track('landingpageSignup');
  }

  landingPageEnhanceStart() {
    logEvent(analytics, 'landingpage.enhanceStart');
    window.dataLayer.push({
      event: 'landingpage.enhanceStart',
    });
    window.ttq?.track('landingpageEnhanceStart');
  }

  // ===== SUBSCRIPTION & REVENUE EVENTS =====
  
  trackSubscriptionModalView(planType: 'pro' | 'enterprise', trigger: 'upgrade_prompt' | 'feature_limit' | 'manual') {
    logEvent(analytics, 'subscription_modal_view', {
      plan_type: planType,
      trigger: trigger,
    });
    window.dataLayer.push({
      event: 'subscription_modal_view',
      plan_type: planType,
      trigger: trigger,
    });
    window.ttq?.track('subscriptionModalView', { plan_type: planType, trigger: trigger });
  }

  trackSubscriptionPlanSelect(planType: string, price: number, currency: string) {
    logEvent(analytics, 'subscription_plan_select', {
      plan_type: planType,
      price: price,
      currency: currency,
    });
    window.dataLayer.push({
      event: 'subscription_plan_select',
      plan_type: planType,
      price: price,
      currency: currency,
    });
    window.ttq?.track('subscriptionPlanSelect', { plan_type: planType, price: price, currency: currency });
  }

  trackSubscriptionStart(planType: string, paymentMethod: 'card' | 'paypal' | 'apple_pay') {
    logEvent(analytics, 'subscription_start', {
      plan_type: planType,
      payment_method: paymentMethod,
    });
    window.dataLayer.push({
      event: 'subscription_start',
      plan_type: planType,
      payment_method: paymentMethod,
    });
    window.ttq?.track('subscriptionStart', { plan_type: planType, payment_method: paymentMethod });
  }

  trackSubscriptionSuccess(planType: string, amount: number, currency: string, billingCycle: 'monthly' | 'yearly') {
    logEvent(analytics, 'subscription_success', {
      plan_type: planType,
      amount: amount,
      currency: currency,
      billing_cycle: billingCycle,
    });
    window.dataLayer.push({
      event: 'subscription_success',
      plan_type: planType,
      amount: amount,
      currency: currency,
      billing_cycle: billingCycle,
    });
    window.ttq?.track('subscriptionSuccess', { plan_type: planType, amount: amount, currency: currency, billing_cycle: billingCycle });
  }

  trackSubscriptionFailure(errorType: string, planType: string, errorCode: string) {
    logEvent(analytics, 'subscription_failure', {
      error_type: errorType,
      plan_type: planType,
      error_code: errorCode,
    });
    window.dataLayer.push({
      event: 'subscription_failure',
      error_type: errorType,
      plan_type: planType,
      error_code: errorCode,
    });
    window.ttq?.track('subscriptionFailure', { error_type: errorType, plan_type: planType, error_code: errorCode });
  }

  trackSubscriptionCancel(reason: string, planType: string, daysActive: number) {
    logEvent(analytics, 'subscription_cancel', {
      reason: reason,
      plan_type: planType,
      days_active: daysActive,
    });
    window.dataLayer.push({
      event: 'subscription_cancel',
      reason: reason,
      plan_type: planType,
      days_active: daysActive,
    });
    window.ttq?.track('subscriptionCancel', { reason: reason, plan_type: planType, days_active: daysActive });
  }

  // Credit purchases
  trackCreditPurchase(creditAmount: number, price: number, currency: string) {
    logEvent(analytics, 'credit_purchase', {
      credit_amount: creditAmount,
      price: price,
      currency: currency,
    });
    window.dataLayer.push({
      event: 'credit_purchase',
      credit_amount: creditAmount,
      price: price,
      currency: currency,
    });
    window.ttq?.track('creditPurchase', { credit_amount: creditAmount, price: price, currency: currency });
  }

  trackCreditUsage(creditType: 'ai_generation' | 'image_creation' | 'export', feature: string, creditsUsed: number) {
    logEvent(analytics, 'credit_usage', {
      credit_type: creditType,
      feature: feature,
      credits_used: creditsUsed,
    });
    window.dataLayer.push({
      event: 'credit_usage',
      credit_type: creditType,
      feature: feature,
      credits_used: creditsUsed,
    });
    window.ttq?.track('creditUsage', { credit_type: creditType, feature: feature, credits_used: creditsUsed });
  }

  // ===== ERROR & PERFORMANCE TRACKING =====

  trackError(errorType: 'javascript' | 'api' | 'validation', errorMessage: string, context: string, userId?: string) {
    logEvent(analytics, 'error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      context: context,
      user_id: userId,
    });
    window.dataLayer.push({
      event: 'error_occurred',
      error_type: errorType,
      error_message: errorMessage,
      context: context,
      user_id: userId,
    });
    window.ttq?.track('errorOccurred', { error_type: errorType, error_message: errorMessage, context: context, user_id: userId });
  }

  trackApiError(endpoint: string, statusCode: number, errorMessage: string, retryAttempt: number = 0) {
    logEvent(analytics, 'api_error', {
      endpoint: endpoint,
      status_code: statusCode,
      error_message: errorMessage,
      retry_attempt: retryAttempt,
    });
    window.dataLayer.push({
      event: 'api_error',
      endpoint: endpoint,
      status_code: statusCode,
      error_message: errorMessage,
      retry_attempt: retryAttempt,
    });
    window.ttq?.track('apiError', { endpoint: endpoint, status_code: statusCode, error_message: errorMessage, retry_attempt: retryAttempt });
  }

  trackValidationError(field: string, errorType: string, formName: string) {
    logEvent(analytics, 'validation_error', {
      field: field,
      error_type: errorType,
      form_name: formName,
    });
    window.dataLayer.push({
      event: 'validation_error',
      field: field,
      error_type: errorType,
      form_name: formName,
    });
    window.ttq?.track('validationError', { field: field, error_type: errorType, form_name: formName });
  }

  // Performance metrics
  trackPageLoadTime(pageName: string, loadTime: number, connectionType?: string) {
    logEvent(analytics, 'page_load_time', {
      page_name: pageName,
      load_time: loadTime,
      connection_type: connectionType,
    });
    window.dataLayer.push({
      event: 'page_load_time',
      page_name: pageName,
      load_time: loadTime,
      connection_type: connectionType,
    });
    window.ttq?.track('pageLoadTime', { page_name: pageName, load_time: loadTime, connection_type: connectionType });
  }

  trackApiResponseTime(endpoint: string, responseTime: number, success: boolean) {
    logEvent(analytics, 'api_response_time', {
      endpoint: endpoint,
      response_time: responseTime,
      success: success,
    });
    window.dataLayer.push({
      event: 'api_response_time',
      endpoint: endpoint,
      response_time: responseTime,
      success: success,
    });
    window.ttq?.track('apiResponseTime', { endpoint: endpoint, response_time: responseTime, success: success });
  }

  trackImageLoadTime(imageSize: number, loadTime: number, imageType: string) {
    logEvent(analytics, 'image_load_time', {
      image_size: imageSize,
      load_time: loadTime,
      image_type: imageType,
    });
    window.dataLayer.push({
      event: 'image_load_time',
      image_size: imageSize,
      load_time: loadTime,
      image_type: imageType,
    });
    window.ttq?.track('imageLoadTime', { image_size: imageSize, load_time: loadTime, image_type: imageType });
  }
}

export const analyticsService = new AnalyticsService();
