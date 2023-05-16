"use client";

import React, { useState } from "react";
import { AudioPlayer } from "./components/AudioPlayer";
import { Story, StoryTextBlock } from "./storyTextBlock";
import { useGetStoryByIdQuery } from "@/graphql/types-and-hooks";

export interface StoryPageClientSideProps {
  storyId: string;
}

export const StoryPageClientSide: React.FC<StoryPageClientSideProps> = ({ storyId }) => {
  const [timElapsed, setTimeElapsed] = useState(0);
  const [storyServer, setStoryServer] = useState<Story>();

  useGetStoryByIdQuery({
    variables: {
      storyId: storyId,
    },
    onCompleted: (data) => {
      const audio = data.getStoryById?.assets.audio[0];

      //HACK: temp hack while internal interfaces are not replaced by GQL ones
      const s = {
        audio: audio?.url + "",
        text: data.getStoryById?.assets.text + "",
        translation: data.getStoryById?.assets.translation + "",
        marks:
          audio?.speechMarks.map((mark) => ({
            type: mark.type as "word" | "sentence",
            time: mark.time,
            start: mark.start - 20,
            end: mark.end - 20,
            value: mark.value,
          })) || [],
      };
      console.log(s);
      setStoryServer(s);
    },
  });

  return (
    <div className="">
      {!storyServer && <div>Loading...</div>}
      {storyServer && (
        <>
          <StoryTextBlock story={storyServer} timeElapsed={timElapsed} />
          <AudioPlayer audioSrc={storyServer.audio} timeUpdated={setTimeElapsed} />
        </>
      )}
    </div>
  );
};
