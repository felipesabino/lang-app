import { createMachine } from "xstate";
import { StoryStatusType } from "@/graphql/types-and-hooks";

export interface MachineProps {
  storyId: string;
  retries?: number;
  timestamp: number;
  lastStatus: StoryStatusType;
  timeOutInMs: number;
}

export const rootMachine = createMachine<MachineProps>(
  {
    id: "Waiting Room",
    initial: "idle",
    states: {
      idle: {
        always: {
          target: "pending",
        },
        exit: ["reset-retries"],
      },
      pending: {
        invoke: {
          id: "fetch",
          src: "fetch",
          onDone: {
            target: "delaying-next-try",
            actions: "save-last-status",
          },
          onError: {
            target: "failure",
          },
        },
      },
      "delaying-next-try": {
        after: {
          100: [
            { target: "complete", cond: "is-status-complete" },
            { target: "too-many-retries", cond: "did-time-out" },
          ],
          5000: [{ target: "too-many-retries", cond: "did-time-out" }, { target: "idle" }],
        },
      },
      complete: {
        type: "final",
        entry: "completed",
      },
      failure: {
        entry: "increment-retries",
        always: [{ target: "pending", cond: "can-retry" }, { target: "too-many-retries" }],
        on: {
          RETRY: {
            target: "idle",
          },
        },
      },
      "too-many-retries": {
        on: {
          RETRY: {
            target: "idle",
            actions: "reset-timestamp",
          },
        },
      },
      timeout: {
        on: {
          RETRY: {
            target: "idle",
            actions: "reset-timestamp",
          },
        },
      },
    },
    schema: { events: {} as { type: "ERROR" } | { type: "GENERATING" } | { type: "COMPLETE" } },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      "reset-retries": (context, event) => (context.retries = 0),
      "increment-retries": (context, event) => (context.retries = context.retries! + 1),
      "save-last-status": (context, event) => (context.lastStatus = event.data.lastStatus),
      "reset-timestamp": (context, event) => (context.timestamp = +new Date()),
    },
    guards: {
      "can-retry": (context, event) => context.retries! < 3,
      "did-time-out": (context, event) => +new Date() - context.timestamp > context.timeOutInMs,
      "is-status-complete": (context, event) => context.lastStatus === StoryStatusType.Completed,
    },
  }
);
