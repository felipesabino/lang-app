import { SupportedLanguages, NarrationStyle, GrammarOptions, AudioSpeed, StoryTheme } from "@/graphql/types-and-hooks";
import { en } from "./en";

export const fr: typeof en = {
  common: {
    yes: "Oui",
    no: "Non",
    languages: Object.fromEntries(
      new Map([
        [SupportedLanguages.En, "Anglais"],
        [SupportedLanguages.Fr, "Français"],
        [SupportedLanguages.It, "Italien"],
        [SupportedLanguages.Pt, "Portugais"],
      ])
    ),
    themes: Object.fromEntries(
      new Map([
        [StoryTheme.Random, "Aléatoire"],
        [StoryTheme.Adventure, "Aventure"],
        [StoryTheme.Romance, "Romance"],
        [StoryTheme.Fantasy, "Fantaisie"],
        [StoryTheme.SciFi, "Science-Fiction"],
        [StoryTheme.Drama, "Drame"],
        [StoryTheme.YoungAdult, "Jeune adulte"],
        [StoryTheme.Children, "Enfants"],
      ])
    ),
    narrationStyles: Object.fromEntries(
      new Map([
        [NarrationStyle.FirstPerson, "Première personne"],
        [NarrationStyle.Letter, "Lettre"],
        [NarrationStyle.NewYorker, "New Yorker"],
        [NarrationStyle.Random, "Aléatoire"],
        [NarrationStyle.ThirdPerson, "Troisième personne"],
      ])
    ),
    grammarOptions: Object.fromEntries(
      new Map([
        [GrammarOptions.PastTense, "Passé"],
        [GrammarOptions.PresentTense, "Présent"],
        [GrammarOptions.FutureTense, "Futur"],
        [GrammarOptions.PastContinuous, "Passé continu"],
        [GrammarOptions.PresentContinuous, "Présent continu"],
        [GrammarOptions.FutureContinuous, "Futur continu"],
      ])
    ),
    audioSpeeds: Object.fromEntries(
      new Map([
        [AudioSpeed.Slow, "Lent"],
        [AudioSpeed.Normal, "Normal"],
      ])
    ),
  },
  app: {
    name: "Lang App",
  },
  home: {
    loading: "Chargement de vos histoires...",
  },
  header: {
    home: "Accueil",
    newStory: "Nouvelle histoire",
  },
  story: {
    waiting: {
      loading0: "Donnez-moi juste quelques secondes de plus",
      loading1: "L'IA réfléchit à votre histoire",
      loading2: "Embauche d'un écrivain virtuel",
      loading3: "Trop cher, résiliation du contrat",
      loading4: "L'IA a décidé de l'écrire elle-même",
      loading5: "Recherche d'un dictionnaire pour traduire le texte",
      loading6: "Lecture à voix haute pour enregistrer l'audio",
      loading7: "Donnez-moi juste quelques secondes de plus",
      error: "Il y a eu une erreur lors de la récupération de votre histoire.",
      retry: "Réessayer",
    },
    reading: {
      loading: "Chargement...",
      error: "Quelque chose a mal tourné",
      translation: "Traduction",
      header: {
        generationDate: "Histoire générée le",
        theme: "Thème",
        narrationStyle: "Style de narration",
        language: "Langue",
        translatedTo: "Traduit en",
        readingVoice: "Voix de lecture",
        grammarOptions: "Options de grammaire",
        specificWords: "Mots spécifiques",
        readingSpeed: "Vitesse de lecture",
      },
      moreInfo: {
        dismiss: "Rejeter ce texte",
        selectedText: "Texte sélectionné:",
        loading: "Construction de l'explication...",
        error: "Erreur de chargement de l'explication",
        retry: "Réessayer",
      },
    },
    audioPlayer: {
      speed: "Vitesse",
      changeTo: "Changer pour",
    },
    new: {
      error: "Erreur lors de la création de votre histoire, veuillez réessayer.",
      form: {
        "label.button.ok": "Ok",
        "label.hintText.enter": "appuyez sur <strong>Entrée ↵</strong>",
        "label.hintText.multipleSelection": "Choisissez autant que vous le souhaitez",
        "block.dropdown.placeholder": "Tapez ou sélectionnez une option",
        "block.dropdown.noSuggestions": "Pas de suggestions!",
        "block.shortText.placeholder": "Tapez votre réponse ici",
        "block.longText.placeholder": "Tapez votre réponse ici",
        "block.longText.hint": "<strong>Maj ⇧ + Entrée ↵</strong> pour faire un saut de ligne",
        "block.number.placeholder": "Tapez votre réponse ici",
        "block.email.placeholder": "Tapez votre email ici",
        "block.defaultThankYouScreen.label": "Veuillez attendre pendant que nous générons votre histoire!",
        "label.hintText.key": "Clé",
        "label.progress.percent": "{{progress:percent}}% terminé",
        "label.errorAlert.required": "Ce champ est obligatoire!",
        "label.errorAlert.date": "Date invalide!",
        "label.errorAlert.number": "Chiffres uniquement!",
        "label.errorAlert.selectionRequired": "Veuillez faire au moins une sélection!",
        "label.errorAlert.email": "Email invalide!",
        "label.errorAlert.url": "URL invalide!",
        "label.errorAlert.range": "Veuillez entrer un nombre entre {{attribute:min}} et {{attribute:max}}",
        "label.errorAlert.minNum": "Veuillez entrer un nombre supérieur à {{attribute:min}}",
        "label.errorAlert.maxNum": "Veuillez entrer un nombre inférieur à {{attribute:max}}",
        "label.errorAlert.maxCharacters": "Maximum de caractères atteint!",
        "label.submitBtn": "Soumettre",
      },
      welcome: {
        label: "Créons une petite histoire",
        description:
          "Nous allons poser quelques paramètres pour créer une histoire plus adaptée à vos besoins d'apprentissage de la langue",
        action: "Commençons!",
      },
      language: {
        label: "Dans quelle langue voulez-vous que votre histoire soit générée",
        description:
          "Ne vous inquiétez pas, nous traduirons également en français pour vous aider pendant votre apprentissage",
      },
      voice: {
        label: "Sélectionnez la voix que vous aimeriez utiliser pour lire votre audio",
        description: "Pour un aperçu, cliquez sur le bouton lecture pour prévisualiser",
      },
      customization: {
        label: "Voulez-vous ajouter quelques personnalisations à votre histoire?",
        description:
          "Comme choisir un thème, un style narratif, utiliser des règles de grammaire spécifiques ou inclure des mots spécifiques?",
      },
      theme: {
        label: "D'accord! Quel thème aimeriez-vous utiliser pour votre histoire?",
      },
      narrationStyle: {
        label: "Et le style narratif, aimeriez-vous en utiliser un spécifique?",
      },
      grammarOptions: {
        label: "Y a-t-il des options de grammaire spécifiques que vous souhaitez utiliser dans l'histoire?",
      },
      specificWords: {
        label: "Y a-t-il des mots ou une petite phrase que vous aimeriez voir inclus dans votre histoire?",
        description:
          "Ceci est utile si il y a un mot ou une phrase avec lequel vous avez du mal en apprenant une nouvelle langue",
      },
      end: {
        label: "Nous sommes prêts, créons votre histoire!",
      },
    },
  },
};
