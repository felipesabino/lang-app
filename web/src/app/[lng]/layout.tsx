"use client";

import "../globals.css";
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
import { dir } from "i18next";
import i18n, { languages, i18nProps } from "@/app/i18n";
import { useEffect } from "react";

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

interface RootLayoutProps extends i18nProps {
  children: React.ReactNode;
}

export default function RootLayout({ children, params: { lng } }: RootLayoutProps) {
  // TODO: eventually this shoud be loaded from the user information when logging in

  //if(i18n.language !== lng)
  useEffect(() => {
    i18n.changeLanguage(lng);
  });

  const url = process.env.NEXT_PUBLIC_API_URL || "";
  const region = process.env.NEXT_PUBLIC_API_REGION || "";

  const link = ApolloLink.from([
    createAuthLink({
      url,
      region,
      auth: {
        type: "API_KEY",
        apiKey: process.env.NEXT_PUBLIC_API_KEY || "",
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

  // i18n

  return (
    <html lang={lng} dir={dir(lng)}>
      <body className="selection:bg-highlight">
        <div>
          <ApolloProvider client={client}>
            <UserHeader pageTitle={i18n.t("app.name")} name="The User" />
            {children}
          </ApolloProvider>
        </div>
      </body>
    </html>
  );
}
