import {
  StoryStatusType,
  CreateStoryInput,
} from './graphql-schema'

export interface Story {

  storyId: string;

  creationMetadata: CreateStoryInput;

  generationRequestDate?: number;

  lastUpdate?: number;

  status?: StoryStatusType

}