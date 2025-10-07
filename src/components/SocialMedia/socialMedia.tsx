import Linkdin from '@/assets/linkdin.svg?react';
import Instagram from '@/assets/instagram.svg?react';
import Facebook from '@/assets/facebook.svg?react';
import Twitter from '@/assets/twitter.svg?react';
import TikTok from '@/assets/tiktok.svg?react';
import { cn } from '@/lib/utils';
import useMobile from '@/hooks/useMobile';

const SocialMedia = () => {
  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/inabit_official/',
      icon: <Instagram />,
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/inabit.official',
      icon: <Facebook />,
    },
    {
      name: 'Twitter',
      url: 'https://x.com/Official_Inabit',
      icon: <Twitter />,
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/showcase/inabit-official/',
      icon: <Linkdin />,
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@inabit_official?',
      icon: <TikTok />,
    },
  ];

  const isMobile = useMobile();

  return (
    <div
      className={cn('flex items-center gap-2', {
        'justify-between w-full': isMobile,
      })}
    >
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 rounded-lg  hover:scale-110 transition-transform duration-200"
          aria-label={social.name}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialMedia;
