import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './PageTransition.css';
import { Location } from 'react-router-dom';

interface IProps {
  children: React.ReactNode;
  location: Location;
}

const PageTransition = ({ children, location }: IProps) => {
  return (
    <TransitionGroup className="h-full">
      <CSSTransition key={location.pathname} timeout={500} classNames="fade">
        {children}
      </CSSTransition>
    </TransitionGroup>
  );
};

export default PageTransition;
