import './PromptPage.css';

import { PromptPageContext } from '@/contexts/PromptPage.context';
import PromptPageContainer from './PromptPageContainer/PromptPageContainer';
import { TypeParam, usePromptPage } from '@/hooks/usePromptPage';
import useMobile from '@/hooks/useMobile';
import MobilePromptPageContainer from './PromptPageContainer/MobilePromptPageContainer';
import { useParams, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { WorkspaceParam } from '@/types/workspace.type';

const PromptPage = () => {
  const contextValue = usePromptPage();
  const isMobile = useMobile();
  const { type } = useParams();
  const typedType = type as TypeParam;

  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const workspace = query.get('workspace') as WorkspaceParam;

  useEffect(() => {
    contextValue.setType(typedType);
  }, [typedType]);

  useEffect(() => {
    if (workspace) {
      contextValue.setWorkspace(workspace);
    }
  }, [workspace]);

  return (
    <PromptPageContext.Provider value={contextValue}>
      {isMobile ? <MobilePromptPageContainer /> : <PromptPageContainer />}
    </PromptPageContext.Provider>
  );
};

export default PromptPage;
