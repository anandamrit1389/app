import { tagsMap } from '@/helpers/constants/articles.const';

export interface IArticles {
  data: ArticleData[];
  meta: ArticleMeta;
}

export interface IArticle {
  data: ArticleData;
  meta: ArticleMeta;
}

export interface ArticleData {
  id: number;
  attributes: ArticleAttributes;
}

export interface ArticleMeta {
  pagination: {
    page: number;
    pageCount: number;
    pageSize: number;
    total: number;
  };
}

export interface ArticleAttributes {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Content: any[];
  Title: string;
  Tags: keyof typeof tagsMap;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
}
