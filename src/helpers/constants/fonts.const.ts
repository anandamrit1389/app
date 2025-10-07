import { FontScheme, IFont, IFontCatalog } from '@/interfaces/font.interface';
import interRegular from '@/assets/fonts/Inter-Regular.ttf';
import interBold from '@/assets/fonts/Inter-Bold.ttf';
import interSemiBold from '@/assets/fonts/Inter-SemiBold.ttf';
import interExtraBold from '@/assets/fonts/Inter-ExtraBold.ttf';
import cairoRegular from '@/assets/fonts/Cairo-Regular.ttf';
import cairoBold from '@/assets/fonts/Cairo-Bold.ttf';
import cairoSemiBold from '@/assets/fonts/Cairo-SemiBold.ttf';
import cairoExtraBold from '@/assets/fonts/Cairo-ExtraBold.ttf';
import robotoRegular from '@/assets/fonts/Roboto-Regular.ttf';
import robotoBold from '@/assets/fonts/Roboto-Bold.ttf';
import robotoSemiBold from '@/assets/fonts/Roboto-SemiBold.ttf';
import robotoExtraBold from '@/assets/fonts/Roboto-ExtraBold.ttf';
import openSansRegular from '@/assets/fonts/OpenSans-Regular.ttf';
import openSansBold from '@/assets/fonts/OpenSans-Bold.ttf';
import openSansSemiBold from '@/assets/fonts/OpenSans-SemiBold.ttf';
import openSansExtraBold from '@/assets/fonts/OpenSans-ExtraBold.ttf';
import poppinsRegular from '@/assets/fonts/Poppins-Regular.ttf';
import poppinsBold from '@/assets/fonts/Poppins-Bold.ttf';
import poppinsSemiBold from '@/assets/fonts/Poppins-SemiBold.ttf';
import poppinsExtraBold from '@/assets/fonts/Poppins-ExtraBold.ttf';
import montserratRegular from '@/assets/fonts/Montserrat-Regular.ttf';
import montserratBold from '@/assets/fonts/Montserrat-Bold.ttf';
import montserratSemiBold from '@/assets/fonts/Montserrat-SemiBold.ttf';
import montserratExtraBold from '@/assets/fonts/Montserrat-ExtraBold.ttf';
import latoRegular from '@/assets/fonts/Lato-Regular.ttf';
import latoBold from '@/assets/fonts/Lato-Bold.ttf';
import ptSerifRegular from '@/assets/fonts/PTSerif-Regular.ttf';
import ptSerifBold from '@/assets/fonts/PTSerif-Bold.ttf';
import bricolageGrotesqueRegular from '@/assets/fonts/BricolageGrotesque-Regular.ttf';
import bricolageGrotesqueBold from '@/assets/fonts/BricolageGrotesque-Bold.ttf';
import bricolageGrotesqueSemiBold from '@/assets/fonts/BricolageGrotesque-SemiBold.ttf';
import bricolageGrotesqueExtraBold from '@/assets/fonts/BricolageGrotesque-ExtraBold.ttf';
import bowlbyOneRegular from '@/assets/fonts/BowlbyOne-Regular.ttf';
import bioRhymeRegular from '@/assets/fonts/BioRhyme-Regular.ttf';
import bioRhymeBold from '@/assets/fonts/BioRhyme-Bold.ttf';
import bioRhymeSemiBold from '@/assets/fonts/BioRhyme-SemiBold.ttf';
import bioRhymeExtraBold from '@/assets/fonts/BioRhyme-ExtraBold.ttf';
import climateCrisisRegular from '@/assets/fonts/ClimateCrisis-Regular.ttf';
import NotoSansJPRegular from '@/assets/fonts/NotoSansJP-Regular.ttf';
import NotoSansJPBold from '@/assets/fonts/NotoSansJP-Bold.ttf';
import NotoSansJPSemiBold from '@/assets/fonts/NotoSansJP-SemiBold.ttf';
import NotoSansJPExtraBold from '@/assets/fonts/NotoSansJP-ExtraBold.ttf';
import NotoSansTCRegular from '@/assets/fonts/NotoSansTC-Regular.ttf';
import NotoSansTCBold from '@/assets/fonts/NotoSansTC-Bold.ttf';
import NotoSansTCSemiBold from '@/assets/fonts/NotoSansTC-SemiBold.ttf';
import NotoSansTCExtraBold from '@/assets/fonts/NotoSansTC-ExtraBold.ttf';
import NotoSansSCRegular from '@/assets/fonts/NotoSansSC-Regular.ttf';
import NotoSansSCBold from '@/assets/fonts/NotoSansSC-Bold.ttf';
import NotoSansSCSemiBold from '@/assets/fonts/NotoSansSC-SemiBold.ttf';
import NotoSansSCExtraBold from '@/assets/fonts/NotoSansSC-ExtraBold.ttf';
import NotoSansKRRegular from '@/assets/fonts/NotoSansKR-Regular.ttf';
import NotoSansKRBold from '@/assets/fonts/NotoSansKR-Bold.ttf';
import NotoSansKRSemiBold from '@/assets/fonts/NotoSansKR-SemiBold.ttf';
import NotoSansKRExtraBold from '@/assets/fonts/NotoSansKR-ExtraBold.ttf';
import NotoSansArabicRegular from '@/assets/fonts/NotoSansArabic-Regular.ttf';
import NotoSansArabicBold from '@/assets/fonts/NotoSansArabic-Bold.ttf';
import NotoSansArabicSemiBold from '@/assets/fonts/NotoSansArabic-SemiBold.ttf';
import NotoSansArabicExtraBold from '@/assets/fonts/NotoSansArabic-ExtraBold.ttf';
import NotoSansBengaliRegular from '@/assets/fonts/NotoSansBengali-Regular.ttf';
import NotoSansBengaliBold from '@/assets/fonts/NotoSansBengali-Bold.ttf';
import NotoSansBengaliSemiBold from '@/assets/fonts/NotoSansBengali-SemiBold.ttf';
import NotoSansBengaliExtraBold from '@/assets/fonts/NotoSansBengali-ExtraBold.ttf';
import NotoSansDevanagariRegular from '@/assets/fonts/NotoSansDevanagari-Regular.ttf';
import NotoSansDevanagariBold from '@/assets/fonts/NotoSansDevanagari-Bold.ttf';
import NotoSansDevanagariSemiBold from '@/assets/fonts/NotoSansDevanagari-SemiBold.ttf';
import NotoSansDevanagariExtraBold from '@/assets/fonts/NotoSansDevanagari-ExtraBold.ttf';
import NotoSansThaiRegular from '@/assets/fonts/NotoSansThai-Regular.ttf';
import NotoSansThaiBold from '@/assets/fonts/NotoSansThai-Bold.ttf';
import NotoSansThaiSemiBold from '@/assets/fonts/NotoSansThai-SemiBold.ttf';
import NotoSansThaiExtraBold from '@/assets/fonts/NotoSansThai-ExtraBold.ttf';

export const fontExport: { [key: string]: string } = {
  'Inter-normal': interRegular,
  'Inter-bold': interBold,
  'Inter-semibold': interSemiBold,
  'Inter-extrabold': interExtraBold,
  'Inter, sans-serif-normal': interRegular,
  'Inter, sans-serif-bold': interBold,
  'Inter, sans-serif-semibold': interSemiBold,
  'Inter, sans-serif-extrabold': interExtraBold,

  'Cairo-normal': cairoRegular,
  'Cairo-bold': cairoBold,
  'Cairo-semibold': cairoSemiBold,
  'Cairo-extrabold': cairoExtraBold,

  'Roboto-normal': robotoRegular,
  'Roboto-bold': robotoBold,
  'Roboto-semibold': robotoSemiBold,
  'Roboto-extrabold': robotoExtraBold,

  'OpenSans-normal': openSansRegular,
  'OpenSans-bold': openSansBold,
  'OpenSans-semibold': openSansSemiBold,
  'OpenSans-extrabold': openSansExtraBold,

  'Poppins-normal': poppinsRegular,
  'Poppins-bold': poppinsBold,
  'Poppins-semibold': poppinsSemiBold,
  'Poppins-extrabold': poppinsExtraBold,

  'Montserrat-normal': montserratRegular,
  'Montserrat-bold': montserratBold,
  'Montserrat-semibold': montserratSemiBold,
  'Montserrat-extrabold': montserratExtraBold,

  'Lato-normal': latoRegular,
  'Lato-bold': latoBold,
  'Lato-semibold': latoBold,
  'Lato-extrabold': latoBold,

  'PTSerif-normal': ptSerifRegular,
  'PTSerif-bold': ptSerifBold,
  'PTSerif-semibold': ptSerifBold,
  'PTSerif-extrabold': ptSerifBold,

  'Bricolage Grotesque-normal': bricolageGrotesqueRegular,
  'Bricolage Grotesque-bold': bricolageGrotesqueBold,
  'Bricolage Grotesque-semibold': bricolageGrotesqueSemiBold,
  'Bricolage Grotesque-extrabold': bricolageGrotesqueExtraBold,
  'Bowlby One-normal': bowlbyOneRegular,
  'Bowlby One-bold': bowlbyOneRegular, 
  'Bowlby One-semibold': bowlbyOneRegular,
  'Bowlby One-extrabold': bowlbyOneRegular,

  'BioRhyme-normal': bioRhymeRegular,
  'BioRhyme-bold': bioRhymeBold,
  'BioRhyme-semibold': bioRhymeSemiBold,
  'BioRhyme-extrabold': bioRhymeExtraBold,

  'ClimateCrisis-normal': climateCrisisRegular,
  'ClimateCrisis-bold': climateCrisisRegular,
  'ClimateCrisis-semibold': climateCrisisRegular,
  'ClimateCrisis-extrabold': climateCrisisRegular,

  'NotoSansJP-normal': NotoSansJPRegular,
  'NotoSansJP-bold': NotoSansJPBold,
  'NotoSansJP-semibold': NotoSansJPSemiBold,
  'NotoSansJP-extrabold': NotoSansJPExtraBold,

  'NotoSansTC-normal': NotoSansTCRegular,
  'NotoSansTC-bold': NotoSansTCBold,
  'NotoSansTC-semibold': NotoSansTCSemiBold,
  'NotoSansTC-extrabold': NotoSansTCExtraBold,

  'NotoSansSC-normal': NotoSansSCRegular,
  'NotoSansSC-bold': NotoSansSCBold,
  'NotoSansSC-semibold': NotoSansSCSemiBold,
  'NotoSansSC-extrabold': NotoSansSCExtraBold,

  'NotoSansKR-normal': NotoSansKRRegular,
  'NotoSansKR-bold': NotoSansKRBold,
  'NotoSansKR-semibold': NotoSansKRSemiBold,
  'NotoSansKR-extrabold': NotoSansKRExtraBold,

  'NotoSansArabic-normal': NotoSansArabicRegular,
  'NotoSansArabic-bold': NotoSansArabicBold,
  'NotoSansArabic-semibold': NotoSansArabicSemiBold,
  'NotoSansArabic-extrabold': NotoSansArabicExtraBold,

  'NotoSansBengali-normal': NotoSansBengaliRegular,
  'NotoSansBengali-bold': NotoSansBengaliBold,
  'NotoSansBengali-semibold': NotoSansBengaliSemiBold,
  'NotoSansBengali-extrabold': NotoSansBengaliExtraBold,

  'NotoSansDevanagari-normal': NotoSansDevanagariRegular,
  'NotoSansDevanagari-bold': NotoSansDevanagariBold,
  'NotoSansDevanagari-semibold': NotoSansDevanagariSemiBold,
  'NotoSansDevanagari-extrabold': NotoSansDevanagariExtraBold,

  'NotoSansThai-normal': NotoSansThaiRegular,
  'NotoSansThai-bold': NotoSansThaiBold,
  'NotoSansThai-semibold': NotoSansThaiSemiBold,
  'NotoSansThai-extrabold': NotoSansThaiExtraBold
};

export const fontCatalog: IFontCatalog = {
  inter: {
    name: 'inter',
    label: 'Inter',
    link: 'https://fonts.google.com/specimen/Inter',
  },
  sansSerif: {
    name: 'sans-serif',
    label: 'Sans Serif',
    link: 'https://fonts.google.com/',
  },
  bricolagegrotesque: {
    name: 'bricolage-grotesque',
    label: 'Bricolage Grotesque',
    link: 'https://fonts.google.com/specimen/Bricolage+Grotesque',
  },
  opensans: {
    name: 'open-sans',
    label: 'Open Sans',
    link: 'https://fonts.google.com/specimen/Open+Sans',
  },
  poppins: {
    name: 'poppins',
    label: 'Poppins',
    link: 'https://fonts.google.com/specimen/Poppins',
  },
  lato: {
    name: 'lato',
    label: 'Lato',
    link: 'https://fonts.google.com/specimen/Lato',
  },
  montserrat: {
    name: 'montserrat',
    label: 'Montserrat',
    link: 'https://fonts.google.com/specimen/Montserrat',
  },
  ptSerif: {
    name: 'pt-serif',
    label: 'PT Serif',
    link: 'https://fonts.google.com/specimen/PT+Serif',
  },
  cairo: {
    name: 'cairo',
    label: 'Cairo',
    link: 'https://fonts.google.com/specimen/Cairo',
  },
  roboto: {
    name: 'roboto',
    label: 'Roboto',
    link: 'https://fonts.google.com/specimen/Roboto',
  },
  biorhyme: {
    name: 'biorhyme',
    label: 'BioRhyme',
    link: 'https://fonts.google.com/specimen/BioRhyme',
  },
  climatecrisis: {
    name: 'climate-crisis',
    label: 'Climate Crisis',
    link: 'https://fonts.google.com/specimen/Climate+Crisis',
  },
  bowlbyone: {
    name: 'bowlby-one',
    label: 'Bowlby One',
    link: 'https://fonts.google.com/specimen/Bowlby+One',
  },
};

export const defaultFonts: IFont[] = Object.values(fontCatalog);

export const presentationFonts: FontScheme[] = [
  {
    id: fontCatalog.inter.name,
    fonts: {
      header: fontCatalog.inter,
      body: fontCatalog.inter,
    },
    templates: ['light', 'dark'],
  },
  {
    id: fontCatalog.sansSerif.name,
    fonts: {
      header: fontCatalog.sansSerif,
      body: fontCatalog.inter,
    },
    templates: ['light', 'dark'],
  },
  {
    id: fontCatalog.bricolagegrotesque.name,
    fonts: {
      header: fontCatalog.bricolagegrotesque,
      body: fontCatalog.opensans,
    },
    templates: ['light', 'dark', 'fastTurn'],
  },
  {
    id: fontCatalog.poppins.name,
    fonts: {
      header: fontCatalog.poppins,
      body: fontCatalog.poppins,
    },
    templates: ['light', 'dark', 'futureVision', 'corporateVision'],
  },
  {
    id: fontCatalog.lato.name,
    fonts: {
      header: fontCatalog.lato,
      body: fontCatalog.lato,
    },
    templates: ['light', 'dark'],
  },
  {
    id: fontCatalog.montserrat.name,
    fonts: {
      header: fontCatalog.montserrat,
      body: fontCatalog.montserrat,
    },
    templates: ['light', 'dark'],
  },
  {
    id: fontCatalog.ptSerif.name,
    fonts: {
      header: fontCatalog.ptSerif,
      body: fontCatalog.inter,
    },
    templates: ['light', 'dark'],
  },
  {
    id: fontCatalog.cairo.name,
    fonts: {
      header: fontCatalog.cairo,
      body: fontCatalog.cairo,
    },
    templates: ['boardReport'],
  },
  {
    id: fontCatalog.roboto.name,
    fonts: {
      header: fontCatalog.roboto,
      body: fontCatalog.roboto,
    },
    templates: ['monthlyReport'],
  },
  {
    id: fontCatalog.biorhyme.name,
    fonts: {
      header: fontCatalog.biorhyme,
      body: fontCatalog.inter,
    },
    templates: ['creativeSpark'],
  },
  {
    id: fontCatalog.climatecrisis.name,
    fonts: {
      header: fontCatalog.climatecrisis,
      body: fontCatalog.climatecrisis,
    },
    templates: ['pitchDeck'],
  },
  {
    id: fontCatalog.bowlbyone.name,
    fonts: {
      header: fontCatalog.bowlbyone,
      body: fontCatalog.bowlbyone,
    },
    templates: ['funAndGames'],
  },
];
