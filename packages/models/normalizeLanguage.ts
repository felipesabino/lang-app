import { SupportedLanguages } from "@langapp/graphql";


export const normalizeLanguageCode = (language: SupportedLanguages): string => {
  switch (language) {
    case SupportedLanguages.En:
      return "en-US";
    case SupportedLanguages.Fr:
      return "fr-FR";
    case SupportedLanguages.It:
      return "it-IT";
    case SupportedLanguages.Pt:
      return "pt-BR";
    default:
      throw new Error(`Error when normalizing language code, provided language is not supported: ${language}`);
  }
};

export const normalizeLanguageName = (language: SupportedLanguages): string => {
  switch (language) {
    case SupportedLanguages.En:
      return "English";
    case SupportedLanguages.Fr:
      return "French";
    case SupportedLanguages.It:
      return "Italian";
    case SupportedLanguages.Pt:
      return "Brazilian Portuguese";
    default:
      throw new Error(`Error when normalizing language code, provided language is not supported: ${language}`);
  }
};
