import { SupportedLanguages, NarrationStyle, GrammarOptions, AudioSpeed, StoryTheme } from "@/graphql/types-and-hooks";
import { en } from "./en";

export const es: typeof en = {
  common: {
    yes: "Sí",
    no: "No",
    languages: Object.fromEntries(
      new Map([
        [SupportedLanguages.En, "Inglés"],
        [SupportedLanguages.Fr, "Francés"],
        [SupportedLanguages.It, "Italiano"],
        [SupportedLanguages.Pt, "Portugués"],
      ])
    ),
    themes: Object.fromEntries(
      new Map([
        [StoryTheme.Random, "Aleatorio"],
        [StoryTheme.Adventure, "Aventura"],
        [StoryTheme.Romance, "Romance"],
        [StoryTheme.Fantasy, "Fantasía"],
        [StoryTheme.SciFi, "Ciencia Ficción"],
        [StoryTheme.Drama, "Drama"],
        [StoryTheme.YoungAdult, "Joven Adulto"],
        [StoryTheme.Children, "Niños"],
      ])
    ),
    narrationStyles: Object.fromEntries(
      new Map([
        [NarrationStyle.FirstPerson, "Primera Persona"],
        [NarrationStyle.Letter, "Carta"],
        [NarrationStyle.NewYorker, "Estilo New Yorker"],
        [NarrationStyle.Random, "Aleatorio"],
        [NarrationStyle.ThirdPerson, "Tercera Persona"],
      ])
    ),
    grammarOptions: Object.fromEntries(
      new Map([
        [GrammarOptions.PastTense, "Pasado"],
        [GrammarOptions.PresentTense, "Presente"],
        [GrammarOptions.FutureTense, "Futuro"],
        [GrammarOptions.PastContinuous, "Pasado Continuo"],
        [GrammarOptions.PresentContinuous, "Presente Continuo"],
        [GrammarOptions.FutureContinuous, "Futuro Continuo"],
      ])
    ),
    audioSpeeds: Object.fromEntries(
      new Map([
        [AudioSpeed.Slow, "Lento"],
        [AudioSpeed.Normal, "Normal"],
      ])
    ),
  },
  app: {
    name: "Lang App",
  },
  home: {
    loading: "Cargando tus historias...",
  },
  header: {
    home: "Inicio",
    newStory: "Nueva Historia",
  },
  story: {
    waiting: {
      loading0: "Dame solo unos segundos más",
      loading1: "La IA está pensando en tu historia",
      loading2: "Contratando un escritor virtual",
      loading3: "Demasiado caro, rescindiendo el contrato",
      loading4: "La IA decidió escribirlo por sí misma",
      loading5: "Buscando un diccionario para traducir el texto",
      loading6: "Leyendo en voz alta para grabar el audio",
      loading7: "Dame solo unos segundos más",
      error: "Hubo un error al buscar tu historia.",
      retry: "Reintentar",
    },
    reading: {
      loading: "Cargando...",
      error: "Algo salió mal",
      translation: "Traducción",
      header: {
        generationDate: "Historia generada el",
        theme: "Tema",
        narrationStyle: "Estilo de narración",
        language: "Idioma",
        translatedTo: "Traducido al",
        readingVoice: "Voz de lectura",
        grammarOptions: "Opciones de gramática",
        specificWords: "Palabras específicas",
        readingSpeed: "Velocidad de lectura",
      },
      moreInfo: {
        dismiss: "Descartar este texto",
        selectedText: "Texto seleccionado:",
        loading: "Construyendo la explicación...",
        error: "Error cargando la explicación",
        retry: "Reintentar",
      },
    },
    audioPlayer: {
      speed: "Velocidad",
      changeTo: "Cambiar a",
    },
    new: {
      error: "Error al crear tu historia, por favor intenta de nuevo.",
      form: {
        "label.button.ok": "Ok",
        "label.hintText.enter": "pulsa <strong>Enter ↵</strong>",
        "label.hintText.multipleSelection": "Elige todas las que quieras",
        "block.dropdown.placeholder": "Escribe o selecciona una opción",
        "block.dropdown.noSuggestions": "¡No hay sugerencias!",
        "block.shortText.placeholder": "Escribe tu respuesta aquí",
        "block.longText.placeholder": "Escribe tu respuesta aquí",
        "block.longText.hint": "<strong>Shift ⇧ + Enter ↵</strong> para hacer un salto de línea",
        "block.number.placeholder": "Escribe tu respuesta aquí",
        "block.email.placeholder": "Escribe tu correo electrónico aquí",
        "block.defaultThankYouScreen.label": "¡Por favor espera mientras generamos tu historia!",
        "label.hintText.key": "Clave",
        "label.progress.percent": "{{progress:percent}}% completado",
        "label.errorAlert.required": "¡Este campo es obligatorio!",
        "label.errorAlert.date": "¡Fecha inválida!",
        "label.errorAlert.number": "¡Solo números!",
        "label.errorAlert.selectionRequired": "¡Por favor haz al menos una selección!",
        "label.errorAlert.email": "¡Correo electrónico inválido!",
        "label.errorAlert.url": "¡URL inválida!",
        "label.errorAlert.range": "Por favor ingresa un número entre {{attribute:min}} y {{attribute:max}}",
        "label.errorAlert.minNum": "Por favor ingresa un número mayor que {{attribute:min}}",
        "label.errorAlert.maxNum": "Por favor ingresa un número menor que {{attribute:max}}",
        "label.errorAlert.maxCharacters": "¡Se ha alcanzado el máximo de caracteres!",
        "label.submitBtn": "Enviar",
      },
      welcome: {
        label: "Vamos a crear una historia corta",
        description:
          "Te haremos un par de preguntas para crear una historia más adecuada para tus necesidades de aprendizaje de idiomas",
        action: "¡Empecemos!",
      },
      language: {
        label: "¿En qué idioma quieres que se genere tu historia?",
        description: "No te preocupes, también la traduciremos al español para ayudarte a aprender",
      },
      voice: {
        label: "Selecciona la voz que te gustaría para la lectura del audio",
        description: "Para tener una idea, haz clic en el botón de reproducción para previsualizar",
      },
      customization: {
        label: "¿Quieres añadir alguna personalización a tu historia?",
        description:
          "¿Como seleccionar un tema, un estilo narrativo, usar reglas gramaticales específicas o incluir palabras específicas?",
      },
      theme: {
        label: "¡Perfecto! ¿Qué tema te gustaría usar para tu historia?",
      },
      narrationStyle: {
        label: "¿Y sobre el estilo narrativo, te gustaría usar uno específico?",
      },
      grammarOptions: {
        label: "¿Hay opciones gramaticales específicas que quieras usar en la historia?",
      },
      specificWords: {
        label: "¿Hay alguna palabra o frase corta que te gustaría que se incluya en tu historia?",
        description:
          "Esto es útil si hay una palabra o frase con la que has estado luchando mientras aprendes un nuevo idioma",
      },
      end: {
        label: "Tenemos todo listo, ¡vamos a crear tu historia!",
      },
    },
  },
};
