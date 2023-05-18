import { FormBlock, FormBlocks } from "@quillforms/types/build-types";
import { VoiceEnglish, VoiceFrench, VoiceItalian, VoicePortuguese } from "@/graphql/voices";
import { StoryTheme, GrammarOptions, SupportedLanguages, NarrativeStyle } from "@/graphql/types-and-hooks";
export interface FormStepsProps {
  shouldStoryBeCustomized: boolean;
  currentTargetLanguage: string;
}

export const getFormSteps = (options: FormStepsProps): FormBlocks => {
  const blocks = [
    {
      name: "welcome-screen",
      id: "welcome",
      attributes: {
        label: "Let's create a short story",
        description: "We will ask a couple of settings to create a story more suited for your language learning needs",
        layout: "stack",
        attachmentMaxWidth: "500px",
      },
    },
    {
      name: "multiple-choice",
      id: "language",
      attributes: {
        label: "What language do you want your story to be generated",
        required: true,
        multiple: false,
        layout: "stack",
        choices: [
          {
            label: "English",
            value: SupportedLanguages.En,
          },
          {
            label: "Portuguese",
            value: SupportedLanguages.Pt,
          },
          {
            label: "Italian",
            value: SupportedLanguages.It,
          },
          {
            label: "French",
            value: SupportedLanguages.Fr,
          },
        ],
      },
    },
    {
      name: "custom-block-voices",
      id: "voice",
      attributes: {
        label: "Select the voice you would like your audio to read on",
        description: "For a glimpse, click play button to preview",
        required: false,
        items: getVoicesFormMetadata(options.currentTargetLanguage),
      },
    },
    {
      id: "story-customized",
      name: "multiple-choice",
      attributes: {
        label: "Do you want to add some customization to your story?",
        description: "Like selecting a theme, a narrative style, use specific grammar rules or include specific words?",
        choices: [
          {
            value: "Yes",
            label: "Yes",
          },
          {
            value: "No",
            label: "No",
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
              label: "All right! What theme would you like to use for your story in {{field:language}}?",
              defaultValue: "Random",
              required: true,
              multiple: false,
              layout: "stack",
              choices: [
                {
                  label: "Random",
                  value: StoryTheme.Random,
                },
                {
                  label: "Adventure",
                  value: StoryTheme.Adventure,
                },
                {
                  label: "Romance",
                  value: StoryTheme.Romance,
                },
                {
                  label: "Fantasy",
                  value: StoryTheme.Fantasy,
                },
                {
                  label: "Sci-Fi",
                  value: StoryTheme.Scifi,
                },
                {
                  label: "Drama",
                  value: StoryTheme.Drama,
                },
                {
                  label: "Young Adult",
                  value: StoryTheme.Youngadult,
                },
                {
                  label: "Children",
                  value: StoryTheme.Children,
                },
              ],
            },
          } as FormBlock,
          {
            name: "multiple-choice",
            id: "narration-style",
            attributes: {
              label: "What about a narrative style, would you like to use a specific one?",
              defaultValue: "RANDOM",
              required: true,
              multiple: false,
              layout: "stack",
              choices: [
                {
                  label: "Random",
                  value: NarrativeStyle.Random,
                },
                {
                  label: "First Person Narrative",
                  value: NarrativeStyle.Firstperson,
                },
                {
                  label: "Third Person Narrative",
                  value: NarrativeStyle.Thirdperson,
                },
                {
                  label: "A Letter",
                  value: NarrativeStyle.Letter,
                },
                {
                  label: "New Yorker Style",
                  value: NarrativeStyle.Newyorker,
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
              label: "Are there specific Grammar Options you want to be used in the Story?",
              layout: "stack",
              choices: [
                {
                  label: "Past Tense",
                  value: GrammarOptions.Pasttense,
                },
                {
                  label: "Present Tense",
                  value: GrammarOptions.Presenttense,
                },
                {
                  label: "Future Tense",
                  value: GrammarOptions.Futuretense,
                },
                {
                  label: "Past Continuous",
                  value: GrammarOptions.Pastcontinuous,
                },
                {
                  label: "Present Continuous",
                  value: GrammarOptions.Presentcontinuous,
                },
                {
                  label: "Future Continuous",
                  value: GrammarOptions.Futurecontinuous,
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
              label: "Are there any words or a short sentence you would like to have included in your story?",
              description:
                "This is useful if there is a word or sentence you have been struggling with while learning {{field:language}}",
            },
          } as FormBlock,
        ]
      : [
          {
            id: "end",
            name: "statement",
            attributes: {
              label: "We are all set, let's create your story in {{field:language}}",
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
