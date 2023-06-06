import { useMachine } from "@xstate/react";
import { State } from "xstate";
import { createContext, useState } from "react";
import authenticationMachine, { AuthenticationMachineContext, AuthenticationMachineEvent } from "./auth-machine";
import { AuthService } from "./auth-service";
import { Amplify } from "aws-amplify";
import awsExports from "@/aws-exports";
import { Login } from "@/pages/login";

//TODO: how to get events from loginn page?

export interface AuthContextInterface {
  logIn: (email: string) => void;
  logOut: () => void;
  answerChallenge: (challenge: string) => void;
  signUp: (email: string, name: string) => void;
}
export const AuthContext = createContext<
  | {
      state: State<AuthenticationMachineContext, AuthenticationMachineEvent, any, any, any>;
      context: AuthenticationMachineContext;
    }
  | undefined
>(undefined);
export const AuthDispatcherContext = createContext<AuthContextInterface | undefined>(undefined);

//@ts-expect-error
export const AuthProvider = ({ children }) => {
  useState(() => {
    Amplify.configure({
      Auth: {
        region: awsExports.REGION,
        userPoolId: awsExports.USER_POOL_ID,
        userPoolWebClientId: awsExports.USER_POOL_APP_CLIENT_ID,
      },
    });
  });

  const [authService] = useState(new AuthService());
  const [machine] = useState(authenticationMachine.withContext({}));
  const [state, send] = useMachine(machine, {
    devTools: true,
    actions: {
      logOut: async (context: AuthenticationMachineContext) => {
        await authService.signOut();
      },
    },
    services: {
      checkIfLoggedIn: async (context: AuthenticationMachineContext) => {
        const isAuthenticated = await authService.isAuthenticated();
        if (isAuthenticated) {
          const authDetails = await authService.getUserDetails();
          send({ type: "REPORT_IS_LOGGED_IN", authDetails });
        } else {
          send({ type: "REPORT_IS_LOGGED_OUT" });
        }
      },
      signIn: async (_, event) => {
        if (event.type === "LOG_IN") {
          try {
            await authService.signIn(event.email);
            send({ type: "REPORT_WAITING_CHALLENGE" });
          } catch (e: any) {
            if (e.code === authService.USER_DO_NOT_EXIST) {
              send({ type: "REPORT_NEED_SIGN_UP" });
            } else {
              throw e;
            }
          }
        }
      },
      answerChallenge: async (_, event) => {
        if (event.type === "ANSWER_CHALLENGE") {
          if (await authService.answerCustomChallenge(event.challenge)) {
            const authDetails = await authService.getUserDetails();
            send({ type: "REPORT_CHALLENGE_OK", authDetails });
          } else {
            throw new Error("Error answering challenge");
          }
        }
      },
      signUp: async (_, event) => {
        if (event.type === "SIGN_UP") {
          await authService.signUp(event.email, event.name);
          await authService.signIn(event.email);
          send({ type: "REPORT_SIGNED_UP" });
        }
      },
    },
  });

  const logIn = (email: string): void => {
    send({ type: "LOG_IN", email });
  };
  const logOut = (): void => {
    send({ type: "LOG_OUT" });
  };
  const answerChallenge = (challenge: string): void => {
    send({ type: "ANSWER_CHALLENGE", challenge });
  };
  const signUp = (email: string, name: string): void => {
    send({ type: "SIGN_UP", email, name });
  };

  return (
    <AuthContext.Provider value={{ state, context: machine.context }}>
      <AuthDispatcherContext.Provider value={{ logIn, logOut, answerChallenge, signUp }}>
        {state.tags.has("isLoggedIn") && children}
        {!state.tags.has("isLoggedIn") && <Login />}
      </AuthDispatcherContext.Provider>
    </AuthContext.Provider>
  );
};
