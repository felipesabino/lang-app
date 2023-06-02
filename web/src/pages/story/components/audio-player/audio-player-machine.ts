import { Schema } from "inspector";
import { createMachine, assign, actions } from "xstate";

export interface MachineContext {
  audioObject?: HTMLAudioElement;
  audioId: string;
  audioUrl: string;
  description: string;
  audioDurationInMs: number;
  timeElapsedInMs: number;
  progressInPercent: number;
}

export const audioPlayerMachine = createMachine<MachineContext>(
  {
    id: "Audio Player",
    initial: "unloaded",
    states: {
      unloaded: {
        invoke: {
          id: "load",
          src: "load",
          onDone: {
            target: "idle",
            actions: "update-audio-data",
            //  duration
          },
        },
      },
      idle: {
        on: {
          PLAY: {
            target: "playable",
          },
          CHANGE_SOURCE: {
            target: "reloading",
            actions: "update-audio-id",
          },
        },
      },
      reloading: {
        invoke: {
          id: "load",
          src: "load",
          onDone: {
            target: "idle",
            actions: "update-audio-data",
            // set context values
            //  duration
          },
        },
      },
      playable: {
        initial: "playing",
        states: {
          playing: {
            on: {
              PAUSE: {
                target: "paused",
              },
              TIME_ELAPSED: {
                actions: "time-elapsed",
              },
            },
            invoke: {
              id: "play",
              src: "play",
            },
          },
          paused: {
            on: {
              PLAY: {
                target: "playing",
              },
            },
            invoke: {
              id: "pause",
              src: "pause",
            },
          },
        },
        on: {
          FORWARD: {
            actions: "forward",
          },
          BACKWARD: {
            actions: "backward",
          },
          CHANGE_SOURCE: {
            target: "reloading",
            actions: "update-audio-id",
          },
        },
      },
    },
    schema: {
      events: {} as
        | { type: "LOADED" }
        | { type: "PLAY" }
        | { type: "PAUSE" }
        | { type: "FORWARD" }
        | { type: "BACKWARD" }
        | {
            type: "CHANGE_SOURCE";
            audioObject: HTMLAudioElement;
            audioId: string;
            audioUrl: string;
            description: string;
            audioDurationInMs: number;
          }
        | { type: "TIME_ELAPSED"; timeElapsedInMs: number },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      "update-audio-id": assign((_, event) => {
        return {
          audioId: event.data.audioId,
        };
      }),
      "update-audio-data": assign((_, event) => {
        return {
          timeElapsedInMs: 0,
          progressInPercent: 0,
          ...event.data,
        };
      }),
      "time-elapsed": assign((context, event) => {
        return {
          timeElapsedInMs: event.data.timeElapsedInMs,
          progressInPercent: (event.data.timeElapsedInMs / context.audioDurationInMs) * 100,
        };
      }),
    },
  }
);
