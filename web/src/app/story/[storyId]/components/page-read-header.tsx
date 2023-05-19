import { capitalCase, sentenceCase } from "change-case";
import { AudioSpeed, Story } from "@/graphql/types-and-hooks";

export interface StoryTextBlockHeaderProps {
  story: Story;
  audioSpeedSelected: AudioSpeed | string;
}

export function StoryTextBlockHeader(props: StoryTextBlockHeaderProps) {
  const { story } = props;

  return (
    <div className="text-sm mb-4 grid grid-cols-2 max-sm:grid-cols-1">
      <div className="col-span-2 max-sm:col-span-1">
        <span className="font-bold">Story Generated on: </span>
        {story.generationRequestDate}
      </div>
      <div>
        <span className="font-bold">Theme: </span>
        {capitalCase(story.creationMetadata.theme)}
      </div>
      <div>
        <span className="font-bold">Narration Style: </span>
        {sentenceCase(story.creationMetadata.narrationStyle)}
      </div>
      <div>
        <span className="font-bold">Language: </span>
        {capitalCase(story.creationMetadata.language.target)}
      </div>
      <div>
        <span className="font-bold">Translated to: </span>
        {capitalCase(story.creationMetadata.language.source)}
      </div>
      <div>
        <span className="font-bold">Reading Voice: </span>
        {capitalCase(story.creationMetadata.voice)}
      </div>
      {story.creationMetadata.gramarOptions && story.creationMetadata.gramarOptions.length > 0 && (
        <div>
          <span className="font-bold">Grammar Options: </span>
          {story.creationMetadata.gramarOptions?.map((item) => sentenceCase(item)).join(", ")}
        </div>
      )}
      {story.creationMetadata.specificWords && story.creationMetadata.specificWords.length > 0 && (
        <div className="col-span-2 max-sm:col-span-1">
          <span className="font-bold">Specific Words: </span>
          {story.creationMetadata.specificWords?.map((item) => `"${sentenceCase(item)}"`).join(", ")}
        </div>
      )}
      <div className="col-span-2 max-sm:col-span-1">
        <span className="font-bold">Reading Speed: </span>
        {sentenceCase(props.audioSpeedSelected || "")}
      </div>
    </div>
  );
}
