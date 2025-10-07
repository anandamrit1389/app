import authService from '@/api/authService';
import AuthService from '@/api/authService';
import { TRACKING_CONFIG } from '@/helpers/constants/storage.const';
import { applyExtraFont } from '@/helpers/utils/fonst';
import {
  getAccessTokenFromStorage,
  getCompanyMembershipInfo,
  getUserInfoFromStorage,
  setCompanyMembershipInfo,
  setUserInfoToStorage,
} from '@/helpers/utils/storage';
import { applyThemes } from '@/helpers/utils/themes';
import { CompanyMembership } from '@/interfaces/companies';
import { FeatureAccess, FeatureKey, User, UserMission } from '@/interfaces/IUser';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AuthContextProps {
  children: ReactNode;
}

interface UserInfo {
  user?: User | null | undefined;
  accessToken?: string | null | undefined;
}

interface UserInfoContext extends UserInfo {
  handleUserInfo: (user: UserInfo) => void;
  handleMembeshipInfo: (info: CompanyMembership) => void;
  handleLogout: () => void;
  handleRefreshProfile: () => void;
  hasActiveSubscription: boolean;
  hasBusinessSubscription: boolean;
  companyMembershipInfo: CompanyMembership | null | undefined;
  userMission?: UserMission | null;
  featuresAccess: Record<FeatureKey, FeatureAccess>;
}

export interface InviteCount {
  totalInvites: number;
  acceptedInvites: number;
}

const initFeaturesAccess: Record<FeatureKey, FeatureAccess> = {
  [FeatureKey.CUSTOM_COLORS]: { hasAccess: false },
  [FeatureKey.COMPANY_CONFIGURATION]: { hasAccess: false },
  [FeatureKey.VOICE_FEATURE]: { hasAccess: false },
};

const initialUserInfo: UserInfo = {
  user: getUserInfoFromStorage(),
  accessToken: getAccessTokenFromStorage(),
};

const initMembershipInfo: CompanyMembership | null | undefined = getCompanyMembershipInfo();

const initialAuthContext: UserInfoContext = {
  ...initialUserInfo,
  handleUserInfo: () => {},
  handleMembeshipInfo: () => {},
  handleLogout: () => {},
  handleRefreshProfile: () => {},
  hasActiveSubscription: false,
  hasBusinessSubscription: false,
  companyMembershipInfo: initMembershipInfo,
  userMission: null,
  featuresAccess: initFeaturesAccess,
};

export const AuthContext = createContext<UserInfoContext>(initialAuthContext);

const AuthProvider = ({ children }: AuthContextProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo);

  const [membershipInfo, setMembershipInfo] = useState<CompanyMembership | null | undefined>(
    initMembershipInfo,
  );

  useEffect(() => {
    if (userInfo.user) {
      setUserInfoToStorage(userInfo.user);
    }
  }, [userInfo]);

  const handleUserInfo = (userData: UserInfo) => {
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      ...userData,
    }));
  };

  const handleMembeshipInfo = (infoData: CompanyMembership) => {
    setCompanyMembershipInfo(infoData);

    if (infoData.companyFonts && infoData.fontId) {
      applyExtraFont({ id: infoData.fontId, fonts: infoData.companyFonts });
    }

    if (infoData.themeColors && infoData.themeId) {
      applyThemes([{ id: infoData.themeId, colors: infoData.themeColors, templates: [] }]);
    }

    setMembershipInfo(infoData);
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error(error);
    } finally {
      setUserInfo({ user: null, accessToken: null });
      Object.keys(localStorage).forEach((key) => {
        if (key !== TRACKING_CONFIG) {
          localStorage.removeItem(key);
        }
      });
      document.cookie = 'CookieConsent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/';
    }
  };

  const handleRefreshProfile = async () => {
    const resp = await authService.getProfile();
    handleUserInfo({
      user: resp.data,
    });
  };

  const hasActiveSubscription = !!userInfo.user?.subscription?.activeSubscription;

  const hasBusinessSubscription =
    userInfo.user?.subscription?.activeSubscription?.type === 'business';

  const userMission = userInfo.user?.mission;

  const featuresAccess = userInfo.user?.featuresAccess || initFeaturesAccess;

  return (
    <AuthContext.Provider
      value={{
        user: userInfo.user,
        accessToken: userInfo.accessToken,
        companyMembershipInfo: membershipInfo,
        handleUserInfo,
        handleLogout,
        handleMembeshipInfo,
        hasActiveSubscription,
        hasBusinessSubscription,
        userMission,
        featuresAccess,
        handleRefreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
