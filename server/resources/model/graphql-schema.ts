export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSDate: string;
  AWSDateTime: string;
  AWSEmail: string;
  AWSIPAddress: string;
  AWSJSON: string;
  AWSPhone: string;
  AWSTime: string;
  AWSTimestamp: number;
  AWSURL: string;
};

export enum AudioSpeed {
  Normal = 'NORMAL',
  Slow = 'SLOW'
}

export type CreateStoryInput = {
  gramarOptions: Array<GrammarOptions>;
  language: LanguageInput;
  narrationStyle: NarrativeStyle;
  specificWords: Array<Scalars['String']>;
  theme: StoryTheme;
};

export type CreateStoryOutput = {
  __typename?: 'CreateStoryOutput';
  storyId: Scalars['ID'];
};

export enum GrammarOptions {
  Futurecontinuous = 'FUTURECONTINUOUS',
  Futuretense = 'FUTURETENSE',
  Pastcontinuous = 'PASTCONTINUOUS',
  Pasttense = 'PASTTENSE',
  Presentcontinuous = 'PRESENTCONTINUOUS',
  Presenttense = 'PRESENTTENSE'
}

export type LanguageInput = {
  source: SupportedLanguages;
  target: SupportedLanguages;
};

export type LanguageOutput = {
  __typename?: 'LanguageOutput';
  source: SupportedLanguages;
  target: SupportedLanguages;
};

export type Mutation = {
  __typename?: 'Mutation';
  createStory: CreateStoryOutput;
};


export type MutationCreateStoryArgs = {
  story: CreateStoryInput;
};

export enum NarrativeStyle {
  Firstperson = 'FIRSTPERSON',
  Letter = 'LETTER',
  Newyorker = 'NEWYORKER',
  Random = 'RANDOM',
  Thirdperson = 'THIRDPERSON'
}

export type Query = {
  __typename?: 'Query';
  getStoryById?: Maybe<Story>;
  getStoryStatus?: Maybe<StoryStatus>;
};


export type QueryGetStoryByIdArgs = {
  storyId: Scalars['ID'];
};


export type QueryGetStoryStatusArgs = {
  storyId: Scalars['ID'];
};

export type SpeechMark = {
  __typename?: 'SpeechMark';
  end: Scalars['Int'];
  start: Scalars['Int'];
  time: Scalars['Int'];
  type: Scalars['String'];
  value: Scalars['String'];
};

export type Story = {
  __typename?: 'Story';
  assets: StoryAssets;
  creationMetadata: StoryCreationMetadata;
  generationRequestDate: Scalars['AWSTimestamp'];
  lastUpdate: Scalars['AWSTimestamp'];
  status: StoryStatusType;
  storyId: Scalars['ID'];
};

export type StoryAssets = {
  __typename?: 'StoryAssets';
  audio: Array<StoryAudioAsset>;
  text: Scalars['String'];
  translation: Scalars['String'];
};

export type StoryAudioAsset = {
  __typename?: 'StoryAudioAsset';
  speechMarks: SpeechMark;
  speed: AudioSpeed;
  url: Scalars['AWSURL'];
};

export type StoryCreationMetadata = StoryOptions & {
  __typename?: 'StoryCreationMetadata';
  gramarOptions: Array<GrammarOptions>;
  language: LanguageOutput;
  narrationStyle: NarrativeStyle;
  specificWords: Array<Scalars['String']>;
  theme: StoryTheme;
};

export type StoryOptions = {
  gramarOptions: Array<GrammarOptions>;
  language: LanguageOutput;
  narrationStyle: NarrativeStyle;
  specificWords: Array<Scalars['String']>;
  theme: StoryTheme;
};

export type StoryStatus = {
  __typename?: 'StoryStatus';
  generationRequestDate: Scalars['AWSTimestamp'];
  lastUpdate: Scalars['AWSTimestamp'];
  status: StoryStatusType;
  storyId: Scalars['ID'];
};

export enum StoryStatusType {
  Completed = 'COMPLETED',
  Generating = 'GENERATING'
}

export enum StoryTheme {
  Adventure = 'ADVENTURE',
  Children = 'CHILDREN',
  Drama = 'DRAMA',
  Fantasy = 'FANTASY',
  Random = 'RANDOM',
  Romance = 'ROMANCE',
  Scifi = 'SCIFI',
  Youngadult = 'YOUNGADULT'
}

export enum SupportedLanguages {
  En = 'en',
  Fr = 'fr',
  It = 'it',
  Pt = 'pt'
}
