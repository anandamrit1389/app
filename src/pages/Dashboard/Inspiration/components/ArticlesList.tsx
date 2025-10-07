import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import ArticlesService from '@/api/articlesService';
import { ArticleData } from '@/interfaces/IArticle';
import Loader from '@/assets/loader-color.svg?react';
import inspirationArticleImg from '@/assets/image-styles/inpiration-article.jpg';
import { ArticleCard, ArticleProps } from './ArticleCard';

const ArticlesList = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'inspiration' });
  const [articles, setArticles] = useState<ArticleProps[]>([]);
  const [loading, setLoading] = useState(true);

  const getFallbackArticle = (): ArticleProps => {
    const today = new Date();
    const formattedDate = `${today.getDate()} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;
    
    return {
      id: 0,
      title: t('inabit.ai - How to Write Effective Prompts'),
      date: formattedDate,
      readTime: t('2 min read'),
      category: t('Prompt Engineering'),
      image: inspirationArticleImg,
      description: t('Learn how to write effective prompts to get the best results.'),
      slug: 'how-to-write-effective-prompts'
    };
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
 
        const response = await ArticlesService.getArticleBySlug('how-to-write-effective-prompts', 'en');
        
        if (response.data.data && response.data.data.length > 0) {
          const articleData = response.data.data.map((article: ArticleData) => {
            const { attributes } = article;
            const publishDate = new Date(attributes.publishedAt);
            const formattedDate = `${publishDate.getDate()} ${publishDate.toLocaleString('default', { month: 'short' })} ${publishDate.getFullYear()}`;
            
            return {
              id: article.id,
              title: attributes.Title,
              date: formattedDate,
              readTime: t('2 min read'),
              category: t('Prompt Engineering'),
              image: inspirationArticleImg,
              description: t('Learn how to write effective prompts to get the best results.'),
              slug: 'how-to-write-effective-prompts' 
            };
          });
          setArticles(articleData);
        } else {
          setArticles([getFallbackArticle()]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setLoading(false);
        setArticles([getFallbackArticle()]);
      }
    };

    fetchArticles();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {t('inspirationArticles')}
        </h2>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <div className="w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {articles.map((article, index) => (
            <ArticleCard key={`article-${index}`} article={article} />
          ))}
        </div>
      )}
    </>
  );
};

export default ArticlesList; 