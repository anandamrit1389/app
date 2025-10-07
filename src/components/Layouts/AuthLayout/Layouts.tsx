interface AuthLayout {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayout) => {
  return (
    <div className="flex size-full items-center justify-center overflow-hidden bg-[#F6F7F8]">
      {children}
    </div>
  );
};

export default AuthLayout;
