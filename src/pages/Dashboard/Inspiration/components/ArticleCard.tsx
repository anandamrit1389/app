import useLocaleNavigate from '@/hooks/useLocaleNavigate';

interface ArticleProps {
  id: number;
  title: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  description: string;
  slug?: string;
}

const ArticleCard = ({ article }: { article: ArticleProps }) => {
  const navigate = useLocaleNavigate();
  
  const handleArticleClick = () => {
    navigate(`/articles/${article.slug || article.id}`);
  };

  return (
    <div 
      className="w-full flex flex-col h-full p-0 rounded-xl bg-white transition-all duration-300 ease-in-out hover:-translate-y-[5px] hover:shadow-lg cursor-pointer mb-[50px]" 
      onClick={handleArticleClick}
    >
      <div className="w-full relative overflow-hidden rounded-t-xl">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute top-4 left-4 bg-white/90 text-gray-800 py-1 px-3 rounded-full text-xs font-medium">
          {article.category}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
          <span>{article.date}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-900 transition-colors duration-300">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-1">{article.description}</p>
      </div>
    </div>
  );
};

export { ArticleCard, type ArticleProps }; 