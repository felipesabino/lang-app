"use client";

import React from "react";
import { Story, StoryTextBlock } from "./storyTextBlock";
import { StoryPageClientSide } from "./StoryPageClientSide";

export default async function StoryPage() {
  const storyId = "adec05b1-a6b3-455e-935a-bd62a6ba2b6d";
  return (
    <>
      <StoryPageClientSide storyId={storyId} />
    </>
  );
}
