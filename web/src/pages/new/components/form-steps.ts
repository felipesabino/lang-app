import { FormBlock, FormBlocks } from "@quillforms/types/build-types";
import { VoiceEnglish, VoiceFrench, VoiceItalian, VoicePortuguese } from "@/graphql/voices";
import { StoryTheme, GrammarOptions, SupportedLanguages, NarrationStyle } from "@/graphql/types-and-hooks";
import { TFunction } from "i18next";

export interface FormStepsProps {
  shouldStoryBeCustomized: boolean;
  currentTargetLanguage: string;
}

export const getFormSteps = (
  options: FormStepsProps,
  t: TFunction<"translation", undefined, "translation">
): FormBlocks => {
  const blocks = [
    {
      name: "welcome-screen",
      id: "welcome",
      attributes: {
        label: t("story.new.welcome.label"),
        description: t("story.new.welcome.description"),
        layout: "stack",
        buttonText: t("story.new.welcome.action"),
      },
    },
    {
      name: "multiple-choice",
      id: "language",
      attributes: {
        label: t("story.new.language.label"),
        description: t("story.new.language.description"),
        required: true,
        multiple: false,
        layout: "stack",
        choices: [
          {
            label: t(`common.languages.${SupportedLanguages.En}`),
            value: SupportedLanguages.En,
          },
          {
            label: t(`common.languages.${SupportedLanguages.Pt}`),
            value: SupportedLanguages.Pt,
          },
          {
            label: t(`common.languages.${SupportedLanguages.It}`),
            value: SupportedLanguages.It,
          },
          {
            label: t(`common.languages.${SupportedLanguages.Fr}`),
            value: SupportedLanguages.Fr,
          },
        ],
      },
    },
    {
      name: "custom-block-voices",
      id: "voice",
      attributes: {
        label: t("story.new.voice.label"),
        description: t("story.new.voice.description"),
        required: true,
        items: getVoicesFormMetadata(options.currentTargetLanguage),
      },
    },
    {
      id: "story-customized",
      name: "multiple-choice",
      attributes: {
        label: t("story.new.customization.label"),
        description: t("story.new.customization.description"),
        choices: [
          {
            label: t("common.yes"),
            value: "Yes",
          },
          {
            label: t("common.no"),
            value: "No",
          },
        ],
        verticalAlign: false,
        multiple: false,
      },
    },
    ...(options.shouldStoryBeCustomized
      ? [
          {
            name: "multiple-choice",
            id: "theme",
            attributes: {
              label: t("story.new.theme.label"),
              defaultValue: "Random",
              required: true,
              multiple: false,
              layout: "stack",
              choices: [
                {
                  label: t(`common.themes.${StoryTheme.Random}`),
                  value: StoryTheme.Random,
                },
                {
                  label: t(`common.themes.${StoryTheme.Adventure}`),
                  value: StoryTheme.Adventure,
                },
                {
                  label: t(`common.themes.${StoryTheme.Romance}`),
                  value: StoryTheme.Romance,
                },
                {
                  label: t(`common.themes.${StoryTheme.Fantasy}`),
                  value: StoryTheme.Fantasy,
                },
                {
                  label: t(`common.themes.${StoryTheme.SciFi}`),
                  value: StoryTheme.SciFi,
                },
                {
                  label: t(`common.themes.${StoryTheme.Drama}`),
                  value: StoryTheme.Drama,
                },
                {
                  label: t(`common.themes.${StoryTheme.YoungAdult}`),
                  value: StoryTheme.YoungAdult,
                },
                {
                  label: t(`common.themes.${StoryTheme.Children}`),
                  value: StoryTheme.Children,
                },
              ],
            },
          } as FormBlock,
          {
            name: "multiple-choice",
            id: "narration-style",
            attributes: {
              label: t("story.new.narrationStyle.label"),
              defaultValue: NarrationStyle.Random,
              required: true,
              multiple: false,
              layout: "stack",
              choices: [
                {
                  label: t(`common.narrationStyles.${NarrationStyle.Random}`),
                  value: NarrationStyle.Random,
                },
                {
                  label: t(`common.narrationStyles.${NarrationStyle.FirstPerson}`),
                  value: NarrationStyle.FirstPerson,
                },
                {
                  label: t(`common.narrationStyles.${NarrationStyle.ThirdPerson}`),
                  value: NarrationStyle.ThirdPerson,
                },
                {
                  label: t(`common.narrationStyles.${NarrationStyle.Letter}`),
                  value: NarrationStyle.Letter,
                },
                {
                  label: t(`common.narrationStyles.${NarrationStyle.NewYorker}`),
                  value: NarrationStyle.NewYorker,
                },
              ],
            },
          } as FormBlock,
          {
            name: "multiple-choice",
            id: "grammar-options",
            attributes: {
              required: false,
              multiple: true,
              verticalAlign: false,
              label: t("story.new.grammarOptions.label"),
              layout: "stack",
              choices: [
                {
                  label: t(`common.grammarOptions.${GrammarOptions.PastTense}`),
                  value: GrammarOptions.PastTense,
                },
                {
                  label: t(`common.grammarOptions.${GrammarOptions.PresentTense}`),
                  value: GrammarOptions.PresentTense,
                },
                {
                  label: t(`common.grammarOptions.${GrammarOptions.FutureTense}`),
                  value: GrammarOptions.FutureTense,
                },
                {
                  label: t(`common.grammarOptions.${GrammarOptions.PastContinuous}`),
                  value: GrammarOptions.PastContinuous,
                },
                {
                  label: t(`common.grammarOptions.${GrammarOptions.PresentContinuous}`),
                  value: GrammarOptions.PresentContinuous,
                },
                {
                  label: t(`common.grammarOptions.${GrammarOptions.FutureContinuous}`),
                  value: GrammarOptions.FutureContinuous,
                },
              ],
            },
          } as FormBlock,
          {
            name: "short-text",
            id: "specific-words",
            attributes: {
              required: false,
              layout: "stack",
              label: t("story.new.specificWords.label"),
              description: t("story.new.specificWords.description"),
            },
          } as FormBlock,
        ]
      : [
          {
            id: "end",
            name: "statement",
            attributes: {
              label: t("story.new.end.label"),
              quotationMarks: false,
            },
          } as FormBlock,
        ]),
  ] as FormBlocks;

  return blocks;
};

const getVoicesFormMetadata = (language: string): any[] => {
  if (!language) return [];

  const getValuesFromType = (type: any) => {
    return Object.keys(type).map((key) => {
      return {
        value: key,
        text: key,
        imageUrl: `/voices/${language}-${key.toLocaleLowerCase()}.png`,
        audioUrl: `/voices/${language}-${key.toLocaleLowerCase()}.mp3`,
      };
    });
  };

  return getValuesFromType(
    {
      en: VoiceEnglish,
      pt: VoicePortuguese,
      it: VoiceItalian,
      fr: VoiceFrench,
    }[language]
  );
};
