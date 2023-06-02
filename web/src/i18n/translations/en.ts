import { SupportedLanguages, NarrationStyle, GrammarOptions, AudioSpeed, StoryTheme } from "@/graphql/types-and-hooks";

export const en = {
  common: {
    yes: "Yes",
    no: "No",
    languages: Object.fromEntries(
      new Map([
        [SupportedLanguages.En, "English"],
        [SupportedLanguages.Fr, "French"],
        [SupportedLanguages.It, "Italian"],
        [SupportedLanguages.Pt, "Portuguese"],
      ])
    ),
    themes: Object.fromEntries(
      new Map([
        [StoryTheme.Random, "Random"],
        [StoryTheme.Adventure, "Adventure"],
        [StoryTheme.Romance, "Romance"],
        [StoryTheme.Fantasy, "Fantasy"],
        [StoryTheme.SciFi, "Sci-Fi"],
        [StoryTheme.Drama, "Drama"],
        [StoryTheme.YoungAdult, "YoungAdult"],
        [StoryTheme.Children, "Children"],
      ])
    ),
    narrationStyles: Object.fromEntries(
      new Map([
        [NarrationStyle.FirstPerson, "First Person"],
        [NarrationStyle.Letter, "Letter"],
        [NarrationStyle.NewYorker, "New Yorker"],
        [NarrationStyle.Random, "Random"],
        [NarrationStyle.ThirdPerson, "Third Person"],
      ])
    ),
    grammarOptions: Object.fromEntries(
      new Map([
        [GrammarOptions.PastTense, "Past Tense"],
        [GrammarOptions.PresentTense, "Present Tense"],
        [GrammarOptions.FutureTense, "Future Tense"],
        [GrammarOptions.PastContinuous, "Past Continuous"],
        [GrammarOptions.PresentContinuous, "Present Continuous"],
        [GrammarOptions.FutureContinuous, "Future Continuous"],
      ])
    ),
    audioSpeeds: Object.fromEntries(
      new Map([
        [AudioSpeed.Slow, "Slow"],
        [AudioSpeed.Normal, "Normal"],
      ])
    ),
  },
  app: {
    name: "Lang App",
  },
  home: {
    loading: "Loading your stories...",
  },
  header: {
    home: "Home",
    newStory: "New Story",
  },
  story: {
    waiting: {
      loading0: "Give me just a few more seconds",
      loading1: "Ai is thinking about your story",
      loading2: "Hiring an virtual writer",
      loading3: "Too expensive, rescinding contract",
      loading4: "AI decided to write it by themselves",
      loading5: "Finding a dictionary to translate text",
      loading6: "Reading out loud to record audio",
      loading7: "Give me just a few more seconds",
      error: "There was an error fetching your story.",
      retry: "Retry",
    },
    reading: {
      loading: "Loading...",
      error: "Something went wrong",
      translation: "Translation",
      header: {
        generationDate: "Story generated on",
        theme: "Theme",
        narrationStyle: "Narration Style",
        language: "Language",
        translatedTo: "Translated to",
        readingVoice: "Reading Voice",
        grammarOptions: "Grammar Options",
        specificWords: "Specific Words",
        readingSpeed: "Reading Speed",
      },
      moreInfo: {
        dismiss: "Dismiss this text",
        selectedText: "Selected text:",
        loading: "Building Explanation...",
        error: "Error Loading explanation",
        retry: "Retry",
      },
    },
    audioPlayer: {
      speed: "Speed",
      changeTo: "Change to",
    },
    new: {
      error: "Error creating your story, please try again.",
      form: {
        "label.button.ok": "Ok",
        "label.hintText.enter": "press <strong>Enter ↵</strong>",
        "label.hintText.multipleSelection": "Choose as many as you like",
        "block.dropdown.placeholder": "Type or select an option",
        "block.dropdown.noSuggestions": "No Suggestions!",
        "block.shortText.placeholder": "Type your answer here",
        "block.longText.placeholder": "Type your answer here",
        "block.longText.hint": "<strong>Shift ⇧ + Enter ↵</strong> to make a line break",
        "block.number.placeholder": "Type your answer here",
        "block.email.placeholder": "Type your email here",
        "block.defaultThankYouScreen.label": "Please wait while we generate your story!",
        "label.hintText.key": "Key",
        "label.progress.percent": "{{progress:percent}}% completed",
        "label.errorAlert.required": "This field is required!",
        "label.errorAlert.date": "Invalid date!",
        "label.errorAlert.number": "Numbers only!",
        "label.errorAlert.selectionRequired": "Please make at least one selection!",
        "label.errorAlert.email": "Invalid email!",
        "label.errorAlert.url": "Invalid url!",
        "label.errorAlert.range": "Please enter a number between {{attribute:min}} and {{attribute:max}}",
        "label.errorAlert.minNum": "Please enter a number greater than {{attribute:min}}",
        "label.errorAlert.maxNum": "Please enter a number lower than {{attribute:max}}",
        "label.errorAlert.maxCharacters": "Maximum characters reached!",
        "label.submitBtn": "Submit",
      },
      welcome: {
        label: "Let's create a short story",
        description: "We will ask a couple of settings to create a story more suited for your language learning needs",
        action: "Let's start!",
      },
      language: {
        label: "What language do you want your story to be generated",
        description: "Don't worry, we will also translate back to English to help you while learning",
      },
      voice: {
        label: "Select the voice you would like your audio to read on",
        description: "For a glimpse, click play button to preview",
      },
      customization: {
        label: "Do you want to add some customization to your story?",
        description: "Like selecting a theme, a narrative style, use specific grammar rules or include specific words?",
      },
      theme: {
        label: "All right! What theme would you like to use for your story?",
      },
      narrationStyle: {
        label: "What about a narrative style, would you like to use a specific one?",
      },
      grammarOptions: {
        label: "Are there specific Grammar Options you want to be used in the Story?",
      },
      specificWords: {
        label: "Are there any words or a short sentence you would like to have included in your story?",
        description:
          "This is useful if there is a word or sentence you have been struggling with while learning a new language",
      },
      end: {
        label: "We are all set, let's create your story!",
      },
    },
  },
};
