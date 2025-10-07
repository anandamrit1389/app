import presentationService from '@/api/presentationService';
import { analyticsService } from '@/helpers/services/AnalyticsService';
import { removePresentationIdForCopyToStorage } from '@/helpers/utils/storage';
import { IPresentation, Scope } from '@/interfaces/ISlides';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const cache = new Map<string, { data: IPresentation[]; totalCount: number; at: number }>();
const TTL_MS = 60_000;

type Options = {
  enabled?: boolean;
};

export interface IUseDashboard {
  presentations: IPresentation[];
  showPrettifyModal: boolean;
  setShowPrettifyModal: (val: boolean) => void;
  getPresentations: (page?: number) => void;
  refetch: (param: { silent?: boolean }) => void;
  loading: boolean;
  activeSort: string;
  setActiveSort: (val: string) => void;
  loadMorePresentations: () => void;
  handleDeletePresentation: (presentationId: string) => void;
  handleDuplicatePresentation: (presentationId: string) => void;
  handleCopyPresentation: (presentationId: string, lang: string) => void;
  isCopied: boolean;
  loadingMore: boolean;
  handleRestorePresentation: (presentationId: string) => Promise<void>;
  handleDeletePermanently: (presentationId: string) => Promise<void>;
  handleFavourite: (presentationId: string, isFavourite: boolean) => Promise<void>;
  handleMoveToTeam: (presentationId: string) => void;
  presentationsExist: boolean;
}

export const useDashboard = (scope: Scope, opts: Options = {}): IUseDashboard => {
  const enabled = opts.enabled ?? true;

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showPrettifyModal, setShowPrettifyModal] = useState(false);
  const [presentations, setPresentations] = useState<IPresentation[]>([]);
  const [presentationsExist, setPresentationsExist] = useState<boolean>(false);
  const [activeSort, setActiveSort] = useState('last updated');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const [initiated, setInitiated] = useState(false);

  const totalCountRef = useRef<number | null>(null);
  const cacheKey = `${scope}:${activeSort}`;

  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });
  const suppressLoadersRef = useRef(false);

  const setLoadingSafe = (v: boolean) => {
    if (!suppressLoadersRef.current) setLoading(v);
  };
  const setLoadingMoreSafe = (v: boolean) => {
    if (!suppressLoadersRef.current) setLoadingMore(v);
  };

  const refetch = async ({ silent = false }: { silent?: boolean } = {}) => {
    suppressLoadersRef.current = silent;
    try {
      await getPresentations(1, true);
    } finally {
      suppressLoadersRef.current = false;
    }
  };

  useEffect(() => {
    if (page > 1) {
      getPresentations(page, false);
    }
  }, [page]);

  useEffect(() => {
    const localKey = `${scope}:${activeSort}`;
    const hit = cache.get(localKey);

    if (hit && Date.now() - hit.at < TTL_MS) {
      setPresentations(hit.data);
      totalCountRef.current = hit.totalCount;
      setHasMore(hit.data.length < hit.totalCount);
      setLoading(false);
      setInitiated(hit.data.length > 0);
      setPage(1);
    } else {
      setHasMore(true);
      setPage(1);
      getPresentations(1, true);
    }
  }, [scope, activeSort]);

  const getPresentations = async (page?: number, clear?: boolean) => {
    if (!enabled) return;

    if (clear) {
      setLoadingSafe(true);
    } else {
      setLoadingMoreSafe(true);
    }

    const localKey = `${scope}:${activeSort}`;
    try {
      const { presentations: data, totalCount } = await presentationService.getPresentations(
        activeSort,
        scope,
        page,
      );

      if (data?.length > 0 && !initiated) {
        setPresentationsExist(true);
      }

      setInitiated(true);

      totalCountRef.current = totalCount;

      setPresentations((prevPresentations) => {
        const base = clear ? [] : prevPresentations;
        const merged = [...base, ...data].filter(
          (p, i, arr) => arr.findIndex((x) => x.id === p.id) === i,
        );
        setHasMore(merged.length < totalCount);
        cache.set(localKey, { data: merged, totalCount, at: Date.now() });
        return merged;
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMorePresentations = () => {
    if (!hasMore) return;
    setPage((prevPage) => prevPage + 1);
  };

  const handleDeletePresentation = async (presentationId: string) => {
    const pres = await presentationService.removePresentation(presentationId);
    if (pres.workspace === 'team') return;

    setPresentations((prev) => {
      const next = prev.filter((p) => p.id !== presentationId);
      const total = totalCountRef.current ?? next.length;
      setHasMore(next.length < total);
      cache.set(cacheKey, { data: next, totalCount: total, at: Date.now() });
      return next;
    });
  };

  const handleDuplicatePresentation = async (presentationId: string) => {
    const newPresentation = await presentationService.duplicatePresentation(presentationId);
    if (newPresentation) {
      analyticsService.trackPresentationCreation(newPresentation.id);
      if (newPresentation.workspace === 'team') return;
      setPresentations((prev) => {
        const next = [newPresentation, ...prev.filter((p) => p.id !== newPresentation.id)];
        const total = (totalCountRef.current ?? prev.length) + 1;
        totalCountRef.current = total;
        setHasMore(next.length < total);
        cache.set(cacheKey, { data: next, totalCount: total, at: Date.now() });
        return next;
      });
    }
  };

  const handleCopyPresentation = async (presentationId: string, lang: string) => {
    try {
      setLoading(true);
      const response = await presentationService.copyPresentation(presentationId, lang);
      analyticsService.trackPresentationCreation(response.id);
      removePresentationIdForCopyToStorage();
      toast.success(t('copiedMessage'));
      setIsCopied(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestorePresentation = async (presentationId: string) => {
    const pres = await presentationService.restorePresentation(presentationId);
    if (pres.workspace === 'team') return;

    setPresentations((prev) => {
      const next = prev.filter((p) => p.id !== presentationId);
      const total = totalCountRef.current ?? next.length;
      setHasMore(next.length < total);
      cache.set(cacheKey, { data: next, totalCount: total, at: Date.now() });
      return next;
    });
    toast.success(t('presentationRestored'));
  };

  const handleDeletePermanently = async (presentationId: string) => {
    await presentationService.deletePermanently(presentationId);
    setPresentations((prev) => {
      const next = prev.filter((p) => p.id !== presentationId);
      const total = totalCountRef.current ?? next.length;
      setHasMore(next.length < total);
      cache.set(cacheKey, { data: next, totalCount: total, at: Date.now() });
      return next;
    });
    toast.success(t('presentationDeletedPermanently'));
  };

  const handleMoveToTeam = async (presentationId: string) => {
    await presentationService.updateWorkspace(presentationId, 'team');
    setPresentations((prev) => {
      const next = prev.filter((p) => p.id !== presentationId);
      const total = totalCountRef.current ?? next.length;
      setHasMore(next.length < total);
      cache.set(cacheKey, { data: next, totalCount: total, at: Date.now() });
      return next;
    });
    toast.success(t('presentationMovedToTeam'));
  };

  const handleFavourite = async (presentationId: string, isFavourite: boolean) => {
    const updatedPresentation = presentations.find((pres) => pres.id === presentationId);

    if (updatedPresentation) {
      const optimistic = presentations.map((p) =>
        p.id === presentationId ? { ...p, isFavourite } : p,
      );
      setPresentations(optimistic);
      cache.set(cacheKey, {
        data: optimistic,
        totalCount: totalCountRef.current ?? optimistic.length,
        at: Date.now(),
      });
      await presentationService.updateFavourite({ ...updatedPresentation, isFavourite });

      if (!isFavourite && activeSort === 'favorite') {
        const remainingFavorites = optimistic.filter(
          (p) => p.id !== presentationId && p.isFavourite,
        );

        if (remainingFavorites.length === 0) {
          setActiveSort('last updated');
          return;
        }
      }
    }
  };
  const setActiveSortSafe = (val: string) => {
    if (val === activeSort) return;
    setActiveSort(val);
  };

  return {
    presentations,
    getPresentations,
    refetch,
    showPrettifyModal,
    setShowPrettifyModal,
    loading,
    setActiveSort: setActiveSortSafe,
    activeSort,
    loadMorePresentations,
    handleDeletePresentation,
    handleDuplicatePresentation,
    handleCopyPresentation,
    isCopied,
    loadingMore,
    handleRestorePresentation,
    handleDeletePermanently,
    handleFavourite,
    handleMoveToTeam,
    presentationsExist,
  };
};
