import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
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
  gramarOptions?: InputMaybe<Array<GrammarOptions>>;
  language: LanguageInput;
  narrationStyle: NarrationStyle;
  specificWords?: InputMaybe<Array<Scalars['String']>>;
  theme: StoryTheme;
  voice: Scalars['String'];
};

export type CreateStoryOutput = {
  __typename?: 'CreateStoryOutput';
  storyId: Scalars['ID'];
};

export enum GrammarOptions {
  FutureContinuous = 'FUTURE_CONTINUOUS',
  FutureTense = 'FUTURE_TENSE',
  PastContinuous = 'PAST_CONTINUOUS',
  PastTense = 'PAST_TENSE',
  PresentContinuous = 'PRESENT_CONTINUOUS',
  PresentTense = 'PRESENT_TENSE'
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

export enum NarrationStyle {
  FirstPerson = 'FIRST_PERSON',
  Letter = 'LETTER',
  NewYorker = 'NEW_YORKER',
  Random = 'RANDOM',
  ThirdPerson = 'THIRD_PERSON'
}

export type Query = {
  __typename?: 'Query';
  getSentenceExplanation?: Maybe<SentenceExplanation>;
  getStoryById?: Maybe<Story>;
  getStoryStatus?: Maybe<StoryStatus>;
};


export type QueryGetSentenceExplanationArgs = {
  input: SentenceExplanationInput;
};


export type QueryGetStoryByIdArgs = {
  storyId: Scalars['ID'];
};


export type QueryGetStoryStatusArgs = {
  storyId: Scalars['ID'];
};

export type SentenceExplanation = {
  __typename?: 'SentenceExplanation';
  explanation: Scalars['String'];
  sentence: Scalars['String'];
};

export type SentenceExplanationInput = {
  language: LanguageInput;
  sentence: Scalars['String'];
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
  speechMarks: Array<SpeechMark>;
  speed: AudioSpeed;
  url: Scalars['AWSURL'];
};

export type StoryCreationMetadata = StoryOptions & {
  __typename?: 'StoryCreationMetadata';
  gramarOptions?: Maybe<Array<GrammarOptions>>;
  language: LanguageOutput;
  narrationStyle: NarrationStyle;
  specificWords?: Maybe<Array<Scalars['String']>>;
  theme: StoryTheme;
  voice: Scalars['String'];
};

export type StoryOptions = {
  gramarOptions?: Maybe<Array<GrammarOptions>>;
  language: LanguageOutput;
  narrationStyle: NarrationStyle;
  specificWords?: Maybe<Array<Scalars['String']>>;
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
  SciFi = 'SCI_FI',
  YoungAdult = 'YOUNG_ADULT'
}

export enum SupportedLanguages {
  En = 'en',
  Fr = 'fr',
  It = 'it',
  Pt = 'pt'
}

export type GetStoryByIdQueryVariables = Exact<{
  storyId: Scalars['ID'];
}>;


export type GetStoryByIdQuery = { __typename?: 'Query', getStoryById?: { __typename?: 'Story', generationRequestDate: number, lastUpdate: number, status: StoryStatusType, storyId: string, assets: { __typename?: 'StoryAssets', text: string, translation: string, audio: Array<{ __typename?: 'StoryAudioAsset', speed: AudioSpeed, url: string, speechMarks: Array<{ __typename?: 'SpeechMark', end: number, start: number, time: number, type: string, value: string }> }> }, creationMetadata: { __typename?: 'StoryCreationMetadata', gramarOptions?: Array<GrammarOptions> | null, narrationStyle: NarrationStyle, specificWords?: Array<string> | null, theme: StoryTheme, voice: string, language: { __typename?: 'LanguageOutput', source: SupportedLanguages, target: SupportedLanguages } } } | null };

export type GetStoryStatusQueryVariables = Exact<{
  storyId: Scalars['ID'];
}>;


export type GetStoryStatusQuery = { __typename?: 'Query', getStoryStatus?: { __typename?: 'StoryStatus', status: StoryStatusType } | null };

export type GetSentenceExplanationQueryVariables = Exact<{
  input: SentenceExplanationInput;
}>;


export type GetSentenceExplanationQuery = { __typename?: 'Query', getSentenceExplanation?: { __typename?: 'SentenceExplanation', explanation: string } | null };

export type CreateStoryMutationVariables = Exact<{
  source: SupportedLanguages;
  target: SupportedLanguages;
  voice: Scalars['String'];
  narrationStyle?: InputMaybe<NarrationStyle>;
  theme?: InputMaybe<StoryTheme>;
  gramarOptions?: InputMaybe<Array<GrammarOptions> | GrammarOptions>;
  specificWords?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
}>;


export type CreateStoryMutation = { __typename?: 'Mutation', createStory: { __typename?: 'CreateStoryOutput', storyId: string } };


export const GetStoryByIdDocument = gql`
    query getStoryById($storyId: ID!) {
  getStoryById(storyId: $storyId) {
    assets {
      audio {
        speed
        url
        speechMarks {
          end
          start
          time
          type
          value
        }
      }
      text
      translation
    }
    creationMetadata {
      gramarOptions
      language {
        source
        target
      }
      narrationStyle
      specificWords
      theme
      voice
    }
    generationRequestDate
    lastUpdate
    status
    storyId
  }
}
    `;

/**
 * __useGetStoryByIdQuery__
 *
 * To run a query within a React component, call `useGetStoryByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStoryByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStoryByIdQuery({
 *   variables: {
 *      storyId: // value for 'storyId'
 *   },
 * });
 */
export function useGetStoryByIdQuery(baseOptions: Apollo.QueryHookOptions<GetStoryByIdQuery, GetStoryByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStoryByIdQuery, GetStoryByIdQueryVariables>(GetStoryByIdDocument, options);
      }
export function useGetStoryByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStoryByIdQuery, GetStoryByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStoryByIdQuery, GetStoryByIdQueryVariables>(GetStoryByIdDocument, options);
        }
export type GetStoryByIdQueryHookResult = ReturnType<typeof useGetStoryByIdQuery>;
export type GetStoryByIdLazyQueryHookResult = ReturnType<typeof useGetStoryByIdLazyQuery>;
export type GetStoryByIdQueryResult = Apollo.QueryResult<GetStoryByIdQuery, GetStoryByIdQueryVariables>;
export const GetStoryStatusDocument = gql`
    query getStoryStatus($storyId: ID!) {
  getStoryStatus(storyId: $storyId) {
    status
  }
}
    `;

/**
 * __useGetStoryStatusQuery__
 *
 * To run a query within a React component, call `useGetStoryStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStoryStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStoryStatusQuery({
 *   variables: {
 *      storyId: // value for 'storyId'
 *   },
 * });
 */
export function useGetStoryStatusQuery(baseOptions: Apollo.QueryHookOptions<GetStoryStatusQuery, GetStoryStatusQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStoryStatusQuery, GetStoryStatusQueryVariables>(GetStoryStatusDocument, options);
      }
export function useGetStoryStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStoryStatusQuery, GetStoryStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStoryStatusQuery, GetStoryStatusQueryVariables>(GetStoryStatusDocument, options);
        }
export type GetStoryStatusQueryHookResult = ReturnType<typeof useGetStoryStatusQuery>;
export type GetStoryStatusLazyQueryHookResult = ReturnType<typeof useGetStoryStatusLazyQuery>;
export type GetStoryStatusQueryResult = Apollo.QueryResult<GetStoryStatusQuery, GetStoryStatusQueryVariables>;
export const GetSentenceExplanationDocument = gql`
    query getSentenceExplanation($input: SentenceExplanationInput!) {
  getSentenceExplanation(input: $input) {
    explanation
  }
}
    `;

/**
 * __useGetSentenceExplanationQuery__
 *
 * To run a query within a React component, call `useGetSentenceExplanationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSentenceExplanationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSentenceExplanationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetSentenceExplanationQuery(baseOptions: Apollo.QueryHookOptions<GetSentenceExplanationQuery, GetSentenceExplanationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSentenceExplanationQuery, GetSentenceExplanationQueryVariables>(GetSentenceExplanationDocument, options);
      }
export function useGetSentenceExplanationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSentenceExplanationQuery, GetSentenceExplanationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSentenceExplanationQuery, GetSentenceExplanationQueryVariables>(GetSentenceExplanationDocument, options);
        }
export type GetSentenceExplanationQueryHookResult = ReturnType<typeof useGetSentenceExplanationQuery>;
export type GetSentenceExplanationLazyQueryHookResult = ReturnType<typeof useGetSentenceExplanationLazyQuery>;
export type GetSentenceExplanationQueryResult = Apollo.QueryResult<GetSentenceExplanationQuery, GetSentenceExplanationQueryVariables>;
export const CreateStoryDocument = gql`
    mutation createStory($source: SupportedLanguages!, $target: SupportedLanguages!, $voice: String!, $narrationStyle: NarrationStyle = RANDOM, $theme: StoryTheme = RANDOM, $gramarOptions: [GrammarOptions!], $specificWords: [String!]) {
  createStory(
    story: {gramarOptions: $gramarOptions, language: {source: $source, target: $target}, narrationStyle: $narrationStyle, specificWords: $specificWords, theme: $theme, voice: $voice}
  ) {
    storyId
  }
}
    `;
export type CreateStoryMutationFn = Apollo.MutationFunction<CreateStoryMutation, CreateStoryMutationVariables>;

/**
 * __useCreateStoryMutation__
 *
 * To run a mutation, you first call `useCreateStoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateStoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createStoryMutation, { data, loading, error }] = useCreateStoryMutation({
 *   variables: {
 *      source: // value for 'source'
 *      target: // value for 'target'
 *      voice: // value for 'voice'
 *      narrationStyle: // value for 'narrationStyle'
 *      theme: // value for 'theme'
 *      gramarOptions: // value for 'gramarOptions'
 *      specificWords: // value for 'specificWords'
 *   },
 * });
 */
export function useCreateStoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateStoryMutation, CreateStoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateStoryMutation, CreateStoryMutationVariables>(CreateStoryDocument, options);
      }
export type CreateStoryMutationHookResult = ReturnType<typeof useCreateStoryMutation>;
export type CreateStoryMutationResult = Apollo.MutationResult<CreateStoryMutation>;
export type CreateStoryMutationOptions = Apollo.BaseMutationOptions<CreateStoryMutation, CreateStoryMutationVariables>;
export type CreateStoryOutputKeySpecifier = ('storyId' | CreateStoryOutputKeySpecifier)[];
export type CreateStoryOutputFieldPolicy = {
	storyId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LanguageOutputKeySpecifier = ('source' | 'target' | LanguageOutputKeySpecifier)[];
export type LanguageOutputFieldPolicy = {
	source?: FieldPolicy<any> | FieldReadFunction<any>,
	target?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('createStory' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	createStory?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('getSentenceExplanation' | 'getStoryById' | 'getStoryStatus' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	getSentenceExplanation?: FieldPolicy<any> | FieldReadFunction<any>,
	getStoryById?: FieldPolicy<any> | FieldReadFunction<any>,
	getStoryStatus?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SentenceExplanationKeySpecifier = ('explanation' | 'sentence' | SentenceExplanationKeySpecifier)[];
export type SentenceExplanationFieldPolicy = {
	explanation?: FieldPolicy<any> | FieldReadFunction<any>,
	sentence?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SpeechMarkKeySpecifier = ('end' | 'start' | 'time' | 'type' | 'value' | SpeechMarkKeySpecifier)[];
export type SpeechMarkFieldPolicy = {
	end?: FieldPolicy<any> | FieldReadFunction<any>,
	start?: FieldPolicy<any> | FieldReadFunction<any>,
	time?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StoryKeySpecifier = ('assets' | 'creationMetadata' | 'generationRequestDate' | 'lastUpdate' | 'status' | 'storyId' | StoryKeySpecifier)[];
export type StoryFieldPolicy = {
	assets?: FieldPolicy<any> | FieldReadFunction<any>,
	creationMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	generationRequestDate?: FieldPolicy<any> | FieldReadFunction<any>,
	lastUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	storyId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StoryAssetsKeySpecifier = ('audio' | 'text' | 'translation' | StoryAssetsKeySpecifier)[];
export type StoryAssetsFieldPolicy = {
	audio?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StoryAudioAssetKeySpecifier = ('speechMarks' | 'speed' | 'url' | StoryAudioAssetKeySpecifier)[];
export type StoryAudioAssetFieldPolicy = {
	speechMarks?: FieldPolicy<any> | FieldReadFunction<any>,
	speed?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StoryCreationMetadataKeySpecifier = ('gramarOptions' | 'language' | 'narrationStyle' | 'specificWords' | 'theme' | 'voice' | StoryCreationMetadataKeySpecifier)[];
export type StoryCreationMetadataFieldPolicy = {
	gramarOptions?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	narrationStyle?: FieldPolicy<any> | FieldReadFunction<any>,
	specificWords?: FieldPolicy<any> | FieldReadFunction<any>,
	theme?: FieldPolicy<any> | FieldReadFunction<any>,
	voice?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StoryOptionsKeySpecifier = ('gramarOptions' | 'language' | 'narrationStyle' | 'specificWords' | 'theme' | StoryOptionsKeySpecifier)[];
export type StoryOptionsFieldPolicy = {
	gramarOptions?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	narrationStyle?: FieldPolicy<any> | FieldReadFunction<any>,
	specificWords?: FieldPolicy<any> | FieldReadFunction<any>,
	theme?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StoryStatusKeySpecifier = ('generationRequestDate' | 'lastUpdate' | 'status' | 'storyId' | StoryStatusKeySpecifier)[];
export type StoryStatusFieldPolicy = {
	generationRequestDate?: FieldPolicy<any> | FieldReadFunction<any>,
	lastUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	storyId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	CreateStoryOutput?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CreateStoryOutputKeySpecifier | (() => undefined | CreateStoryOutputKeySpecifier),
		fields?: CreateStoryOutputFieldPolicy,
	},
	LanguageOutput?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LanguageOutputKeySpecifier | (() => undefined | LanguageOutputKeySpecifier),
		fields?: LanguageOutputFieldPolicy,
	},
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	SentenceExplanation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SentenceExplanationKeySpecifier | (() => undefined | SentenceExplanationKeySpecifier),
		fields?: SentenceExplanationFieldPolicy,
	},
	SpeechMark?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SpeechMarkKeySpecifier | (() => undefined | SpeechMarkKeySpecifier),
		fields?: SpeechMarkFieldPolicy,
	},
	Story?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StoryKeySpecifier | (() => undefined | StoryKeySpecifier),
		fields?: StoryFieldPolicy,
	},
	StoryAssets?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StoryAssetsKeySpecifier | (() => undefined | StoryAssetsKeySpecifier),
		fields?: StoryAssetsFieldPolicy,
	},
	StoryAudioAsset?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StoryAudioAssetKeySpecifier | (() => undefined | StoryAudioAssetKeySpecifier),
		fields?: StoryAudioAssetFieldPolicy,
	},
	StoryCreationMetadata?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StoryCreationMetadataKeySpecifier | (() => undefined | StoryCreationMetadataKeySpecifier),
		fields?: StoryCreationMetadataFieldPolicy,
	},
	StoryOptions?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StoryOptionsKeySpecifier | (() => undefined | StoryOptionsKeySpecifier),
		fields?: StoryOptionsFieldPolicy,
	},
	StoryStatus?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StoryStatusKeySpecifier | (() => undefined | StoryStatusKeySpecifier),
		fields?: StoryStatusFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;