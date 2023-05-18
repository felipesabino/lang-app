"use client";
import { useMachine } from "@xstate/react";
import { rootMachine } from "./page-machine";
import { StoryStatusType, GetStoryStatusQuery, GetStoryStatusDocument } from "@/graphql/types-and-hooks";
import { useEffect, useState } from "react";
import { useApolloClient, ApolloQueryResult } from "@apollo/client";
import { redirect } from "next/navigation";

export default function Waiting(context: { params: { storyId: string } }) {
  const [go, setGo] = useState(false);
  useEffect(() => {
    if (go) {
      console.log("completed");
      redirect(`/story/${context.params.storyId}`);
    }
  });

  const client = useApolloClient();

  const storyId = context.params.storyId;

  const [machine] = useState(() =>
    rootMachine.withContext({
      storyId,
      lastStatus: StoryStatusType.Generating,
      timeOutInMs: 30 * 1000,
      timestamp: +new Date(),
    })
  );

  const [state, send] = useMachine(machine, {
    devTools: true,
    actions: {
      completed: (context, event) => {
        setGo(true);
      },
    },
    services: {
      fetch: (context, event) => {
        console.log("fetching");
        return client
          .query<GetStoryStatusQuery>({
            query: GetStoryStatusDocument,
            variables: {
              storyId,
            },
            fetchPolicy: "network-only",
          })
          .then(async (result: ApolloQueryResult<GetStoryStatusQuery>): Promise<{ lastStatus: StoryStatusType }> => {
            return {
              lastStatus: result.data.getStoryStatus!.status,
            };
          });
      },
    },
  });

  const sentences = [
    "Give me just a few more seconds",
    "Ai is thinking about your story",
    "Hiring an virtual writer",
    "Too expensive, rescinding contract",
    "AI decided to write it by themselves",
    "Finding a dictionary to translate text",
    "Reading out loud to record audio",
    "Give me just a few more seconds",
  ];

  return (
    <>
      {["too-many-retrie/s", "timeout"].some(state.matches) && (
        <div className="w-full mt-3 text-center">
          <span>
            There was an error fetching your story, please{" "}
            <a href="#" onClick={() => send("RETRY")}>
              try again
            </a>
          </span>
        </div>
      )}
      <div className="grid h-screen place-items-center">
        <div
          className="flex items-center text-3xl font-semibold"
          style={{
            maskImage:
              "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 20%, rgba(255,255,255,1) 80%, rgba(255,255,255,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 20%, rgba(255,255,255,1) 80%, rgba(255,255,255,0) 100%)",
          }}
        >
          <div className="h-12 m-auto overflow-hidden">
            <ul className="p-0 mx-0 my-y2.5 animate-waiting-room">
              {sentences.map((sentence, index) => (
                <li className="flex items-center h-12 list-none text-gray-300" key={`sentence-${index}`}>
                  {sentence}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
