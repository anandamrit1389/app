import { useContext, useState } from 'react';
import { PresentationContext } from '@/contexts/Presentation.context';
import ExportModal from './components/ExportModal';
import MobileHeaderMenu from './components/MobileHeaderMenu';
import MobileHeader from './components/MobileHeader';
import DesktopHeader from './components/DesktopHeader';
import AddNewSlideDialog from '@/components/Dialogs/AddNewSlideDialog/AddNewSlideDialog';
import ShareModal from './components/ShareModal';

interface IProps {
  mobile?: boolean;
  onOpenPreview?: () => void;
  showPreview?: boolean;
}

const PresentationHeader = ({ mobile, onOpenPreview, showPreview }: IProps) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [addNewOpen, setAddNewOpen] = useState(false);

  const { 
    showSideBar, 
    readonly, 
    exportOpen, 
    setExportOpen, 
    isExporting, 
  } = useContext(PresentationContext);

  if (mobile) {
    return (
      <>
        <MobileHeader
          onOpenPreview={onOpenPreview}
          showPreview={showPreview}
          setMenuOpen={setMenuOpen}
        />
        <MobileHeaderMenu
          menuOpen={menuOpen}
          setMenuOpen={() => setMenuOpen(false)}
          setShareOpen={() => setIsShareModalOpen((v) => !v)}
          setAddNewOpen={() => setAddNewOpen((v) => !v)}
          showSideBar={(v) => showSideBar(v)}
          setExportOpen={() => setExportOpen(!exportOpen)}
          readonly={readonly}
        />
        <ExportModal
          mobile
          open={exportOpen}
          onOpenChange={() => !isExporting && setExportOpen(!exportOpen)}
        />
        <ShareModal
          mobile
          open={isShareModalOpen}
          onOpenChange={() => setIsShareModalOpen(false)}
          readonly={readonly}
        />
        <AddNewSlideDialog
          isOpen={addNewOpen}
          open={false}
          onChangeOpen={setAddNewOpen}
          onMenuClose={() => setMenuOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <DesktopHeader
        setExportOpen={() => setExportOpen(!exportOpen)}
        setShareOpen={() => setIsShareModalOpen(!isShareModalOpen)}
      />
      <ExportModal open={exportOpen} onOpenChange={() => setExportOpen(!exportOpen)} />
      <ShareModal
        open={isShareModalOpen}
        onOpenChange={() => setIsShareModalOpen(false)}
        readonly={readonly}
      />
    </>
  );
};

export default PresentationHeader;
