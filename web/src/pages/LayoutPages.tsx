import { Outlet } from "react-router-dom";

import { UserHeader } from "./components/user-header";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  createHttpLink,
  defaultDataIdFromObject,
} from "@apollo/client";
import { createAuthLink } from "aws-appsync-auth-link";
import i18n from "@/i18n";
import { Auth } from "aws-amplify";
import { AuthProvider } from "@/authentication/auth-context";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const LayoutPages = () => {
  let { lng } = useParams();
  useEffect(() => {
    i18n.changeLanguage(lng);
  });

  const url = process.env.REACT_APP_PUBLIC_API_URL || "";
  const region = process.env.REACT_APP_PUBLIC_API_REGION || "";

  const link = ApolloLink.from([
    createAuthLink({
      url,
      region,
      auth: {
        type: "AMAZON_COGNITO_USER_POOLS",
        jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken(),
      },
    }),
    createHttpLink({ uri: url }),
  ]);

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache({
      dataIdFromObject(responseObject) {
        switch (responseObject.__typename) {
          case "Story":
            return `Story:${responseObject.storyId}`;
          default:
            return defaultDataIdFromObject(responseObject);
        }
      },
    }),
  });

  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <UserHeader pageTitle={i18n.t("app.name")} name="The User" />
        <Outlet />
      </ApolloProvider>
    </AuthProvider>
  );
};
