import { SupportedLanguages, NarrationStyle, GrammarOptions, AudioSpeed, StoryTheme } from "@/graphql/types-and-hooks";
import { en } from "./en";

export const pt: typeof en = {
  common: {
    yes: "Sim",
    no: "Não",
    languages: Object.fromEntries(
      new Map([
        [SupportedLanguages.En, "Inglês"],
        [SupportedLanguages.Fr, "Francês"],
        [SupportedLanguages.It, "Italiano"],
        [SupportedLanguages.Pt, "Português"],
      ])
    ),
    themes: Object.fromEntries(
      new Map([
        [StoryTheme.Random, "Aleatório"],
        [StoryTheme.Adventure, "Aventura"],
        [StoryTheme.Romance, "Romance"],
        [StoryTheme.Fantasy, "Fantasia"],
        [StoryTheme.SciFi, "Ficção científica"],
        [StoryTheme.Drama, "Drama"],
        [StoryTheme.YoungAdult, "Jovem adulto"],
        [StoryTheme.Children, "Infantil"],
      ])
    ),
    narrationStyles: Object.fromEntries(
      new Map([
        [NarrationStyle.FirstPerson, "Primeira pessoa"],
        [NarrationStyle.Letter, "Carta"],
        [NarrationStyle.NewYorker, "Estilo New Yorker"],
        [NarrationStyle.Random, "Aleatório"],
        [NarrationStyle.ThirdPerson, "Terceira pessoa"],
      ])
    ),
    grammarOptions: Object.fromEntries(
      new Map([
        [GrammarOptions.PastTense, "Passado"],
        [GrammarOptions.PresentTense, "Presente"],
        [GrammarOptions.FutureTense, "Futuro"],
        [GrammarOptions.PastContinuous, "Passado contínuo"],
        [GrammarOptions.PresentContinuous, "Presente contínuo"],
        [GrammarOptions.FutureContinuous, "Futuro contínuo"],
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
    name: "App de Idiomas",
  },
  home: {
    loading: "Carregando suas histórias...",
  },
  header: {
    home: "Início",
    newStory: "Nova história",
  },
  story: {
    waiting: {
      loading0: "Me dê apenas mais alguns segundos",
      loading1: "IA está pensando na sua história",
      loading2: "Contratando um escritor virtual",
      loading3: "Muito caro, rescindindo contrato",
      loading4: "IA decidiu escrever por conta própria",
      loading5: "Procurando um dicionário para traduzir o texto",
      loading6: "Lendo em voz alta para gravar áudio",
      loading7: "Me dê apenas mais alguns segundos",
      error: "Houve um erro ao buscar sua história.",
      retry: "Tentar novamente",
    },
    reading: {
      loading: "Carregando...",
      error: "Algo deu errado",
      translation: "Tradução",
      header: {
        generationDate: "História gerada em",
        theme: "Tema",
        narrationStyle: "Estilo de narração",
        language: "Idioma",
        translatedTo: "Traduzido para",
        readingVoice: "Voz de leitura",
        grammarOptions: "Opções de gramática",
        specificWords: "Palavras específicas",
        readingSpeed: "Velocidade de leitura",
      },
      moreInfo: {
        dismiss: "Descartar este texto",
        selectedText: "Texto selecionado:",
        loading: "Construindo explicação...",
        error: "Erro ao carregar a explicação",
        retry: "Tentar novamente",
      },
    },
    audioPlayer: {
      speed: "Velocidade",
      changeTo: "Mudar para",
    },
    new: {
      error: "Erro ao criar sua história, por favor tente novamente.",
      form: {
        "label.button.ok": "Ok",
        "label.hintText.enter": "pressione <strong>Enter ↵</strong>",
        "label.hintText.multipleSelection": "Escolha quantas quiser",
        "block.dropdown.placeholder": "Digite ou selecione uma opção",
        "block.dropdown.noSuggestions": "Sem sugestões!",
        "block.shortText.placeholder": "Digite sua resposta aqui",
        "block.longText.placeholder": "Digite sua resposta aqui",
        "block.longText.hint": "<strong>Shift ⇧ + Enter ↵</strong> para fazer uma quebra de linha",
        "block.number.placeholder": "Digite sua resposta aqui",
        "block.email.placeholder": "Digite seu email aqui",
        "block.defaultThankYouScreen.label": "Por favor, aguarde enquanto geramos sua história!",
        "label.hintText.key": "Chave",
        "label.progress.percent": "{{progress:percent}}% concluído",
        "label.errorAlert.required": "Este campo é obrigatório!",
        "label.errorAlert.date": "Data inválida!",
        "label.errorAlert.number": "Apenas números!",
        "label.errorAlert.selectionRequired": "Por favor, faça pelo menos uma seleção!",
        "label.errorAlert.email": "Email inválido!",
        "label.errorAlert.url": "URL inválida!",
        "label.errorAlert.range": "Por favor, insira um número entre {{attribute:min}} e {{attribute:max}}",
        "label.errorAlert.minNum": "Por favor, insira um número maior que {{attribute:min}}",
        "label.errorAlert.maxNum": "Por favor, insira um número menor que {{attribute:max}}",
        "label.errorAlert.maxCharacters": "Número máximo de caracteres atingido!",
        "label.submitBtn": "Enviar",
      },
      welcome: {
        label: "Vamos criar uma história curta",
        description:
          "Faremos algumas configurações para criar uma história mais adequada para suas necessidades de aprendizado de idiomas",
        action: "Vamos começar!",
      },
      language: {
        label: "Em que idioma você quer que sua história seja gerada",
        description:
          "Não se preocupe, também traduziremos de volta para o português para ajudá-lo durante o aprendizado",
      },
      voice: {
        label: "Selecione a voz que você gostaria que seu áudio fosse lido",
        description: "Para ter uma ideia, clique no botão play para ouvir uma prévia",
      },
      customization: {
        label: "Você quer adicionar alguma personalização à sua história?",
        description:
          "Como selecionar um tema, um estilo narrativo, usar regras gramaticais específicas ou incluir palavras específicas?",
      },
      theme: {
        label: "Tudo bem! Qual tema você gostaria de usar para sua história?",
      },
      narrationStyle: {
        label: "E quanto a um estilo narrativo, você gostaria de usar um específico?",
      },
      grammarOptions: {
        label: "Há opções gramaticais específicas que você quer que sejam usadas na história?",
      },
      specificWords: {
        label: "Há alguma palavra ou frase curta que você gostaria de incluir na sua história?",
        description:
          "Isso é útil se houver uma palavra ou frase com a qual você tenha dificuldade enquanto aprende um novo idioma",
      },
      end: {
        label: "Estamos prontos, vamos criar sua história!",
      },
    },
  },
};
