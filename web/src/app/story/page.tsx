"use client";

import React, { useState } from "react";
import { AudioPlayer } from "./components/audio-player/AudioPlayer";
import { Story, StoryTextBlock } from "./page-read";
import { GetStoryByIdDocument, GetStoryByIdQuery } from "@/graphql/types-and-hooks";
import { useMachine } from "@xstate/react";
import { pageMachine } from "./workflow/page-machine";
import { useApolloClient, ApolloQueryResult } from "@apollo/client";

export default function StoryPage() {
  const [timElapsed, setTimeElapsed] = useState(0);
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
          .then((result: ApolloQueryResult<GetStoryByIdQuery>): GetStoryByIdQuery => {
            return result.data;
          })
          .then((data: GetStoryByIdQuery): Story => {
            const audio = data.getStoryById?.assets.audio[0];

            //HACK: temp hack while internal interfaces are not replaced by GQL ones
            const story = {
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
            return story;
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
          <StoryTextBlock story={state.context.story!} timeElapsed={timElapsed} />
          <AudioPlayer audioSrc={state.context.story!.audio} timeUpdated={setTimeElapsed} />
        </>
      )}
      {state.matches("failure") && <>Error</>}
    </div>
  );
}
