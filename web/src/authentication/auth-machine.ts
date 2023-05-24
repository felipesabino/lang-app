import { assign, createMachine, Sender } from "xstate";
import { CognitoUser } from "amazon-cognito-identity-js";

export type AuthenticationMachineContext = {
  authDetails?: AuthDetails;
  email?: string;
  name?: string;
};

export type AuthDetails = CognitoUser & { challengeParam: { email: string } };

export type AuthenticationMachineEvent =
  | { type: "REPORT_IS_LOGGED_IN"; authDetails: AuthDetails }
  | { type: "LOG_IN"; email: string }
  | { type: "LOG_OUT" }
  | { type: "REPORT_IS_LOGGED_OUT" }
  | { type: "REPORT_WAITING_CHALLENGE" }
  | { type: "REPORT_CHALLENGE_OK"; authDetails: AuthDetails }
  | { type: "ANSWER_CHALLENGE"; challenge: string }
  | { type: "SIGN_UP"; email: string; name: string }
  | { type: "REPORT_SIGNED_UP" };

const authenticationMachine = createMachine<AuthenticationMachineContext, AuthenticationMachineEvent>(
  {
    id: "authentication",
    initial: "checkingIfLoggedIn",
    predictableActionArguments: true,
    preserveActionOrder: true,
    states: {
      checkingIfLoggedIn: {
        invoke: {
          src: "checkIfLoggedIn",
          onError: {
            target: "loggedOut",
          },
        },
        on: {
          REPORT_IS_LOGGED_IN: {
            target: "loggedIn",
            actions: "assignUserDetailsToContext",
          },
          REPORT_IS_LOGGED_OUT: "loggedOut",
        },
      },
      loggedIn: {
        on: {
          LOG_OUT: {
            target: "loggedOut",
          },
        },
      },
      loggingIn: {
        invoke: {
          src: "signIn",
          onError: {
            target: "loggedOut",
          },
        },
        on: {
          REPORT_WAITING_CHALLENGE: "waitingChallenge",
        },
      },
      loggedOut: {
        entry: ["logOut", "clearUserDetailsFromContext"],
        on: {
          LOG_IN: "loggingIn",
          SIGN_UP: "signingUp",
        },
      },
      checkingChallenge: {
        invoke: {
          src: "answerChallenge",
          onError: "wrongChallenge",
        },
        on: {
          REPORT_CHALLENGE_OK: {
            target: "loggedIn",
            actions: "assignUserDetailsToContext",
          },
        },
      },
      waitingChallenge: {
        on: {
          ANSWER_CHALLENGE: "checkingChallenge",
          LOG_IN: "loggingIn",
        },
      },
      wrongChallenge: {
        on: {
          ANSWER_CHALLENGE: "checkingChallenge",
          LOG_IN: "loggingIn",
        },
      },
      signingUp: {
        invoke: {
          src: "signUp",
          onError: "loggedOut",
        },
        on: {
          REPORT_SIGNED_UP: "waitingChallenge",
        },
      },
    },
  },
  {
    actions: {
      assignUserDetailsToContext: assign((context, event) => {
        if (event.type !== "REPORT_IS_LOGGED_IN" && event.type !== "REPORT_CHALLENGE_OK") {
          return {};
        }
        return {
          authDetails: event.authDetails,
          email: event.authDetails.challengeName,
          name: event.authDetails.challengeName,
        };
      }),
      clearUserDetailsFromContext: assign((context, event) => {
        return {
          authDetails: undefined,
          email: undefined,
          challenge: undefined,
        };
      }),
    },
  }
);

export default authenticationMachine;
