import 'reflect-metadata';

import {
  StoryStatusType,
  CreateStoryInput,
} from './graphql-schema'

import {
  attribute,
  hashKey,
  table
} from '@nova-odm/annotations';

@table('Story')
export class Story {

  public constructor(partial?: Partial<Story>) {
    Object.assign(this, partial)
  }

  @hashKey()
  storyId: string;

  @attribute({type: 'Hash'})
  creationMetadata: CreateStoryInput;

  @attribute({defaultProvider: () => +new Date()})
  generationRequestDate?: number;

  @attribute({defaultProvider: () => +new Date()})
  lastUpdate?: number;

  @attribute({defaultProvider: () => StoryStatusType.Generating, type: 'String'})
  status?: StoryStatusType

}