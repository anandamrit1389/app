export interface IOutlineActions {
  id: string;
  titleKey: string;
  icon: React.ReactNode;
  function: () => void;
  disabled?: boolean;
  hideOnMobile?: boolean;
  hidden?: boolean;
}
