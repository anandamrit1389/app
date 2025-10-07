export const getPreview = (preview?: string) => {
  if (!preview) {
    return '';
  }

  const { bgColor, imageColor, textColor, iconColor, outlineColor } = colors && {
    bgColor: 'bg-[#EFF0F2]',
    imageColor: 'bg-[#E5E7EB]',
    textColor: 'bg-[#D1D5DB]',
    iconColor: '#9CA3AF',
    outlineColor: 'outline-[#FFE7E7]/50',
  };

  const prev = preview
    ?.replaceAll('bg-[bg-color]', bgColor)
    ?.replaceAll('bg-[image-color]', imageColor)
    ?.replaceAll?.('bg-[text-color]', textColor)
    ?.replaceAll?.('outline-[text-color]/50', outlineColor)
    ?.replaceAll('icon-color', iconColor);

  return prev;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const colors: any = {
  blue: {
    bgColor: 'bg-[#F8F9FC]',
    imageColor: 'bg-[#E7F7FF]',
    textColor: 'bg-[#D7E8FB]',
    outlineColor: 'outline-[#D7E8FB]/50',
    iconColor: '#C1D3EB',
  },
  green: {
    bgColor: 'bg-[#FAFCF8]',
    imageColor: 'bg-[#EDF7E2]',
    textColor: 'bg-[#D8E7C8]',
    outlineColor: 'outline-[#E6F1DA]/50',
    iconColor: '#D1E6BA',
  },
  orange: {
    bgColor: 'bg-[#FFFAF9]',
    imageColor: 'bg-[#FFEFE6]',
    textColor: 'bg-[#F7DAC8]',
    outlineColor: 'outline-[#FAE7DA]/50',
    iconColor: '#E6C9BA',
  },
  yellow: {
    bgColor: 'bg-[#FFFCF5]',
    imageColor: 'bg-[#FFF6E1]',
    textColor: 'bg-[#F3E6B6]',
    outlineColor: 'outline-[#FAEFDA]/50',
    iconColor: '#E6D8BA',
  },
  pink: {
    bgColor: 'bg-[#FFF9FC]',
    imageColor: 'bg-[#FDEFF7]',
    textColor: 'bg-[#F4D6F3]',
    outlineColor: 'outline-[#FADAF9]/50',
    iconColor: '#E6BADC',
  },
  purple: {
    bgColor: 'bg-[#FCF8FF]',
    imageColor: 'bg-[#F6EFFD]',
    textColor: 'bg-[#E9D5F8]',
    outlineColor: 'outline-[#ECDAFA]/50',
    iconColor: '#D6C0E6',
  },
  light: {
    bgColor: 'bg-[#F5F5F5]',
    imageColor: 'bg-[#ECECEC]',
    textColor: 'bg-[#D9D9D9]',
    outlineColor: 'outline-[#DFDFDF]/50',
    iconColor: '#C7C7C7',
  },
  grey: {
    bgColor: 'bg-[#27282C]',
    imageColor: 'bg-[#373A44]',
    textColor: 'bg-[#4D5166]',
    outlineColor: 'outline-[#404354]/50',
    iconColor: '#65687A',
  },
  darkpurple: {
    bgColor: 'bg-[#261C2F]',
    imageColor: 'bg-[#432F4B]',
    textColor: 'bg-[#5F4464]',
    outlineColor: 'outline-[#4A354E]/50',
    iconColor: '#79657A',
  },
  darkblue: {
    bgColor: 'bg-[#152444]',
    imageColor: 'bg-[#1D2F57]',
    textColor: 'bg-[#2F4976]',
    outlineColor: 'outline-[#2F4976]/50',
    iconColor: '#455C8E',
  },
  darkgreen: {
    bgColor: 'bg-[#272F1C]',
    imageColor: 'bg-[#37441E]',
    textColor: 'bg-[#485D3C]',
    outlineColor: 'outline-[#3E4E35]/50',
    iconColor: '#687554',
  },
  darkpink: {
    bgColor: 'bg-[#2A191F]',
    imageColor: 'bg-[#441E37]',
    textColor: 'bg-[#7E4261]',
    outlineColor: 'outline-[#7E4261]/50',
    iconColor: '#8E496E',
  },
  darkorange: {
    bgColor: 'bg-[#2E1D0E]',
    imageColor: 'bg-[#4A2A0F]',
    textColor: 'bg-[#7E5025]',
    outlineColor: 'outline-[#7E5025]/50',
    iconColor: '#8D643E',
  },
  darkyellow: {
    bgColor: 'bg-[#312E12]',
    imageColor: 'bg-[#423B10]',
    textColor: 'bg-[#85771D]',
    outlineColor: 'outline-[#85771D]/50',
    iconColor: '#82710E',
  },
  darkred: {
    bgColor: 'bg-[#2A090A]',
    imageColor: 'bg-[#49191A]',
    textColor: 'bg-[#8D3234]',
    outlineColor: 'outline-[#8D3234]/50',
    iconColor: '#8F4C4D',
  },
  darkretro: {
    bgColor: 'bg-[#0A1931]',
    imageColor: 'bg-[#0D2B5B]',
    textColor: 'bg-[#9E7F35]',
    outlineColor: 'outline-[#9E7F35]/50',
    iconColor: '#4D6F9B',
  },
  company: {
    bgColor: 'bg-[#FFF2F2]',
    imageColor: 'bg-[#FFE7E7]',
    textColor: 'bg-[#FFE7E7]',
    iconColor: '#EBC1C1',
    outlineColor: 'outline-[#FFE7E7]/50',
  },
};
