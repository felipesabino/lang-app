"use client";
import { useTranslation } from "react-i18next";
import { useContext, useState } from "react";
import { AuthContext, AuthDispatcherContext } from "@/authentication/auth-context";

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
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
    console.log(authContext?.context);
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
      ({i18n.language}) {t("home.loading")}
      <ul className="flex flex-col gap-4 list-none underline cursor-pointer">
        <li>
          <a href="/en">English</a>
        </li>
        <li>
          <a href="/fr">Français</a>
        </li>
        <li>
          <a href="/pt">Português</a>
        </li>
        <li>
          <a href="/es">Español</a>
        </li>
        <li>
          <a href="/it">Italiano</a>
        </li>
      </ul>
      {authContext?.state.matches("checkingIfLoggedIn") && <p>checkingIfLoggedIn</p>}
      {authContext?.state.matches("loggedIn") && <p>Logged In</p>}
      {authContext?.state.matches("loggingIn") && <p>Logging In</p>}
      {authContext?.state.matches("loggedOut") && <p>Logged Out</p>}
      {authContext?.state.matches("waitingChallenge") && <p>waiting challenge</p>}
      {authContext?.state.matches("wrong challenge") && <p>wrong challenge</p>}
      {authContext?.state.matches("checkingChallenge") && <p>checking Challenge</p>}
      {authContext?.state.matches("signingUp") && <p>signing Up</p>}
      <button onClick={login}>Login</button>
      <br />
      <input className="bg-red-200" type="text" name="email" value={email} onChange={(e) => updateemail(e)} />
      <input className="bg-red-200" type="text" name="name" value={name} onChange={(e) => updatename(e)} />
      <button onClick={signup}>Signup</button>
      <br />
      <button onClick={logout}>Logout</button>
      <br />
      <input className="bg-red-200" type="text" name="challenge" onChange={(e) => updatechallengevalue(e)} />
      <button onClick={answerChallenge}>Answer Challenge</button>
      <br />
      <button onClick={getUserData}>Get User Data</button>
    </div>
  );
};

export default Home;
