import { createMachine, assign } from "xstate";
import { Story } from "../page-read";

export interface MachineContext {
  story: Story;
  selectedText: string;
  retries?: number;
  textInfo?: any;
  total?: number;
}

export const moreInfoMachine = createMachine<MachineContext>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFkD2AnMACAkgOwDNUA6ABzDwgEs8oBiCVPMYmgN1QGsWYAXAWl5gAHgJpEA2gAYAuolClUsKrypN5IYYgBsAVgCcxAOwAOAIwAmbdv0BmE-t0mTAGhABPRLoAst4o9szW28pbQsTbzN9AF9otzRMXEISckoaejB0dAwyABsAQ14idABbYj5BETFk6TkkEEVlVXV6rQRrM2JLXSlQ-XCHKX03TwRzYm99KamjHtsjW21Y+IxsfCJiWABXAGMduFgCLdy6Wo1GlTU8DTbwwxNw7oWF-W8fEcRvbyMJi30jMyzIEhV7LEAJNbJYgEfJUXJbTCnWTnJSXFqgW4OYgPcwWXTPWyvd4eRAWKSdHq9QEmBaRAxGMEQpIbGFwhFgU5mOoKVHNa6tUlYnFPeaEt7eD4IEKdbx-WaPIIWb6M1bMkis+GIiQWbkNXlXG6C+6PPEEokSkkIYLefxGPRGaaRewxOLg1XrEgAd1hqlodAAygBRAAygYAwgAVM71C58w3tAzGXHWOwOJyuS10-y6QK+IxDB7BXQqxIe1gQXIcoOhyPRnlNA0ChOGUyWFPO9OS2xk4i9KmvbQmeZGBaxV14VAQOAaJkelEN9GaRD8bSSle9vubrdmbwlyEbVLUWjztH8jGIGk-fOBSyBB6A1eZrG6IJSPPdozeJau2dQ7Z7A4jlyE84ybHcLF7OxZhMfETG0KIjElXRtCkSDtFsXQDBsRVbD3NVoVhTUwBAxtzylCwuyGLo7QMCwASCXQ-jwstvUuY8Y31Rc2kwiCfGwwEHV6YJJV8QxAX0Gw4OQixAVwn93ShKgK2IjiFzPJcEGQzprBBHN-imR9RmCPwLCsfEvh3EczGQsdoiAA */
    id: "More Info",
    initial: "idle",
    states: {
      pending: {
        invoke: {
          id: "get-text-info",
          src: "get-text-info",
          onDone: {
            target: "successful",
            actions: assign((context, event) => {
              return {
                textInfo: event.data,
              };
            }),
          },
          onError: "failure",
        },
      },
      successful: {
        // uncomment if there is a need for an intermediate state to dismiss the more info panel
        //  in case there is a modal or side panel, for example. otherwise we just sent the state to 'waiting'
        // on: {
        //   DISMISS: "idle",
        // },
        always: "waiting",
      },
      failure: {
        entry: "increment-retries",
        always: [{ target: "pending", cond: "can-retry" }],
        on: {
          RETRY: {
            target: "pending",
            actions: "reset-retries",
          },
          SELECT: {
            target: "pending",
            actions: ["reset-retries", "select-text"],
          },
        },
      },
      waiting: {
        on: {
          SELECT: {
            target: "pending",
            actions: "select-text",
          },
        },
      },
      idle: {
        on: {
          SELECT: {
            target: "pending",
            actions: "select-text",
          },
        },
      },
    },
    schema: {
      events: {} as { type: "SELECT" } | { type: "RETRY" },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      "reset-retries": (context, event) => (context.retries = 0),
      "increment-retries": (context, event) => (context.retries = context.retries! + 1),
      "select-text": assign((context, event) => {
        return {
          selectedText: event.data,
        };
      }),
    },
    guards: {
      "can-retry": (context, event) => context.retries! < 3,
    },
  }
);
