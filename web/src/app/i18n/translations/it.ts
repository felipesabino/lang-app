import { SupportedLanguages, NarrationStyle, GrammarOptions, AudioSpeed, StoryTheme } from "@/graphql/types-and-hooks";
import { en } from "./en";

export const it: typeof en = {
  common: {
    yes: "Sì",
    no: "No",
    languages: Object.fromEntries(
      new Map([
        [SupportedLanguages.En, "Inglese"],
        [SupportedLanguages.Fr, "Francese"],
        [SupportedLanguages.It, "Italiano"],
        [SupportedLanguages.Pt, "Portoghese"],
      ])
    ),
    themes: Object.fromEntries(
      new Map([
        [StoryTheme.Random, "Casuale"],
        [StoryTheme.Adventure, "Avventura"],
        [StoryTheme.Romance, "Romantico"],
        [StoryTheme.Fantasy, "Fantasia"],
        [StoryTheme.SciFi, "Fantascienza"],
        [StoryTheme.Drama, "Dramma"],
        [StoryTheme.YoungAdult, "Giovane adulto"],
        [StoryTheme.Children, "Infantile"],
      ])
    ),
    narrationStyles: Object.fromEntries(
      new Map([
        [NarrationStyle.FirstPerson, "Prima persona"],
        [NarrationStyle.Letter, "Lettera"],
        [NarrationStyle.NewYorker, "Stile New Yorker"],
        [NarrationStyle.Random, "Casuale"],
        [NarrationStyle.ThirdPerson, "Terza persona"],
      ])
    ),
    grammarOptions: Object.fromEntries(
      new Map([
        [GrammarOptions.PastTense, "Passato"],
        [GrammarOptions.PresentTense, "Presente"],
        [GrammarOptions.FutureTense, "Futuro"],
        [GrammarOptions.PastContinuous, "Passato continuo"],
        [GrammarOptions.PresentContinuous, "Presente continuo"],
        [GrammarOptions.FutureContinuous, "Futuro continuo"],
      ])
    ),
    audioSpeeds: Object.fromEntries(
      new Map([
        [AudioSpeed.Slow, "Lento"],
        [AudioSpeed.Normal, "Normale"],
      ])
    ),
  },
  app: {
    name: "App Lingue",
  },
  home: {
    loading: "Caricamento delle tue storie...",
  },
  header: {
    home: "Home",
    newStory: "Nuova Storia",
  },
  story: {
    waiting: {
      loading0: "Dammi solo qualche secondo in più",
      loading1: "L'IA sta pensando alla tua storia",
      loading2: "Assumendo un scrittore virtuale",
      loading3: "Troppo costoso, rescindendo il contratto",
      loading4: "L'IA ha deciso di scriverlo da sola",
      loading5: "Trovando un dizionario per tradurre il testo",
      loading6: "Leggendo ad alta voce per registrare l'audio",
      loading7: "Dammi solo qualche secondo in più",
      error: "Si è verificato un errore nel recuperare la tua storia.",
      retry: "Riprova",
    },
    reading: {
      loading: "Caricamento...",
      error: "Qualcosa è andato storto",
      translation: "Traduzione",
      header: {
        generationDate: "Storia generata il",
        theme: "Tema",
        narrationStyle: "Stile di narrazione",
        language: "Lingua",
        translatedTo: "Tradotto in",
        readingVoice: "Voce di lettura",
        grammarOptions: "Opzioni grammaticali",
        specificWords: "Parole specifiche",
        readingSpeed: "Velocità di lettura",
      },
      moreInfo: {
        dismiss: "Ignora questo testo",
        selectedText: "Testo selezionato:",
        loading: "Creazione spiegazione...",
        error: "Errore nel caricamento della spiegazione",
        retry: "Riprova",
      },
    },
    audioPlayer: {
      speed: "Velocità",
      changeTo: "Cambia in",
    },
    new: {
      error: "Errore nella creazione della tua storia, per favore riprova.",
      form: {
        "label.button.ok": "Ok",
        "label.hintText.enter": "premi <strong>Enter ↵</strong>",
        "label.hintText.multipleSelection": "Scegli quanti ne vuoi",
        "block.dropdown.placeholder": "Digita o seleziona un'opzione",
        "block.dropdown.noSuggestions": "Nessun suggerimento!",
        "block.shortText.placeholder": "Digita la tua risposta qui",
        "block.longText.placeholder": "Digita la tua risposta qui",
        "block.longText.hint": "<strong>Shift ⇧ + Enter ↵</strong> per fare un'interruzione di riga",
        "block.number.placeholder": "Digita la tua risposta qui",
        "block.email.placeholder": "Digita la tua email qui",
        "block.defaultThankYouScreen.label": "Per favore aspetta mentre generiamo la tua storia!",
        "label.hintText.key": "Chiave",
        "label.progress.percent": "{{progress:percent}}% completato",
        "label.errorAlert.required": "Questo campo è obbligatorio!",
        "label.errorAlert.date": "Data non valida!",
        "label.errorAlert.number": "Solo numeri!",
        "label.errorAlert.selectionRequired": "Per favore fai almeno una selezione!",
        "label.errorAlert.email": "Email non valida!",
        "label.errorAlert.url": "URL non valido!",
        "label.errorAlert.range": "Per favore inserisci un numero tra {{attribute:min}} e {{attribute:max}}",
        "label.errorAlert.minNum": "Per favore inserisci un numero maggiore di {{attribute:min}}",
        "label.errorAlert.maxNum": "Per favore inserisci un numero minore di {{attribute:max}}",
        "label.errorAlert.maxCharacters": "Numero massimo di caratteri raggiunto!",
        "label.submitBtn": "Invia",
      },
      welcome: {
        label: "Creiamo una breve storia",
        description:
          "Chiederemo un paio di impostazioni per creare una storia più adatta alle tue esigenze di apprendimento della lingua",
        action: "Iniziamo!",
      },
      language: {
        label: "In quale lingua vuoi che la tua storia sia generata",
        description: "Non preoccuparti, tradurremo anche in italiano per aiutarti durante l'apprendimento",
      },
      voice: {
        label: "Seleziona la voce che ti piacerebbe che il tuo audio leggesse",
        description: "Per dare un'occhiata, fai clic sul pulsante di riproduzione per l'anteprima",
      },
      customization: {
        label: "Vuoi aggiungere qualche personalizzazione alla tua storia?",
        description:
          "Come selezionare un tema, uno stile narrativo, utilizzare regole grammaticali specifiche o includere parole specifiche?",
      },
      theme: {
        label: "Va bene! Quale tema vorresti utilizzare per la tua storia?",
      },
      narrationStyle: {
        label: "E uno stile narrativo, vorresti usarne uno specifico?",
      },
      grammarOptions: {
        label: "Ci sono opzioni grammaticali specifiche che vuoi che vengano utilizzate nella storia?",
      },
      specificWords: {
        label: "Ci sono parole o una breve frase che ti piacerebbe includere nella tua storia?",
        description:
          "Questo è utile se c'è una parola o una frase con cui hai avuto difficoltà durante l'apprendimento di una nuova lingua",
      },
      end: {
        label: "Siamo a posto, creiamo la tua storia!",
      },
    },
  },
};
