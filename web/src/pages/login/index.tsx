import { useContext, useState } from "react";
import { AuthContext, AuthDispatcherContext } from "@/authentication/auth-context";
import React from "react";

export const Login: React.FC = () => {
  const [challenge, setChallenge] = useState("");
  const [email, setEmail] = useState("test1@sabino.me");
  const [name, setName] = useState("Felipe Sabino");

  const authContext = useContext(AuthContext);
  const authDispatcherContext = useContext(AuthDispatcherContext);

  const login = async () => {
    try {
      authDispatcherContext?.logIn(email);
    } catch (e) {
      console.log(e);
    }
  };

  const signup = async () => {
    try {
      authDispatcherContext?.signUp(email, name);
    } catch (e) {
      console.log(e);
    }
  };

  const logout = async () => {
    try {
      authDispatcherContext?.logOut();
    } catch (e) {
      console.log(e);
    }
  };

  const getUserData = async () => {
    console.log(authContext?.state.context);
  };

  const answerChallenge = async () => {
    authDispatcherContext?.answerChallenge(challenge);
  };

  const updatechallengevalue = async (evt: any) => {
    setChallenge(evt.target.value);
  };

  const updateemail = async (evt: any) => {
    setEmail(evt.target.value);
  };

  const updatename = async (evt: any) => {
    setName(evt.target.value);
  };

  return (
    <div className="grid gap-4 place-content-center h-screen w-full">
      {authContext?.state.matches("checkingIfLoggedIn") && <p>Loading user data</p>}
      {authContext?.state.matches("loggedIn") && <p>Logged In</p>}
      {authContext?.state.matches("loggingIn") && <p>Logging In</p>}
      {authContext?.state.matches("loggedOut") && <p>Logged Out</p>}
      {authContext?.state.matches("waitingChallenge") && <p>waiting challenge</p>}
      {authContext?.state.matches("wrongChallenge") && <p>wrong challenge</p>}
      {authContext?.state.matches("checkingChallenge") && <p>checking Challenge</p>}
      {authContext?.state.matches("waitingSignUp") && <p>waiting signing Up</p>}
      {authContext?.state.matches("signingUp") && <p>signing Up</p>}
      {[
        "loggingIn",
        "loggedOut",
        "waitingChallenge",
        "wrongChallenge",
        "checkingChallenge",
        "waitingSignUp",
        "signingUp",
      ].some((e) => authContext?.state.matches(e)) && (
        <>
          <span>E-mail</span>
          <input
            className="form-input mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
            type="text"
            name="email"
            value={email}
            onChange={(e) => updateemail(e)}
          />
        </>
      )}
      {["waitingSignUp", "signingUp"].some((e) => authContext?.state.matches(e)) && (
        <>
          <span>Name</span>
          <input
            className="form-input mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
            type="text"
            name="name"
            value={name}
            onChange={(e) => updatename(e)}
          />
        </>
      )}
      {["waitingChallenge", "wrongChallenge", "checkingChallenge"].some((e) => authContext?.state.matches(e)) && (
        <>
          <span>Challenge</span>
          <input
            className="form-input mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
            type="text"
            name="challenge"
            value={challenge}
            onChange={(e) => updatechallengevalue(e)}
          />
        </>
      )}
      {["loggingIn", "loggedOut"].some((e) => authContext?.state.matches(e)) && <button onClick={login}>Next</button>}
      {["waitingSignUp", "signingUp"].some((e) => authContext?.state.matches(e)) && (
        <button onClick={signup}>Signup</button>
      )}
      {["waitingChallenge", "wrongChallenge", "checkingChallenge"].some((e) => authContext?.state.matches(e)) && (
        <button onClick={answerChallenge}>Answer Challenge</button>
      )}
      <br />
      <hr />
      {["loggedIn"].some((e) => authContext?.state.matches(e)) && (
        <>
          <button onClick={logout}>Logout</button>
          <button onClick={getUserData}>Get User Data</button>
        </>
      )}
    </div>
  );
};
