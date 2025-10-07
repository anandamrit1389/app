import { useEffect, useState } from 'react';
import ArticlesService from '@/api/articlesService';
import { ArticleAttributes } from '@/interfaces/IArticle';
import Loader from '@/assets/loader-color.svg?react';
import { ArticleDetailLayout } from '@/components/Layouts/ArticleDetailLayout/ArticleDetailLayout';
import TextLayout from '@/components/Layouts/TextLayout/TextLayout';

const ArticleDetail = ({ slug }: { slug: string }) => {
  const [article, setArticle] = useState<ArticleAttributes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await ArticlesService.getArticleBySlug(slug, 'en');

        if (response.data.data && response.data.data.length > 0) {
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
  }, [slug]);

  if (loading) {
    return (
      <TextLayout>
        <div className="col-span-2 flex justify-center items-center py-10">
          <Loader className="animate-spin" />
        </div>
      </TextLayout>
    );
  }

  if (error) {
    return (
      <TextLayout>
        <div className="p-4">{error}</div>
      </TextLayout>
    );
  }

  if (!article) {
    return (
      <TextLayout>
        <div className="p-4">Article not found</div>
      </TextLayout>
    );
  }

  return <ArticleDetailLayout article={article} />;
};

export default ArticleDetail; 