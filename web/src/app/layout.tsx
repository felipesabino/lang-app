"use client";

import "./globals.css";

import { dir } from "i18next";
import i18n from "@/app/i18n";

export default function RootLayout({ children }: any) {
  // TODO: eventually this shoud be loaded from the user information when logging in

  return (
    <html lang={i18n.language} dir={dir(i18n.language)}>
      <body className="selection:bg-highlight">{children}</body>
    </html>
  );
}
