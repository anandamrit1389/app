import { Sheet, SheetContent } from '@/components/ui/sheet';
import TemplateSelection from './TempleteSelection/TemplateSelection';
import ThemeSelection from './ThemeSelection/ThemeSelection';
import PrettifyMenu from '@/pages/PrettifyPage/PrettifyMenu';
import useValidContext from '@/hooks/useValidContext';
import PrettifyImprove from '@/pages/PrettifyPage/PrettifyImprove';
import PrettifyPreview from './PrettifyPreview';

const TemplateDrawer = ({ mobile, isPrettify }: { mobile?: boolean; isPrettify?: boolean }) => {
  const { showMiddleware, setShowMiddleware, step } = useValidContext();

  const renderStepComponent = () => {
    switch (step) {
      case 'template':
        return isPrettify ? <PrettifyMenu /> : <TemplateSelection />;
      case 'theme':
        return isPrettify ? <PrettifyImprove /> : <ThemeSelection />;
      case 'preview':
        return isPrettify && <PrettifyPreview />;
    }
  };

  if (mobile) {
    return (
      <>
        <Sheet
          open={showMiddleware}
          onOpenChange={() => {
            setShowMiddleware(!showMiddleware);
          }}
        >
          <SheetContent
            outsideclose="true"
            side="bottom"
            className="flex h-dvh justify-center p-0 pt-4"
          >
            {renderStepComponent()}
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <Sheet
      open={showMiddleware}
      onOpenChange={() => {
        setShowMiddleware(!showMiddleware);
      }}
    >
      <SheetContent
        outsideclose="true"
        side="bottom"
        className={`flex h-[95%] justify-center rounded-t-xl ${step === 'preview' && 'bg-empty-dashboard'}`}
      >
        {renderStepComponent()}
      </SheetContent>
    </Sheet>
  );
};

export default TemplateDrawer;
