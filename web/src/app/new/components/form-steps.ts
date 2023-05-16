import { FormBlock, FormBlocks } from "@quillforms/types/build-types";
import { VoiceEnglish, VoiceFrench, VoiceItalian, VoicePortuguese } from "@/graphql/voices";

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
        // attachment: {
        //   type: "image",
        //   url: "/people.png"
        // },
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
        // attachment: {
        //   type: "image",
        //   url: "/flags.png"
        // },
        layout: "stack",
        choices: [
          {
            label: "English",
            value: "en",
          },
          {
            label: "Portuguese",
            value: "pt",
          },
          {
            label: "Italian",
            value: "it",
          },
          {
            label: "French",
            value: "fr",
          },
        ],
      },
    },
    {
      name: "custom-block-voices",
      id: "voice",
      attributes: {
        label: "Select the voice you would like your audio to read on",
        description: "For a glimpse, click on preview",
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
              // attachment: {
              //   type: "image",
              //   url: "/books.png"
              // },
              layout: "stack",
              choices: [
                {
                  label: "Random",
                  value: "RANDOM",
                },
                {
                  label: "Adventure",
                  value: "ADVENTURE",
                },
                {
                  label: "Romance",
                  value: "ROMANCE",
                },
                {
                  label: "Fantasy",
                  value: "FANTASY",
                },
                {
                  label: "Sci-Fi",
                  value: "SCIFI",
                },
                {
                  label: "Drama",
                  value: "DRAMA",
                },
                {
                  label: "Young Adult",
                  value: "YOUNGADULT",
                },
                {
                  label: "Children",
                  value: "CHILDREN",
                },
              ],
            },
          } as FormBlock,
          {
            name: "multiple-choice",
            id: "narrative-style",
            attributes: {
              label: "What about a narrative style, would you like to use a specific one?",
              defaultValue: "RANDOM",
              required: true,
              multiple: false,
              // attachment: {
              //   type: "image",
              //   url: "/read.png"
              // },
              layout: "stack",
              choices: [
                {
                  label: "Random",
                  value: "RANDOM",
                },
                {
                  label: "First Person Narrative",
                  value: "FIRSTPERSON",
                },
                {
                  label: "Third Person Narrative",
                  value: "THIRDPERSON",
                },
                {
                  label: "A Letter",
                  value: "LETTER",
                },
                {
                  label: "New Yorker Style",
                  value: "NEWYORKER",
                },
              ],
            },
          } as FormBlock,
          {
            name: "multiple-choice",
            id: "gramma-options",
            attributes: {
              required: false,
              multiple: true,
              verticalAlign: false,
              label: "Are there specific Grammar Options you want to be used in the Story?",
              // attachment: {
              //   type: "image",
              //   url: "/grammar.png"
              // },
              layout: "stack",
              choices: [
                {
                  label: "Past Tense",
                  value: "PASTTENSE",
                },
                {
                  label: "Present Tense",
                  value: "PRESENTTENSE",
                },
                {
                  label: "Future Tense",
                  value: "FUTURETENSE",
                },
                {
                  label: "Past Continuous",
                  value: "PASTCONTINUOUS",
                },
                {
                  label: "Present Continuous",
                  value: "PRESENTCONTINUOUS",
                },
                {
                  label: "Future Continuous",
                  value: "FUTURECONTINUOUS",
                },
              ],
            },
          } as FormBlock,
          {
            name: "short-text",
            id: "specific-words",
            attributes: {
              required: false,
              // attachment: {
              //   type: "image",
              //   url: "/words.png"
              // },
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
    console.log(type, Object.keys(type));
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
