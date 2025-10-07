import React from 'react';
import TextLayout from '@/components/Layouts/TextLayout/TextLayout';
import { useArticle } from '@/hooks/useArticle';
import { ArticleDetailLayout } from '@/components/Layouts/ArticleDetailLayout/ArticleDetailLayout';
import Loader from '@/assets/loader-color.svg?react';

const SLUG = 'terms-of-use';

const TermsOfUse: React.FC = () => {
  const { article, loading, error } = useArticle(SLUG);

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

export default TermsOfUse;
