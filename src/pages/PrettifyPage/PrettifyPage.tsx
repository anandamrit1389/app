import { useEffect } from 'react';
import { PrettifyContext } from '@/contexts/Prettify.context';
import PrettifyInput from './PrettifyInput';
import { usePrettifyPage } from '@/hooks/usePrettifyPage';
import { useLocation } from 'react-router-dom';
import { WorkspaceParam } from '@/types/workspace.type';
import PrettifyType from './PrettifyType';
import TemplateDrawer from '@/components/DrawersAndSheets/TemplateDrawer/TemplateDrawer';
import useMobile from '@/hooks/useMobile';

const PrettifyPage = () => {
  const contextValue = usePrettifyPage();

  const { search } = useLocation();
  const isMobile = useMobile();
  const query = new URLSearchParams(search);
  const workspace = query.get('workspace') as WorkspaceParam;

  useEffect(() => {
    if (workspace) {
      contextValue.setWorkspace(workspace);
    }
  }, [workspace]);

  return (
    <PrettifyContext.Provider value={contextValue}>
      {contextValue.showTypePage ? <PrettifyType /> : <PrettifyInput />  }
      <TemplateDrawer mobile={isMobile} isPrettify />
    </PrettifyContext.Provider>
  );
};

export default PrettifyPage;
