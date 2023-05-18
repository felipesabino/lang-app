"use client";

import { TextSelectionObserver, SelectionInfo } from "./components/TextSelectionObserver";
import { useState } from "react";
import classNames from "classnames";
import { Paragraph, ParagraphSplitter } from "./components/ParagraphSpitter";
import { moreInfoMachine } from "./workflow/more-info-machine";
import { useMachine } from "@xstate/react";
import { Story, AudioSpeed, SpeechMark } from "@/graphql/types-and-hooks";

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
    <div className="text-gray-700 font-mono relative mb-10 grid grid-cols-[2rem_1fr_2rem] xl:grid-cols-[minmax(2rem,1fr)_16rem_minmax(200px,calc(80rem-32rem))_16rem_minmax(2rem,1fr)] lg:grid-cols-[2rem_minmax(200px,calc(100%-16rem))_16rem_2rem] min-h-screen">
      <div className="bg-white col-[2]  row[3] lg:col-[2] lg:row-[1] xl:col-[3] xl:row-[2]">
        <div className="overflow-auto p-8 mb-8 divide-y divide-dashed ">
          <div className="text-sm leading-4 mb-2">
            Voice: Bianca
            <br />
            Theme: Random
          </div>
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
        <aside className="max-h-screen sticky top-12 col-[2] row-[4] xl:col-[4] xl:row-[2] lg:col[-2] lg:row-[2/2_span] pr-4 sm:pr-6 lg:border-l lg:border-gray-200 lg:pr-8 xl:pr-0">
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
