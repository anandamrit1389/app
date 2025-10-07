import inspiration1 from '@/assets/inspiration1.png';
import inspiration2 from '@/assets/inspiration2.png';
import starInspiration from '@/assets/star-inspiration.svg';

interface DecorationImagesProps {
  isMobile: boolean;
}

const DecorationImages = ({ isMobile }: DecorationImagesProps) => (
  <>
    <div
      className={`absolute ${
        isMobile ? 'bottom-[-20%]' : 'bottom-[-30%] lg:bottom-[-20%]'
      } left-[5%] ${
        isMobile ? 'h-[50px] w-[90px]' : 'h-[78.82px] w-[140px]'
      } rotate-[-8deg] rounded-lg`}
    >
      <img src={inspiration1} alt="" className="rounded-lg" />
      {!isMobile && (
        <img src={starInspiration} alt="" className="absolute right-[-4%] top-[-20%] size-2.5" />
      )}
    </div>
    <img
      src={inspiration2}
      alt=""
      className={`absolute ${isMobile ? 'bottom-[-20%]' : 'top-[-20%]'} right-[5%] ${
        isMobile ? 'h-[50px] w-[90px]' : 'h-[78.82px] w-[140px]'
      } rotate-[8deg] rounded-lg`}
    />
    <img src={starInspiration} alt="" className="absolute left-[50%] top-0 size-3" />
  </>
);

export default DecorationImages;
