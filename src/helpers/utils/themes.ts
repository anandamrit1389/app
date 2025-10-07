import { ThemeColors, ThemeSchema } from '@/interfaces/theme.interface';

export const applyThemes = (themeSchemas: ThemeSchema[], customColors?: ThemeColors): void => {
  const themeClasses = Array.from(document.documentElement.classList).filter((className) =>
    className.startsWith('theme-'),
  );
  themeClasses.forEach((className) => {
    document.documentElement.classList.remove(className);
  });

  themeSchemas.forEach((themeSchema) => {
    const themeId = themeSchema.id;

    document.documentElement.classList.add(`theme-${themeId}`);

    if (themeId === 'personal' && customColors) {
      setPersonalThemeVariables(customColors);
    }
  });
};

const setPersonalThemeVariables = (colors: ThemeColors): void => {
  const cssVariables = {
    '--personal-backgroundColor': colors.backgroundColor,
    '--personal-headlineColor': colors.headlineColor,
    '--personal-textColor': colors.textColor,
    '--personal-accentColor': colors.accentColor,
    '--pageBg': colors.backgroundColor,
    '--titleBg': colors.backgroundColor,
    '--sectionBg': colors.headlineColor,
    '--normalText': colors.textColor,
    '--smallText': colors.textColor,
    '--normalSubHeadline': colors.textColor,
    '--smallSubheadline': colors.textColor,
    '--headline': colors.accentColor,
    '--sectionHeading': colors.accentColor,
    '--bulletPoints': colors.accentColor,
    '--titleText': colors.accentColor,
  };

  Object.entries(cssVariables).forEach(([property, value]) => {
    document.documentElement.style.setProperty(property, value);
  });
};

export const getImagePlaceholderByTheme = (theme: string) => {
  return colors[theme] ? colors[theme] : '#F3F3F3';
};

const colors: Record<string, string> = {
  blue: '#E7EAF4',
  green: '#EDF2EF',
  orange: '#FDF8F4',
  yellow: '#FDF8F1',
  pink: '#FAF1F6',
  purple: '#F5F1FA',
  light: '#F3F3F3',
  grey: '#3A3D50',
  darkpurple: '#372840',
  darkgreen: '#364223',
  darkblue: '#1C222F',
  darkorange: '#2E1D0E',
  darkyellow: '#2C2A11',
  darkpink: '#2A191F',
  darkred: '#301616',
  boardReport: '#1C284D',
  futureVision: '#2FBCC6',
  corporateVision: '#051724',
  corporateVisionDarkBlue: '#1C284E',
  corporateVisionLightBlueRed: '#FFFFFF',
  fastTurn: '#E4E4E4',
  creativeSpark: '#1C284D',
  funAndGames: '#474498',
  pitchDeck: '#6463FF',
  monthlyReport: '#FFFFFF',
  third: '#2C2A11',
  company: '#F3F3F3',
  user: '#F3F3F3',
};
