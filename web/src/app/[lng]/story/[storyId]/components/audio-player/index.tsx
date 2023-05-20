"use client";

import React, { useState, forwardRef } from "react";
import { useMachine } from "@xstate/react";
import { audioPlayerMachine } from "./audio-player-machine";
import { useTranslation } from "react-i18next";

interface AudioPlayerProps {
  audioCollection: Record<string, { audioUrl: string; description: string }>;
  defaultAudioId: string;
  timeUpdated?: React.Dispatch<React.SetStateAction<number>>;
  audioIdUpdated?: React.Dispatch<React.SetStateAction<string>>;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = forwardRef(
  ({ audioCollection, defaultAudioId, timeUpdated, audioIdUpdated }, ref) => {
    const { t, i18n } = useTranslation();

    const [machine] = useState(() =>
      audioPlayerMachine.withContext({
        audioId: defaultAudioId,
        audioUrl: audioCollection[defaultAudioId].audioUrl,
        description: audioCollection[defaultAudioId].description,
        timeElapsedInMs: 0,
        audioDurationInMs: 0,
        progressInPercent: 0,
      })
    );

    const bindEventsToAudioObject = (audioObject: HTMLAudioElement): Promise<{ durationInMs: number }> => {
      audioObject.ontimeupdate = () => {
        const timeElapsedInMs = Math.floor(audioObject.currentTime * 1000);
        send({ type: "TIME_ELAPSED", data: { timeElapsedInMs } });
        timeUpdated && timeUpdated(timeElapsedInMs);
      };
      return new Promise((resolve) => {
        audioObject.onloadedmetadata = () => {
          resolve({ durationInMs: audioObject.duration * 1000 });
        };
      });

      // audioObject.oncanplaythrough = () => {
      // });
    };

    const [state, send] = useMachine(machine, {
      devTools: true,
      services: {
        load: async (context, _) => {
          if (context.audioObject) {
            context.audioObject.pause();
            context.audioObject.currentTime = 0;
            context.audioObject = undefined;
          }

          const { audioUrl, description } = audioCollection[context.audioId];

          const audioObj = new Audio(audioUrl);
          const metadata = await bindEventsToAudioObject(audioObj);

          audioIdUpdated && audioIdUpdated(context.audioId);

          return {
            audioObject: audioObj,
            audioId: context.audioId,
            audioUrl,
            description,
            audioDurationInMs: metadata.durationInMs,
          };
        },
        play: async (context, _) => {
          if (context.audioObject) {
            context.audioObject.play();
          }
        },
        pause: async (context, _) => {
          if (context.audioObject) {
            context.audioObject.pause();
          }
        },
      },
      actions: {
        forward: (context, _) => {
          if (context.audioObject) {
            context.audioObject.currentTime = Math.min(
              context.audioObject.currentTime + 10,
              context.audioObject.duration
            );
          }
        },
        backward: (context, _) => {
          if (context.audioObject) {
            context.audioObject.currentTime = Math.max(context.audioObject.currentTime - 10, 0);
          }
        },
      },
    });

    return (
      <div className="fixed bottom-0 h-16 grid place-items-center w-full bg-gray-800 border-t-2 border-gray-300">
        <ul className="list-none w-max max-w-md flex items-center justify-stretch gap-8">
          <li>
            <button onClick={() => send("BACKWARD")}>
              <img src="/icons/audio-player/backward.svg" className="h-6 w-6 cursor-pointer" />
            </button>
          </li>
          {!state.matches("playable.playing") && (
            <li>
              <button onClick={() => send("PLAY")}>
                <img src="/icons/audio-player/play.svg" className="h-6 w-6 cursor-pointer" />
              </button>
            </li>
          )}
          {state.matches("playable.playing") && (
            <li>
              <button onClick={() => send("PAUSE")}>
                <img src="/icons/audio-player/pause.svg" className="h-6 w-6 cursor-pointer" />
              </button>
            </li>
          )}
          <li>
            <button onClick={() => send("FORWARD")}>
              <img src="/icons/audio-player/forward.svg" className="h-6 w-6 cursor-pointer" />
            </button>
          </li>

          <span className="text-gray-300">
            {t("story.audioPlayer.speed")} {t(`common.audioSpeeds.${state.context.audioId}`)}
            <br />
            {Object.keys(audioCollection)
              .filter((id) => id !== state.context.audioId) // exclude the current audio (it will be shown as a link
              .map((audioId) => (
                <a href="#" key={audioId} onClick={() => send({ type: "CHANGE_SOURCE", data: { audioId } })}>
                  ({t("story.audioPlayer.changeTo")} {t(`common.audioSpeeds.${audioId}`)})
                </a>
              ))}
          </span>
        </ul>
        <div className="absolute bottom-0 w-full h-1.5 bg-black">
          <div className="h-full bg-emerald-500" style={{ width: `${state.context.progressInPercent}%` }}></div>
        </div>
      </div>
    );
  }
);
