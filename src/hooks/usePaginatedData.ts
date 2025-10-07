import { FetchParams, PaginatedResponse } from '@/interfaces/pagination.interface';
import { useState, useEffect, useCallback } from 'react';

interface UsePaginatedData<T> {
  data: T[];
  loadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

type UsePaginatedOptions = {
  deps?: React.DependencyList;
};

const usePaginatedData = <T>(
  fetchFunction: (params: FetchParams) => Promise<PaginatedResponse<T>>,
  getUniqueKey: (item: T) => string | number,
  initialParams: FetchParams = {},
  limit: number = 10,
  options: UsePaginatedOptions = {},
): UsePaginatedData<T> => {
  const { deps = [] } = options;

  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [depsVersion, setDepsVersion] = useState(0);

  const fetchData = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      const response = await fetchFunction({ ...initialParams, page, limit });
      setData((prev) => {
        const allData = [...prev, ...response.data];
        const uniqueData = Array.from(
          new Map(allData.map((item) => [getUniqueKey(item), item])).values(),
        );
        return uniqueData;
      });
      setHasMore(response.meta.hasMore);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setDepsVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    reset();
  }, deps);

  const loadMore = () => {
    if (isLoading || !hasMore) return;
    setPage((p) => p + 1);
  };

  useEffect(() => {
    fetchData();
  }, [page, depsVersion]);

  return { data, loadMore, hasMore, isLoading };
};

export default usePaginatedData;
