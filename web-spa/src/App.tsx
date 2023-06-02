import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./Layout";
import { _404 } from "./_404";
import { Detail, Waiting, NewStory, LayoutPages } from "./pages";

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
                  <Detail />
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
    <div>
      <h2>Home</h2>
    </div>
  );
}

export default App;
