import React, { useState, useEffect, ReactNode } from 'react';
import { CompanyInfo, CompanyDetails } from '@/interfaces/companies';
import { CompanyContext } from '@/contexts/Company.context';
import CompanyService from '@/api/companyService';

interface CompanyProviderProps {
  children: ReactNode;
}

export const CompanyProvider: React.FC<CompanyProviderProps> = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const loadCompany = async () => {
    setLoading(true);
    const data = await CompanyService.getComanyInfo();
    setCompanyInfo(data);
    setLoading(false);
  };

  const loadCompanyDetails = async () => {
    setLoading(true);
    const data = await CompanyService.getComanyDetails();
    setCompanyDetails(data);
    setLoading(false);
  };

  const uploadCompanyFont = async (formData: FormData) => {
    setLoading(true);
    const data = await CompanyService.uploadFont(formData);
    if (data) {
      setCompanyInfo(data);
    }
    setLoading(false);
  };

  const handleLocalUpdateCompanyInfo = (companyInfo: CompanyInfo) => {
    setCompanyInfo(companyInfo);
  };

  const handleUpdateCompanyInfo = async (info: Partial<CompanyInfo>) => {
    const data = await CompanyService.updateCompanyInfo(info);
    if (data) {
      setCompanyInfo(data);
    }
  };

  useEffect(() => {
    loadCompany();
    loadCompanyDetails();
  }, []);

  return (
    <CompanyContext.Provider
      value={{
        companyInfo,
        companyDetails,
        loading,
        loadCompany,
        loadCompanyDetails,
        handleLocalUpdateCompanyInfo,
        handleUpdateCompanyInfo,
        uploadCompanyFont,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
