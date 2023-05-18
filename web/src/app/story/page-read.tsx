"use client";

import { TextSelectionObserver, SelectionInfo } from "./components/text-selection-observer";
import { useState } from "react";
import classNames from "classnames";
import { Paragraph, ParagraphSplitter } from "./components/paragraph-splitter";
import { moreInfoMachine } from "./workflow/more-info-machine";
import { useMachine } from "@xstate/react";
import { Story, AudioSpeed, SpeechMark } from "@/graphql/types-and-hooks";
import { capitalCase, sentenceCase } from "change-case";
import { StoryTextBlockHeader } from "./components/page-read-header";

export interface StoryTextBlockProps {
  story: Story;
  timeElapsed: number;
  audioSpeedSelected: AudioSpeed | string;
}

export const StoryTextBlock: React.FC<StoryTextBlockProps> = ({ story, timeElapsed, audioSpeedSelected }) => {
  const [machine] = useState(() => moreInfoMachine.withContext({ story: story, selectedText: "" }));

  const [state, send] = useMachine(machine, {
    devTools: true,
    services: {
      "get-text-info": (context, event) => {
        return Promise.resolve("Text Info!");
      },
    },
  });
  async function getSelectedTextInfo(selectionInfo: SelectionInfo) {
    send("SELECT", { data: selectionInfo.selectedText });
  }
  async function retryGetSelectedTextInfo() {
    send("RETRY");
  }
  async function dismissSelectedTextInfo() {
    send("DISMISS");
  }

  const audioSelected = story.assets.audio.filter((audio) => audio.speed === audioSpeedSelected)[0];
  const marks = audioSelected.speechMarks.filter((mark) => mark.type === "word").sort((a, b) => a.time - b.time);

  const toRender = {
    text: ParagraphSplitter(story.assets.text),
    translation: ParagraphSplitter(story.assets.translation),
    //@ts-expect-error
    mark: marks.findLast((mark) => mark.time < timeElapsed) as SpeechMark | undefined,
  };

  const renderDecoratedText = (paragraph: Paragraph, mark: SpeechMark | undefined) => {
    if (mark && paragraph.bufferEnd < mark.start) {
      return (
        <p
          className={classNames({
            "text-base/7 whitespace-pre-line": true,
            underline: true,
          })}
        >
          {paragraph.text}
        </p>
      );
    } else if (!mark || paragraph.bufferStart > mark.start) {
      return (
        <p
          className={classNames({
            "text-base/7 whitespace-pre-line": true,
            underline: false,
          })}
        >
          {paragraph.text}
        </p>
      );
    } else {
      return (
        <p
          className={classNames({
            "text-base/7 whitespace-pre-line": true,
            underline: false,
          })}
        >
          {paragraph.words.map((word, index) => (
            <span
              key={"w-" + index}
              className={classNames({
                underline: word.bufferStart <= mark.start,
              })}
            >
              {word.text}{" "}
            </span>
          ))}
        </p>
      );
    }
  };

  return (
    <div className="text-reading font-mono relative mb-10 flex flex-col md:flex-row min-h-screen place-content-center">
      <div className="bg-white basis-full max-w-4xl">
        <div className="overflow-auto p-8 mb-8 divide-y divide-dashed ">
          <StoryTextBlockHeader story={story} />
          {toRender.text.map((item, index) => (
            <div key={"p-" + index}>
              <TextSelectionObserver onButtonClick={getSelectedTextInfo}>
                {renderDecoratedText(item, toRender.mark)}
              </TextSelectionObserver>
              <details className="pb-2">
                <summary className="text-sm leading-6 text-gray-400 font-semibold select-none hover:cursor-help">
                  Translation
                </summary>
                <p className="mt-2 text-sm leading-6 text-gray-400 italic">{toRender.translation[index].text}</p>
              </details>
            </div>
          ))}
        </div>
      </div>
      {["successful", "pending", "failure", "waiting"].some(state.matches) && (
        <aside className="max-h-screen sticky top-12 md:pr-6 lg:border-l lg:border-gray-200 lg:pr-8 xl:pr-0 basis-1/5 md:basis-full">
          <div className="h-full py-6 pl-6">
            <a href="#" onClick={dismissSelectedTextInfo}>
              Dismiss this text
            </a>
            <hr className="mt-2 mb-4" />
            {["pending", "successful", "waiting"].some(state.matches) && (
              <p className="text-gray-800">Selected text: &quot;{state.context.selectedText}&quot;</p>
            )}
            {state.matches("pending") && <p className="text-gray-800">Building explanation...</p>}
            {["successful", "waiting"].some(state.matches) &&
              state.context.textInfo.split("\n").map((paragraph: string, index: number) => (
                <p className="pt-2" key={"exp-" + index}>
                  {paragraph}
                </p>
              ))}
            {state.matches("failure") && (
              <p className="text-gray-800">
                Error loading info{" "}
                <a href="#" onClick={retryGetSelectedTextInfo}>
                  Retry
                </a>
              </p>
            )}
          </div>
        </aside>
      )}
    </div>
  );
};
