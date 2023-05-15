import {
  StoryStatusType,
  CreateStoryInput,
} from '@langapp/graphql'

export interface Story {

  storyId: string;

  creationMetadata: CreateStoryInput;

  generationRequestDate?: number;

  lastUpdate?: number;

  status?: StoryStatusType

}