import { useState, useEffect } from 'react';
import { ArticleAttributes } from '@/interfaces/IArticle';
import languages from '@/i18n/languages';
import ArticlesService from '@/api/articlesService';

export const useArticle = (slug: string) => {
  const [article, setArticle] = useState<ArticleAttributes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const locale: keyof typeof languages = 'en';

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await ArticlesService.getArticleBySlug(slug, locale);

        if (response.data.data.length > 0) {
          setArticle(response.data.data[0].attributes);
        } else {
          setError('Article not found');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch article');
        setLoading(false);
        console.error('Article fetch error:', err);
      }
    };

    fetchArticle();
  }, [slug, locale]);

  return { article, loading, error };
};
