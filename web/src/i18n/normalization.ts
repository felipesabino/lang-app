import { SupportedLanguages } from '@/graphql/types-and-hooks';

export const normalizeLanguageTranslation = (language: string): SupportedLanguages => {
    switch (language) {
      case 'en':
        return SupportedLanguages.En;
      case 'fr':
        return SupportedLanguages.Fr;
      case "it":
        return SupportedLanguages.It;
      case "pt":
        return SupportedLanguages.Pt;
      default:
        throw new Error(`Error when normalizing language code, provided language is not supported: ${language}`);
    }
  };