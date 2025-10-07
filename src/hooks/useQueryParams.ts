import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const useQueryParams = (params: string[]) => {
  const [urlParams, setQueryParams] = useState<string[]>([]);
  const location = useLocation();

  useEffect(
    useCallback(() => {
      const queryParams = new URLSearchParams(location.search);
      const exist: string[] = [];

      params.forEach((p) => {
        const param = queryParams.get(p);
        if (param) exist.push(param);
      });

      setQueryParams(exist);
    }, [location.search, params]),
    [window.location.href],
  );

  return urlParams;
};
