import React from "react";
import { Routes, Route, Link } from "react-router-dom";
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
  return (
    <div className="grid gap-4 place-content-center h-screen w-full">
      <ul className="flex flex-col gap-4 list-none underline cursor-pointer text-reading md:text-lg lg:text-xl">
        <li>
          <Link to="/en/new">Do you speak English?</Link>
        </li>
        <li>
          <Link to="/fr/new">Parlez-vous Français?</Link>
        </li>
        <li>
          <Link to="/pt/new">Você fala Português?</Link>
        </li>
        <li>
          <Link to="/es/new">¿Hablas Español?</Link>
        </li>
        <li>
          <Link to="/it/new">Parli Italiano?</Link>
        </li>
      </ul>
    </div>
  );
}

export default App;
