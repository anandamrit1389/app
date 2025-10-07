interface MainContainerProps {
  children: React.ReactNode;
}

const MainContainer = ({ children }: MainContainerProps) => {
  return <div className="mx-auto w-full max-w-[1184px] overflow-y-auto px-4">{children}</div>;
};

export default MainContainer;
