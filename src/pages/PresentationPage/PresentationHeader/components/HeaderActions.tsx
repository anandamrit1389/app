import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import ThemeSwitch from '@/assets/theme-switch.svg?react';
// import DesktopIcon from "@/assets/device-desktop.svg?react";
// import MobileIcon from "@/assets/device-mobile.svg?react";
import Export from '@/assets/export.svg?react';
import { useContext } from 'react';
import { PresentationContext } from '@/contexts/Presentation.context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Share } from 'lucide-react';
// import IconToggle from "@/components/CustomUI/IconToggle/IconToggle";

interface IProps {
  setExportOpen: () => void;
  setShareOpen: () => void;
  isGenerating: boolean;
}

const HeaderActions = ({ setExportOpen, setShareOpen, isGenerating }: IProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const { showSideBar } = useContext(PresentationContext);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger disabled={isGenerating}>
        <BaseButton
          variant="ghost"
          classNames="font-[500] gap-0 h-8 mx-3 px-3 hover:bg-gray-100"
          disabled={isGenerating}
        >
          <MoreVertical className="size-5" /> Actions
        </BaseButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2">
        <DropdownMenuItem onClick={() => setShareOpen()} className="hover:bg-gray-100">
          <Share className="me-2 w-[20px]" /> {t('share')}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setExportOpen()} className="hover:bg-gray-100">
          <Export className="me-2 w-[20px]" /> {t('export')}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => showSideBar('theme')} className="hover:bg-gray-100">
          <ThemeSwitch className="me-2 w-[20px]" /> {t('theme')}
        </DropdownMenuItem>
        {/* 
        <DropdownMenuItem>
          <IconToggle
            items={[
              {
                id: "desktop",
                icon: <DesktopIcon className="me-2 w-[20px]" />,
              },
              {
                id: "mobile",
                icon: <MobileIcon className="me-2 w-[20px]" />,
              },
            ]}
            isToggled={isDesktopMode}
            onToggle={handleToggleDevice}
          />
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderActions;
