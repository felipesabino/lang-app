"use client";

import React, { useState } from "react";
import { AudioPlayer } from "./components/AudioPlayer";
import { Story, StoryTextBlock } from "./storyTextBlock";
import { GetStoryByIdDocument, GetStoryByIdQuery } from "@/graphql/types-and-hooks";
import { useMachine } from "@xstate/react";
import { rootMachine } from "./workflow/root-machine";
import { useApolloClient, ApolloQueryResult } from "@apollo/client";

export default function StoryPage() {
  const [timElapsed, setTimeElapsed] = useState(0);
  const storyId = "adec05b1-a6b3-455e-935a-bd62a6ba2b6d";
  console.log("AAAAAA");

  const client = useApolloClient();

  const [machine] = useState(() => rootMachine.withContext({ storyId: storyId, timeElapsed: 0 }));

  const [state, send] = useMachine(machine, {
    services: {
      "fetch-story": async (context, event) => {
        return client
          .query<GetStoryByIdQuery>({
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
      {state.matches("story-pending") && <div>Loading...</div>}
      {state.matches("story-data-ready") && (
        <>
          <StoryTextBlock story={state.context.story!} timeElapsed={timElapsed} />
          <AudioPlayer audioSrc={state.context.story!.audio} timeUpdated={setTimeElapsed} />
        </>
      )}
      {state.matches("story-failure") && <>Error</>}
    </div>
  );
}
