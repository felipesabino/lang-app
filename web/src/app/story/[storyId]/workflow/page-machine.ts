import { createMachine, assign } from "xstate";
import { Story } from "../page-read";

export interface MachineContext {
  storyId: string;
  story?: Story;
}

export const pageMachine = createMachine<MachineContext>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGUAuB7ATgTwAQBExUBDASwBsA6WDHAWlInLAGIAxAUQBUBhACQDaABgC6iUAAd0sUqlLoAduJAAPRAEYAbJsoBOTQA4A7AFYATLqNahmowBoQ2DUd2UTQj0IDMZ9V-W+mgC+QQ5oWHiEJBTUtNh0EmAKEKQKUCwQimCUqQBu6ADW2QBmRADGABZ0NBHCYkggUjJyispqCOYOTgjqfjomACxaRlaDfiYhYXEERGRUNfSJyanpYJiYWJQS5MSoxVgAtpSlqJXVcXXKTbLySg3t6rrqlGbuHl4m6kYDAwbqA11EH83J4hL11AYzFDdANJiBwjgZtF5nE6MU5gBXTCsTi8QSiK7SG6te4aJ4vN7eT7fX7-QE9CyUUFCXxmHxCP5whGRWYxBbxCC7Yh0bHECDYWIRBLETAyNLsADyACUALIAQS4lwa1xad1A7SGAyZui8pj+Zm+mi8BnpnyEIM8g1ZJk5oXh0yic0l9EFJBFYDFEv5-rFK0oxAxKXQ4cj8gYTFYAAUADJqgCaWskRN1bUQA0MTM0ryERi8uiEJi8Xk0JnpfjMOlBfnUJYtvS5Ht5KKlvuFovF3vi-bDEajMajCR22BWLETaoAqsgOJnGtnbrmEGbKDWrRWvr8OXWq-0DFX80WoSZDB2IkivcHeyGB8Hh2lx-J3+hJ8Rp-K2MqAHU1SVfAVx1ddSQ6XQTEoKwhBhFxrU8G1HA0C0vAdMEzDBUsTBGG9EU9PlUUffsg1RV8oE-T9v1-dIACE1R4ABpICQLAtcSX1RATHLJl-AbFkRl8R46yhDCm3gi0fgGMwCJ5ZFBzoUiA2fCjVJHWNo1HONth-Gd+DVAA5ABxDgAH1kAVeclR4ZcCW1Ti9VUHjtEw+DNF6CsTFrVCei+Mx3N0U9TC8Dl5LvYieyFJ9yKlSjqJ0r89LolhkC4BVEw45oIO4hB8wMQti1LctK2rXzugCUxMICHCPnwt1uUi7sfRisilISpKaIkCNYCTVMMwcrMcq4lzNwLE1TB8-MXU0AYKrQgxG1PLx5srNkBh8CKiJagU2tUuL6AS1AwBUVBKBOs742YNKOGTDgeE1IbVxG5z2m+VxoP8a1oPMC1NDrTyjEoKsz0mysBmC7auyUlTAw6jS30u87keqMBmDKE6IBYPgAEkTL4ZN8b4J76mG4k3o0FlAo2stKwMGEfBQyrtGeIZtFPTzNBhebocUh99vhl9Eao5GLtO1A0YxrH2G4fhsopjcWyhF5Vrpn7NrMZmNE8+0ng514LW8dQ+fvEjBbU+KRfFs6bclipSCgCpyEdipJaWFJ5Q4JUlWVBWc0g-54ModQrwtXRdAtdwvDrKxnn1wwBiMGwDBdU2otav12uF0MkYlu26Adp2Xad92kk99JkHnHg7OQZA2HnZN-dysblZptWvoZzXtZ6UtCo5MHI+8FP0925SLcOodrbF1HUn2BJy5nKua44OuG6b57wNGh5qdVzbO8ZrW60hk8zwMU9vBNUfYYnhHc9F-PZ4UeePZnb3faVZvt40AZg9DosXCR1MN4OsgxXAukHthMK15Gqdn5ubLOB074VztjkZ+6BcCwAxGUMocBYDFAxOQFg+BcbIBVKQ5AX9KYdCEEaHcrwDCyTmpCGOfktCvEoOzQwWtyxVivNfAWiChbqXvqg2QEs6B0HQWiOYkBZZ4ioUrH4NNzQGA5DWV4q1j4RyZCtX4F8yxVgEQgvsSCc4oJnhIouztXaS3RBQOReMCZEwJqTQkr0lF-zDoAqOIC2Gs04VoQw1YtA8wmLA28O0b5CMtvQfYmADi7BnEqDgap8CDTJi9RWkEfgwQCG8VO5oI6DHpMJJkoIazglGCEN0Ch0AQDgMoJqO13HZLynQAGfkOnlOZL0ksxipSMGYK0gOeVZJ1jUT094vgBJaAGYsReaQRkt3aNWQqeE-hMwsMJasdYOTuX+HhE0RZYQRMIjDYM9jyBYjAMs7++UzD0iWro0G81yw0mrPMvaMTujk1Ga3cktgISIWjnNSw9JZISVBJtYeHxQ5fPHj8pSPVZQrDudQwS24rDGBNKChaHRehTIrLJfJropiRIuSY2KyC0WOQ8ZBNkrggU4o+N4MF9g-IR2BpSEsmgwQcnCeS858DopIvMZpKM6KNxa2BsykFbL8UtlTkS4wjwwoGARXDWJU9RFdSStdW5dK2ljT4Vi4FuKFVHghIE7QLheJQlTsEM5CkzaitMcIq2uqtLdSnLSv5KyeLKqLO4FsoczBJ12Wwnwrgmz+FbFYLwmrb7irfHqrS0oMR9SlZBYw9pzQ+SMHNXw5hdBHn8DVONRg2wm2dc1aJ7rtVPjDMjbNeUZVmpZXi4+wcB6rRGAEL4SaxUiIsY-CRQzDX+vuUWcBRhNnBvMP8Hu7CYIJ0hAzbwHwnVCpdRnb5DbJ5NrzrbVGfVpaQFbWNXNnDDCFu0PawIgMviUBWqtcGb6NW1qiYIg9NLj0oysa7EubsF7LCWUa-5DwIR5O8bJE0kcAT+NsDVBNaqh2-pTQ-E947pGv3A1O6htUMJLvzGybw6FQEVhDtobhq1Kxzs-TuutP7qWYbEegzB2DcGwHwYQy9qyPgdvleVSjgUaO0fmqac+6HWMjubfncRV0pHzyuReiDAaejTT0L4csp58xxsQ5VdwsqaMsMkwxmT2c5P-oLtY4DdjZEQH4xoLTkdHgD30y2QzOtk5TK+M2K+X7KVutk1KeJiS5D4ayZBxAUchMWpE35MpPLKm9GqTUoAA */
    id: "Story Detail",
    initial: "pending",
    states: {
      pending: {
        invoke: {
          id: "fetch",
          src: "fetch",
          onDone: {
            target: "successful",
            actions: assign((context, event) => {
              return {
                story: event.data,
              };
            }),
          },
          onError: {
            target: "failure",
          },
        },
      },
      failure: {
        entry: [(a, b) => console.log("error", a, b)],
        on: {
          FETCH: {
            target: "pending",
          },
        },
      },
      successful: {
        type: "final",
      },
    },
    schema: {
      events: {} as { type: "FETCH" } | { type: "ERROR" } | { type: "SUCESSFUL" },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  }
  // {
  //   services: {
  //     "fetch-story": (context, event) => {
  //       console.log("fetching story data...", context, event);
  //       return Promise.resolve();
  //     },
  //   },
  // }
);
