import { AxiosResponse } from 'axios';

import cmsApiService from '@/api/cmsApiService';
import { IArticles, IArticle } from '@/interfaces/IArticle';
import languages from '@/i18n/languages';

export default class ArticlesService {
  static getAllArticles(
    pageSize: string | number = 4,
    page: string | number = 1,
    tags: string[] = [],
    locale: keyof typeof languages,
  ): Promise<AxiosResponse<IArticles>> {
    const tagFilter =
      tags.length > 0
        ? tags.map((tag) => `&filters[Tags][$in]=${tag}`).join('')
        : '&filters[Tags][$in]=';

    return cmsApiService.get(
      `/articles?sort[0]=publishedAt:desc&pagination[pageSize]=${pageSize}&pagination[page]=${page}&locale=${locale}${tagFilter}`,
    );
  }

  static getArticle(id: string, locale: keyof typeof languages): Promise<AxiosResponse<IArticle>> {
    return cmsApiService.get(`/articles/${id}?locale=${locale}`);
  }

  static getArticleBySlug(
    slug: string,
    locale: keyof typeof languages,
  ): Promise<AxiosResponse<IArticles>> {
    return cmsApiService.get(`/articles?filters[Slug][$eq]=${slug}&locale=${locale}&populate=*`);
  }
}
