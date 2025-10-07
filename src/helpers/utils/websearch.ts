import { PexelsColors, UnsplashColors, GoogleColors } from '../constants/image-search.const';

export const getColorsByTheme = (theme: string, stockName?: string) => {
  if (stockName === 'google') {
    return getGoogleColors(theme);
  } else if (stockName === 'unsplash') {
    return getUnsplashColors(theme);
  } else {
    return getPexelsColors(theme);
  }
};

const getUnsplashColors = (theme: string) => {
  switch (theme) {
    case 'light':
    case 'fastTurn':
    case 'monthlyReport':
      return UnsplashColors.WHITE;
    case 'grey':
      return UnsplashColors.BLACK;
    case 'blue':
    case 'darkblue':
    case 'corporateVision':
    case 'creativeSpark':
    case 'futureVision':
    case 'boardReport':
    case 'pitchDeck':
      return UnsplashColors.BLUE;
    case 'red':
    case 'darkred':
      return UnsplashColors.RED;
    case 'yellow':
    case 'darkyellow':
      return UnsplashColors.YELLOW;
    case 'green':
    case 'darkgreen':
      return UnsplashColors.GREEN;
    case 'pink':
    case 'darkpink':
      return UnsplashColors.MAGENTA;
    case 'purple':
    case 'darkpurple':
    case 'funAndGames':
      return UnsplashColors.PURPLE;
    case 'orange':
    case 'darkorange':
      return UnsplashColors.ORANGE;
  }
};

const getPexelsColors = (theme: string) => {
  switch (theme) {
    case 'light':
    case 'fastTurn':
    case 'monthlyReport':
      return PexelsColors.WHITE;
    case 'grey':
      return PexelsColors.GRAY;
    case 'blue':
    case 'darkblue':
    case 'corporateVision':
    case 'creativeSpark':
    case 'futureVision':
    case 'boardReport':
    case 'pitchDeck':
      return PexelsColors.BLUE;
    case 'red':
    case 'darkred':
      return PexelsColors.RED;
    case 'yellow':
    case 'darkyellow':
      return PexelsColors.YELLOW;
    case 'green':
    case 'darkgreen':
      return PexelsColors.GREEN;
    case 'pink':
    case 'darkpink':
      return PexelsColors.MAGENTA;
    case 'purple':
    case 'darkpurple':
    case 'funAndGames':
      return PexelsColors.PURPLE;
    case 'orange':
    case 'darkorange':
      return PexelsColors.ORANGE;
  }
};

const getGoogleColors = (theme: string) => {
  switch (theme) {
    case 'light':
    case 'fastTurn':
    case 'monthlyReport':
      return GoogleColors.WHITE;
    case 'grey':
      return GoogleColors.GRAY;
    case 'blue':
    case 'darkblue':
    case 'corporateVision':
    case 'creativeSpark':
    case 'futureVision':
    case 'boardReport':
    case 'pitchDeck':
      return GoogleColors.BLUE;
    case 'red':
    case 'darkred':
      return GoogleColors.RED;
    case 'yellow':
    case 'darkyellow':
      return GoogleColors.YELLOW;
    case 'green':
    case 'darkgreen':
      return GoogleColors.GREEN;
    case 'pink':
    case 'darkpink':
      return GoogleColors.PINK;
    case 'purple':
    case 'darkpurple':
    case 'funAndGames':
      return GoogleColors.PURPLE;
    case 'orange':
    case 'darkorange':
      return GoogleColors.ORANGE;
  }
};
