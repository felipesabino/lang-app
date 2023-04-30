"use client"

import React, { useState } from "react";
import { AudioPlayer } from "../components/AudioPlayer";
import { Story, StoryTextBlock, StoryTextBlockProps } from "./storyTextBlock";

export interface StoryPageClientSideProps {
  story: Story;
}

export const StoryPageClientSide: React.FC<StoryPageClientSideProps> = (({ story }) => {

  const [timElapsed, setTimeElapsed] = useState(0);

  return (
    <div className="">
      <StoryTextBlock story={story} timeElapsed={timElapsed} />
      <AudioPlayer audioSrc={story.audio} timeUpdated={setTimeElapsed} />
    </div>
  );
});
