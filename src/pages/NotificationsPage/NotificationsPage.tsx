import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import DashboardHeader from '../Dashboard/DashboardHeader/DashboardHeader';
import { Outlet, useParams } from 'react-router-dom';
import CloseIcon from '@/assets/x.svg?react';
import ArrowLeftIcon from '@/assets/arrow-left.svg?react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import io from 'socket.io-client';
import useFetch from '@/hooks/useFetch';
import ArticlesService from '@/api/articlesService';
import { ArticleData } from '@/interfaces/IArticle';
import { PreviewArticleItem } from './PreviewArticleItem/PreviewArticleItem';
import { toast } from 'sonner';
import { NotificationsContext } from '@/providers/notifications.provider';
import Loader from '@/assets/loader-color.svg?react';
import useDeviceDetect from '@/hooks/useDeviceDetect';
import { AuthContext } from '@/providers/auth.provider';
import { useTranslation } from 'react-i18next';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';

const socket = io(import.meta.env.VITE_API_URL);
const INITIAL_PAGE_SIZE = 20;
const INITIAL_PAGE = 1;

const NotificationsPage = () => {
  const navigate = useLocaleNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { notifications, increaseNewNotificationsCount } = useContext(NotificationsContext);

  const [pageSize] = useState(INITIAL_PAGE_SIZE);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [articles, setArticles] = useState<ArticleData[]>([]);

  const {
    t,
    i18n: { language },
  } = useTranslation('translation', { keyPrefix: 'notifications' });

  const { isMobile } = useDeviceDetect();

  const tags = useMemo(() => {
    const tags: string[] = [];
    if (user?.notificationsSettings.newFeatures) {
      tags.push('newFeatures');
    }
    if (user?.notificationsSettings.inspirationTutorials) {
      tags.push('inspiration');
    }
    if (user?.notificationsSettings.offers) {
      tags.push('offers');
    }
    return tags;
  }, [user?.notificationsSettings]);

  const {
    data: articlesData,
    loading: articlesLoading,
    error: articlesError,
  } = useFetch(ArticlesService.getAllArticles, pageSize, page, tags, language);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + INITIAL_PAGE);
  };

  useEffect(() => {
    if (articlesData?.data?.length) {
      setArticles((prevArticles) => {
        const combinedArticles = [...prevArticles, ...articlesData.data];
        const uniqueArticles = combinedArticles.filter(
          (article, index, self) => index === self.findIndex((a) => a.id === article.id),
        );
        return uniqueArticles;
      });
    }
  }, [articlesData]);

  useEffect(() => {
    const firstArticleId = articlesData?.data?.[0]?.id;

    if (!id && firstArticleId && !isMobile) {
      navigate(`/notifications/${firstArticleId}`);
      return;
    }
  }, [articlesData, id, navigate]);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.info('Connected:', socket.id);
      });

      socket.on('disconnect', () => {
        console.info('Disconnected');
      });

      socket.on('new-article', (data) => {
        setArticles((prevNewArticles) => {
          let newArticle = null;

          if (!prevNewArticles.some((article) => article.id === data.article.entry.id)) {
            newArticle = {
              id: data.article.entry.id,
              attributes: data.article.entry,
            };
          }

          if (newArticle) {
            increaseNewNotificationsCount();
            return [newArticle, ...prevNewArticles];
          }

          return prevNewArticles;
        });
      });

      socket.on('delete-article', (data) => {
        setArticles((prevNewArticles) => {
          return prevNewArticles.filter((article) => article.id !== data.article.entry.id);
        });
      });
    }

    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('new-article');
      }
    };
  }, []);

  if (articlesError) {
    toast.error(t('errorArticlesFetch'));
  }

  return (
    <div className="min-h-screen bg-lightGrey">
      {!isMobile && <DashboardHeader />}
      <div className="mx-auto max-w-[1150px] px-4">
        <div className="md:pt-32">
          <div className="relative flex h-[64px] items-center justify-center py-[18px] md:mb-6 md:justify-between">
            {isMobile && (
              <BaseButton
                onClick={() => navigate(-1)}
                variant="ghost"
                size="sm"
                classNames="absolute top-1/2 left-0 -translate-y-1/2 p-0"
                icon={<ArrowLeftIcon />}
              />
            )}
            {(!isMobile || !id) && (
              <>
                <h1 className="pl-4 text-xl font-bold text-darkHeadline">{t('pageTitle')}</h1>
                <BaseButton
                  onClick={() => navigate('/dashboard')}
                  isDark
                  variant="secondary"
                  size="sm"
                  classNames="!hidden md:!flex uppercase py-1.5 px-3 flex gap-1 items-center font-semibold text-xs leading-3"
                >
                  {t('backBtn')}
                  <CloseIcon />
                </BaseButton>
              </>
            )}
          </div>
        </div>

        <div className="flex">
          {(!isMobile || !id) && (
            <div className="md:basis-3/12">
              <div className="flex flex-col">
                {articles.length > 0 ? (
                  articles.map((article) => {
                    const isWatched = notifications.find(
                      (notification) => notification.recordId === article.id.toString(),
                    )?.isWatched;

                    return (
                      <React.Fragment key={article.id}>
                        <PreviewArticleItem articleData={article} isWatched={isWatched ?? true} />
                      </React.Fragment>
                    );
                  })
                ) : !articlesLoading ? (
                  <div className="pl-4">{t('articlesNotFound')}</div>
                ) : (
                  ''
                )}

                {articlesLoading && (
                  <div className="flex w-full justify-center p-4">
                    <Loader className="animate-spin" />
                  </div>
                )}
              </div>
              {articles.length < (articlesData?.meta?.pagination.total ?? 0) && (
                <BaseButton variant="outline" classNames="w-full" onClick={handleLoadMore}>
                  {t('loadMore')}
                </BaseButton>
              )}
            </div>
          )}
          {id && (
            <>
              {!isMobile && <div className="basis-1/12"></div>}
              <div className="md:basis-8/12 h-[75dvh] overflow-auto">
                <Outlet />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default NotificationsPage;
