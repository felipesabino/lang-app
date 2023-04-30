import React from "react";
import { AudioPlayer } from "../components/AudioPlayer";
import { Story, StoryTextBlock } from "./storyTextBlock";
import { StoryPageClientSide } from "./StoryPageClientSide";

export default async function StoryPage() {
  const story = await getData();

  return (
    <>
      <StoryPageClientSide story={story} />
    </>
  );
};

export async function getData(): Promise<Story> {
  try {
    const textResponse = await new Promise<Response>((resolve) => {
      setTimeout(() => {
        resolve(fetch("http://localhost:3000/story.json"))
      }, 2000)
    })
    const story = await textResponse.json();

    return story;
  } catch (error) {
    console.error("Error fetching data:", error);
    return { text: "", translation: "", marks: [], audio: "" };
  }
}