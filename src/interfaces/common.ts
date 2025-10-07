export interface IBaseMember {
  id: string;
  email: string;
  name?: string;
  imgUrl?: string;
}

export interface IActions<T extends IBaseMember> {
  isDelete: boolean;
  title: string;
  icon: React.ReactNode;
  function: (member: T) => void;
  disabled?: boolean;
}
