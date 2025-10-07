import ArticlesService from '@/api/articlesService';
import NotificationService from '@/api/notificationService';
import LocaleLink from '@/components/Locales/LocaleLink/LocaleLink';
import useFetch from '@/hooks/useFetch';
import { NotificationsContext } from '@/providers/notifications.provider';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import Loader from '@/assets/loader-color.svg?react';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const ArticleContent = () => {
  const { id } = useParams();
  const {
    i18n: { language },
  } = useTranslation('translation');

  const {
    data: articleData,
    loading: articleLoading,
    error: articleError,
  } = useFetch(ArticlesService.getArticle, id, language);

  const { notifications, handleUpdateNotifications, decreaseNewNotificationsCount } =
    useContext(NotificationsContext);

  useEffect(() => {
    if (articleData) {
      const notification = notifications?.find(
        (notification) => notification.recordId === articleData.data.id.toString(),
      );

      const updateNotificationStatus = async (id: string) => {
        const res = await NotificationService.updateNotificationStatus(id);

        handleUpdateNotifications(id, res.data.isWatched);
      };

      if (notification && !notification.isWatched) {
        updateNotificationStatus(notification.id);
        decreaseNewNotificationsCount();
      }
    }
  }, [articleData, notifications]);

  if (!articleData?.data) {
    return null;
  }

  if (articleError) {
    toast.error('Failed to fetch article data');
  }

  const { attributes } = articleData.data;

  return (
    <>
      {articleData?.data && (
        <>
          <h1 className="mb-1 text-[32px] font-bold leading-[42px] text-darkHeadline">
            {attributes.Title}
          </h1>
          <span className="mb-6 flex text-xs text-tertiaryText">
            {new Date(attributes.publishedAt).toDateString()}
          </span>
          <BlocksRenderer
            content={attributes.Content}
            blocks={{
              paragraph: ({ children }) => (
                <p className="mb-10 text-base text-tertiaryText md:text-lg">{children}</p>
              ),
              heading: ({ children, level }) => {
                switch (level) {
                  case 1:
                    return (
                      <h1 className="mb-4 text-[28px] font-bold leading-[36px] md:text-[32px] md:leading-[40px]">
                        {children}
                      </h1>
                    );
                  case 2:
                    return (
                      <h1 className="mb-4 text-[24px] font-bold leading-[32px] md:text-[28px] md:leading-[36px]">
                        {children}
                      </h1>
                    );
                  case 3:
                    return (
                      <h3 className="mb-4 text-[20px] font-bold leading-[28px] md:text-[24px] md:leading-[32px]">
                        {children}
                      </h3>
                    );
                  case 4:
                    return (
                      <h4 className="mb-4 text-[18px] font-bold leading-[28px] md:text-[20px]">
                        {children}
                      </h4>
                    );
                }
              },
              link: ({ children, url }) => (
                <LocaleLink
                  to={url}
                  className="font-inter text-lg font-bold text-redText underline"
                >
                  {children}
                </LocaleLink>
              ),
              list: ({ children }) => (
                <ul className="mb-6 list-inside list-disc pl-3 text-tertiaryText [&>li]:mb-3">
                  {children}
                </ul>
              ),
            }}
          />
        </>
      )}
      {articleLoading && !articleData?.data && (
        <div className="flex w-full justify-center p-4">
          <Loader className="animate-spin" />
        </div>
      )}
    </>
  );
};

export default ArticleContent;
