import React from "react";
import { AudioPlayer } from "../components/AudioPlayer";
import { Story, StoryTextBlock } from "./storyTextBlock";

export default async function StoryPage() {
  const story = await getData();

  return (
    <div className="">
      <StoryTextBlock story={story} />
      <AudioPlayer audioSrc={story.audio} />
    </div>
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