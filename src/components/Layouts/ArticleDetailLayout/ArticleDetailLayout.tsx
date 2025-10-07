import React from 'react';
import TextLayout from '@/components/Layouts/TextLayout/TextLayout';
import { ArticleAttributes } from '@/interfaces/IArticle';
import { BlocksRenderer } from '@/components/services/strapi';
import { BlocksComponents, ModifiersComponents } from '@/components/services/strapi/BlocksRenderer';
import { cn } from '@/lib/utils';

interface ArticleDetailLayoutProps {
  article: ArticleAttributes;
}

export const ArticleDetailLayout: React.FC<ArticleDetailLayoutProps> = ({ article }) => {
  const defaultBlockRenderers: Partial<BlocksComponents> = {
    paragraph: ({ children }) => <p className="mb-6 text-lg text-tertiaryText">{children}</p>,
    heading: ({ children, level }) => {
      switch (level) {
        case 1:
          return (
            <h1 className="mb-6 text-[32px] font-bold leading-[42px] text-darkHeadline">
              {children}
            </h1>
          );
        case 2:
          return <h2 className="mb-[16px] text-lg font-semibold text-darkHeadline">{children}</h2>;
        default:
          return (
            <h3 className="mb-[12px] text-base font-semibold text-darkHeadline">{children}</h3>
          );
      }
    },
    list: ({ children, format }) => {
      const ListTag = format === 'ordered' ? 'ol' : 'ul';
      return (
        <ListTag
          className={cn(
            'mb-6 list-inside list-disc space-y-3 pl-3 text-tertiaryText [*>li]:text-lg',
            format === 'ordered' ? 'list-decimal' : 'list-disc',
          )}
        >
          {children}
        </ListTag>
      );
    },
    link: ({ children, url }) => (
      <a href={url} className="text-redText hover:underline">
        {children}
      </a>
    ),
  };

  const defaultModifiers: Partial<ModifiersComponents> = {
    bold: ({ children }) => <strong>{children}</strong>,
    italic: ({ children }) => <span className="italic">{children}</span>,
    underline: ({ children }) => <u>{children}</u>,
  };

  return (
    <TextLayout>
      <h1 className="mb-4 text-3xl font-bold">{article.Title}</h1>
      <BlocksRenderer
        content={article.Content}
        blocks={defaultBlockRenderers}
        modifiers={defaultModifiers}
      />
    </TextLayout>
  );
};
