"use client";

import "./globals.css";
import { UserHeader } from "./components/UserHeader";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  createHttpLink,
  defaultDataIdFromObject,
} from "@apollo/client";
import { createAuthLink } from "aws-appsync-auth-link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
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

  return (
    <html lang="en">
      <body className="selection:bg-highlight">
        <div>
          <ApolloProvider client={client}>
            <UserHeader pageTitle="New Story" name="The User" />
            {children}
          </ApolloProvider>
        </div>
      </body>
    </html>
  );
}
