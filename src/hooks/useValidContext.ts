import { useContext } from 'react';
import { PromptPageContext } from '@/contexts/PromptPage.context';
import { PrettifyContext } from '@/contexts/Prettify.context';

const useValidContext = () => {
  const promptContext = useContext(PromptPageContext);
  const pretContext = useContext(PrettifyContext);

  return Object.keys(promptContext)?.length > 0 ? promptContext : pretContext;
};

export default useValidContext;
