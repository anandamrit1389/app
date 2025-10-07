import { useTranslation } from 'react-i18next';
import { Link, LinkProps, To } from 'react-router-dom';

interface LocaleLinkProps {
  children: React.ReactNode;
  to: To;
  className?: string;
  props?: Omit<LinkProps, 'to'>;
}

const LocaleLink = ({ children, to, className, ...props }: LocaleLinkProps) => {
  const {
    i18n: { language },
  } = useTranslation();

  return (
    <Link to={`/${language}${to}`} {...props} className={className}>
      {children}
    </Link>
  );
};

export default LocaleLink;
