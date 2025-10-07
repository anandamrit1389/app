import AIImageGeneration from './AIImageGeneration';
import { Accordion } from '@radix-ui/react-accordion';
import StockImages from '@/components/common/AppSidebar/EditImageSideBar/StockImages';

interface EditImageSidebarProps {
  sidebarContainerRef: React.RefObject<HTMLDivElement>;
}

const EditImageSidebar = ({ sidebarContainerRef }: EditImageSidebarProps) => {
  return (
    <Accordion
      defaultValue={['aiImageGeneration', 'webImages', 'imageAlign', 'stockImages']}
      type="multiple"
      className="w-full flex flex-col gap-4"
    >
      <AIImageGeneration sidebarContainerRef={sidebarContainerRef} />
      <StockImages sidebarContainerRef={sidebarContainerRef} />
    </Accordion>
  );
};

export default EditImageSidebar;
