import { useParams } from 'react-router-dom';
import ArticlesList from './components/ArticlesList';
import ArticleDetail from './components/ArticleDetail';

const InspirationArticles = () => {
  const { slug } = useParams<{ slug: string }>();
  
  if (slug) {
    return <ArticleDetail slug={slug} />;
  }
  
  return <ArticlesList />;
};

export default InspirationArticles; 