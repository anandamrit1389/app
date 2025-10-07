interface IProps {
  children?: React.ReactNode;
}

const Divider = ({ children }: IProps) => {
  return (
    <div className="flex w-full items-center gap-[18px]">
      <span className="h-px w-full bg-[#0000001A]"></span>
      {children && (
        <>
          <span className="font-inter font-xs font-medium text-black">{children}</span>
          <span className="h-px w-full bg-[#0000001A]"></span>
        </>
      )}
    </div>
  );
};

export default Divider;
