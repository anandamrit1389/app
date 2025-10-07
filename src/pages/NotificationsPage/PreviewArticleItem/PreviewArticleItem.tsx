import Tag from '@/components/CustomUI/Tag/Tag';
import LocaleLink from '@/components/Locales/LocaleLink/LocaleLink';
import { publishFormatDate } from '@/helpers/utils/date';
import { ArticleData } from '@/interfaces/IArticle';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { useTranslation } from 'react-i18next';

interface PreviewArticleItemProps {
  articleData: ArticleData;
  isWatched: boolean;
}

export const PreviewArticleItem = ({ articleData, isWatched }: PreviewArticleItemProps) => {
  const { attributes, id } = articleData;
  const { t } = useTranslation('translation', { keyPrefix: 'notifications' });

  return (
    <LocaleLink
      to={`/notifications/${id}`}
      className="mb-2 inline-block cursor-pointer border-b border-lightGreyHover px-2 pb-[28px] pt-4 last:mb-2 last:border-none md:mb-3 md:px-4 md:pb-7"
    >
      <div className="mb-2 flex flex-wrap gap-2">
        {attributes.Tags && <Tag>{t(attributes.Tags)}</Tag>}
      </div>
      <h5 className="relative line-clamp-2 gap-3 pr-5 text-sm font-semibold">
        {attributes.Title}
        {!isWatched && (
          <div className="absolute right-1.5 top-1.5 size-2 rounded-full bg-default-gradient" />
        )}
      </h5>
      <p className="mb-2 line-clamp-1 text-sm text-tertiaryText">
        <BlocksRenderer content={attributes.Content} />
      </p>
      <p className="flex text-xs text-tertiaryText">
        {publishFormatDate(new Date(attributes.publishedAt))}
      </p>
    </LocaleLink>
  );
};
