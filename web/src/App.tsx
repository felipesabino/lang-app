import React from "react";
import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "./Layout";
import { _404 } from "./_404";
import { LayoutPages } from "./pages";
import { NewStory } from "./pages/new";
import { Waiting } from "./pages/waiting/index";
import { StoryPage } from "./pages/story";
import { Login } from "./pages/login";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path=":lng"
            element={
              <React.Suspense fallback={<>...</>}>
                <LayoutPages />
              </React.Suspense>
            }
          >
            <Route
              path="new"
              element={
                <React.Suspense fallback={<>...</>}>
                  <NewStory />
                </React.Suspense>
              }
            />
            <Route
              path="waiting/:storyId"
              element={
                <React.Suspense fallback={<>...</>}>
                  <Waiting />
                </React.Suspense>
              }
            />
            <Route
              path="story/:storyId"
              element={
                <React.Suspense fallback={<>...</>}>
                  <StoryPage />
                </React.Suspense>
              }
            />
            <Route
              path="login"
              element={
                <React.Suspense fallback={<>...</>}>
                  <Login />
                </React.Suspense>
              }
            />
          </Route>
          <Route path="*" element={<_404 />} />
        </Route>
      </Routes>
    </>
  );
}

function Home() {
  const { t, i18n } = useTranslation();

  return (
    <div className="grid gap-4 place-content-center h-screen w-full">
      ({i18n.language})
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
    </div>
  );
}

export default App;
