import { Auth } from "aws-amplify";
const CUSTOM_AUTH_TTL = 5 * 60 * 1000; // Milliseconds
import { AuthDetails } from "./auth-machine";

interface CustomAuthSession {
  username: string;
  Session: string;
  // Milliseconds after epoch
  expiresAt: number;
}

type CustomCognitoUser = AuthDetails;

export class AuthService {
  private cognitoUser: CustomCognitoUser | undefined;

  public USER_DO_NOT_EXIST = "UserNotFoundException";

  public async signIn(email: string) {
    try {
      this.cognitoUser = await Auth.signIn(email);
    } catch (e: any) {
      throw e;
    }
  }

  public async signOut() {
    await Auth.signOut();
  }

  public async answerCustomChallenge(answer: string) {
    if (!this.cognitoUser) {
      throw new Error("no user");
    }
    this.cognitoUser = await Auth.sendCustomChallengeAnswer(this.cognitoUser, answer);
    return this.isAuthenticated();
  }

  public async getPublicChallengeParameters() {
    return this.cognitoUser?.challengeParam;
  }

  public async signUp(email: string, fullName: string) {
    const params = {
      username: email,
      password: this.getRandomString(30),
      attributes: {
        name: fullName,
      },
    };
    await Auth.signUp(params);
  }

  private getRandomString(bytes: number) {
    const randomValues = new Uint8Array(bytes);
    window.crypto.getRandomValues(randomValues);
    return Array.from(randomValues).map(this.intToHex).join("");
  }

  private intToHex(nr: number) {
    return nr.toString(16).padStart(2, "0");
  }

  public async isAuthenticated() {
    try {
      return Auth.currentSession();
    } catch {
      return false;
    }
  }

  public async hasSession() {
    if (!this.cognitoUser) {
      return false;
    }
    return new Promise((resolve, reject) => {
      this.cognitoUser?.getSession((err: any, session: any) => {
        if (!err && session && session.isValid()) {
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  }

  public async getUserDetails(): Promise<any> {
    if (!this.cognitoUser) {
      this.cognitoUser = await Auth.currentAuthenticatedUser();
    }
    return this.cognitoUser;
  }
  // public async clearCustomAuthSession() {
  //   window.localStorage.removeItem("CustomAuthSession");
  // }

  // public async storeCustomAuthSession(cognitoUser: CustomCognitoUser) {
  //   // Session isn't exposed to TypeScript, but it's a public member in JS
  //   const session = (cognitoUser as any).Session;
  //   const expiresAt = window.Date.now() + CUSTOM_AUTH_TTL;
  //   const otpSession: CustomAuthSession = {
  //     Session: session,
  //     expiresAt,
  //     username: cognitoUser.getUsername(),
  //   };
  //   const json = window.JSON.stringify(otpSession);
  //   window.localStorage.setItem("CustomAuthSession", json);
  // }

  // public async loadCustomAuthSession() {
  //   const raw = window.localStorage.getItem("CustomAuthSession");
  //   if (!raw) {
  //     throw new Error("No custom auth session");
  //   }
  //   const storedSession: CustomAuthSession = window.JSON.parse(raw);
  //   if (storedSession.expiresAt < window.Date.now()) {
  //     await this.clearCustomAuthSession();
  //     throw new Error("Stored custom auth session has expired");
  //   }
  //   const username = storedSession.username;
  //   // Accessing private method of Auth here which is BAD, but it's still the
  //   // safest way to restore the custom auth session from local storage, as there
  //   // is no interface that lets us do it.
  //   // (If we created a new user pool object here instead to pass to a
  //   // CognitoUser constructor that would likely result in hard to catch bugs,
  //   // as Auth can assume that all CognitoUsers passed to it come from its pool
  //   // object.)
  //   const user: CustomCognitoUser = (Auth as any).createCognitoUser(username);
  //   // Session is not exposed to TypeScript, but it's a public member in the
  //   // JS code.
  //   (user as any).Session = storedSession.Session;
  //   return user;
  // }
}
