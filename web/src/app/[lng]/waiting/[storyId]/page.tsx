"use client";
import { useMachine } from "@xstate/react";
import { rootMachine } from "./page-machine";
import { StoryStatusType, GetStoryStatusQuery, GetStoryStatusDocument } from "@/graphql/types-and-hooks";
import { useEffect, useState } from "react";
import { useApolloClient, ApolloQueryResult } from "@apollo/client";
import { redirect } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function Waiting(context: { params: { storyId: string } }) {
  const { t, i18n } = useTranslation();
  const [go, setGo] = useState(false);
  useEffect(() => {
    if (go) {
      console.log("completed");
      redirect(`/${i18n.language}/story/${context.params.storyId}`);
    }
  }, [go]);

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

  const sentences = [...Array(8)].map((_, index) => {
    return t(`story.waiting.loading${index}`);
  });

  return (
    <>
      {["too-many-retries", "timeout"].some(state.matches) && (
        <div className="w-full mt-3 text-center">
          <span>
            <p>{t("story.waiting.error")}</p>
            <p>
              <a href="#" onClick={() => send("RETRY")}>
                {t("story.waiting.retry")}
              </a>
            </p>
          </span>
        </div>
      )}
      {!["too-many-retries", "timeout"].some(state.matches) && (
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
      )}
    </>
  );
}