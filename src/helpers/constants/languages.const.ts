interface LanguageMap {
  [key: string]: string;
}

export interface Language {
  label: string;
  value: string;
}

export const languages: Language[] = [
  { label: 'Arabic', value: 'arabic' },
  { label: 'Bengali', value: 'bengali' },
  { label: 'Chinese simplified', value: 'chinese_simplified' },
  { label: 'Chinese traditional', value: 'chinese_traditional' },
  { label: 'Czech', value: 'czech' },
  { label: 'Dutch', value: 'dutch' },
  { label: 'English', value: 'english' },
  { label: 'Finnish', value: 'finnish' },
  { label: 'French', value: 'french' },
  { label: 'German', value: 'german' },
  { label: 'Hausa', value: 'hausa' },
  { label: 'Hindi', value: 'hindi' },
  { label: 'Hungarian', value: 'hungarian' },
  { label: 'Indonesian', value: 'indonesian' },
  { label: 'Italian', value: 'italian' },
  { label: 'Japanese', value: 'japanese' },
  { label: 'Javanese', value: 'javanese' },
  { label: 'Korean', value: 'korean' },
  { label: 'Malay', value: 'malay' },
  { label: 'Norwegian', value: 'norwegian' },
  { label: 'Polish', value: 'polish' },
  { label: 'Portuguese', value: 'portuguese' },
  { label: 'Russian', value: 'russian' },
  { label: 'Spanish', value: 'spanish' },
  { label: 'Swedish', value: 'swedish' },
  { label: 'Thai', value: 'thai' },
  { label: 'Turkish', value: 'turkish' },
  { label: 'Ukrainian', value: 'ukrainian' },
  { label: 'Vietnamese', value: 'vietnamese' },
];

export const languageMap: LanguageMap = {
  ar: 'arabic',
  bn: 'bengali',
  'zh-CN': 'chinese_simplified',
  'zh-TW': 'chinese_traditional',
  cs: 'czech',
  nl: 'dutch',
  en: 'english',
  fi: 'finnish',
  fr: 'french',
  de: 'german',
  ha: 'hausa',
  hi: 'hindi',
  hu: 'hungarian',
  id: 'indonesian',
  it: 'italian',
  ja: 'japanese',
  jv: 'javanese',
  ko: 'korean',
  ms: 'malay',
  no: 'norwegian',
  pl: 'polish',
  pt: 'portuguese',
  ru: 'russian',
  es: 'spanish',
  sv: 'swedish',
  th: 'thai',
  tr: 'turkish',
  uk: 'ukrainian',
  vi: 'vietnamese',
};

export const reversedLanguageMap: Record<string, string> = {
  arabic: 'ar',
  bengali: 'bn',
  chinese_simplified: 'zh-CN',
  chinese_traditional: 'zh-TW',
  czech: 'cs',
  dutch: 'nl',
  english: 'en',
  finnish: 'fi',
  french: 'fr',
  german: 'de',
  hausa: 'ha',
  hindi: 'hi',
  hungarian: 'hu',
  indonesian: 'id',
  italian: 'it',
  japanese: 'ja',
  javanese: 'jv',
  korean: 'ko',
  malay: 'ms',
  norwegian: 'no',
  polish: 'pl',
  portuguese: 'pt',
  russian: 'ru',
  spanish: 'es',
  swedish: 'sv',
  thai: 'th',
  turkish: 'tr',
  ukrainian: 'uk',
  vietnamese: 'vi',
};

export const languageLengthFactor: Record<string, number> = {
  ar: 1.2,
  bn: 1.2,
  'zh-CN': 0.65,
  'zh-TW': 0.7,
  cs: 1.3,
  nl: 1.2,
  en: 1.0,
  fi: 1.3,
  fr: 1.25,
  de: 1.4,
  ha: 1.2,
  hi: 1.3,
  hu: 1.3,
  id: 1.1,
  it: 1.2,
  ja: 0.75,
  jv: 1.1,
  ko: 0.8,
  ms: 1.1,
  no: 1.15,
  pl: 1.3,
  pt: 1.2,
  ru: 1.25,
  es: 1.2,
  sv: 1.2,
  th: 0.85,
  tr: 1.2,
  uk: 1.25,
  vi: 1.0,
};

export const getLengthLimits = (langId: string, baseMin: number, baseMax: number) => {
  const factor = languageLengthFactor[reversedLanguageMap[langId]] ?? 1.3;

  const min = Math.max(Math.round(baseMin * factor), 8);
  const max = Math.round(baseMax * factor);

  return [min, max];
};

export const DEFAULT_LANGUAGE = 'en';
