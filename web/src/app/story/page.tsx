"use client";

import React, { useState } from "react";
import { AudioPlayer } from "./components/audio-player/AudioPlayer";
import { StoryTextBlock } from "./page-read";
import { GetStoryByIdDocument, GetStoryByIdQuery } from "@/graphql/types-and-hooks";
import { useMachine } from "@xstate/react";
import { pageMachine } from "./workflow/page-machine";
import { useApolloClient, ApolloQueryResult } from "@apollo/client";
import { Story, AudioSpeed } from "@/graphql/types-and-hooks";

export default function StoryPage() {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [audioSpeed, setAudioSpeed] = useState(AudioSpeed.Normal.toString());
  const storyId = "adec05b1-a6b3-455e-935a-bd62a6ba2b6d";

  const client = useApolloClient();

  const [machine] = useState(() => pageMachine.withContext({ storyId: storyId }));

  const [state, send] = useMachine(machine, {
    devTools: true,
    services: {
      fetch: async (context, event) => {
        return client
          .query({
            query: GetStoryByIdDocument,
            variables: {
              storyId: context.storyId,
            },
            fetchPolicy: "cache-first",
          })
          .then((result: ApolloQueryResult<GetStoryByIdQuery>): Story => {
            return result.data.getStoryById!;
          });
      },
    },
  });

  return (
    <div className="">
      {state.matches("pending") && (
        <div className="mt-40 grid grid-cols-1 place-items-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      )}
      {state.matches("successful") && (
        <>
          <StoryTextBlock story={state.context.story!} timeElapsed={timeElapsed} audioSpeedSelected={audioSpeed} />
          <AudioPlayer
            timeUpdated={setTimeElapsed}
            defaultAudioId={AudioSpeed.Normal}
            audioIdUpdated={setAudioSpeed}
            audioCollection={getAudioCollectionFromStory(state.context.story!)}
          />
        </>
      )}
      {state.matches("failure") && <>Error</>}
    </div>
  );
}

const getAudioCollectionFromStory = (story: Story) => {
  return story.assets.audio.reduce((acc, audio) => {
    acc[audio.speed.toString()] = {
      audioUrl: audio.url,
      description: audio.speed.toLowerCase(),
    };
    return acc;
  }, {} as Record<string, { audioUrl: string; description: string }>);
};
