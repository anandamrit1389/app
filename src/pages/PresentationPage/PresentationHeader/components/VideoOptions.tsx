import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { VIDEO_WITH_VOICE_OVER_CREDITS_COST } from '@/helpers/constants/video.const';
import { Mic, MicOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VideoOptionsProps {
  onExport: (withVoiceOver: boolean) => void;
  loading: boolean;
  credits?: number;
}

const VideoOptions = ({ onExport, loading, credits }: VideoOptionsProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'presentation' });
  const hasCredits = credits && credits >= VIDEO_WITH_VOICE_OVER_CREDITS_COST;

  return (
    <div className="flex flex-col gap-1 mt-1 px-2">
      <div className="relative flex w-full flex-col gap-2 overflow-hidden rounded-lg">
        <Button
          className="border-none h-10 relative flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg bg-lightGrey p-1 text-black transition-all hover:bg-lightGreyHover focus:bg-lightGreyPress"
          variant="outline"
          onClick={() => onExport(false)}
          disabled={loading}
        >
          <MicOff className="size-5 text-gray-600" />
          <div className="text-left">
            <div className="font-medium">{t('exportWithoutVoiceOver')}</div>
          </div>
          <div className="ml-auto text-xs text-gray-500 pr-2">{t('free')}</div>
        </Button>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative flex w-full flex-col gap-2 overflow-hidden rounded-lg">
              <Button
                className="border-none h-10 relative flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg bg-lightGrey p-1 text-black transition-all hover:bg-lightGreyHover focus:bg-lightGreyPress"
                variant="outline"
                onClick={() => onExport(true)}
                disabled={loading || !hasCredits}
              >
                <Mic className="size-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium">{t('exportWithVoiceOver')}</div>
                </div>
                <div className="ml-auto text-xs text-gray-500 pr-2">
                  {t('costs')} {VIDEO_WITH_VOICE_OVER_CREDITS_COST} {t('credits')}
                </div>
              </Button>
            </div>
          </TooltipTrigger>
          {!hasCredits && (
            <TooltipContent className="bg-[#1F2937] border-none shadow-lg">
              <p className="text-3 text-white">{t('notEnoughCredits')}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default VideoOptions;
