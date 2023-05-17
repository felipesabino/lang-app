"use client";

import { TextSelectionObserver, SelectionInfo } from "./components/TextSelectionObserver";
import { useState } from "react";
import classNames from "classnames";
import { TextContext } from "../api/story/text-context/[slug]/route";
import { Paragraph, ParagraphSplitter } from "./components/ParagraphSpitter";
import { moreInfoMachine } from "./workflow/more-info-machine";
import { useMachine } from "@xstate/react";

interface Mark {
  type: "word" | "sentence";
  time: number;
  start: number;
  end: number;
  value: string;
}

export interface Story {
  text: string;
  translation: string;
  marks: Mark[];
  audio: string;
}

export interface StoryTextBlockProps {
  story: Story;
  timeElapsed: number;
}

export const StoryTextBlock: React.FC<StoryTextBlockProps> = ({ story, timeElapsed }) => {
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

  const marks = story.marks.filter((mark) => mark.type === "word");

  const toRender = {
    text: ParagraphSplitter(story.text),
    translation: ParagraphSplitter(story.translation),
    mark: marks.findLast((mark) => mark.time < timeElapsed),
  };

  const renderDecoratedText = (paragraph: Paragraph, mark: Mark | undefined) => {
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
    <div className="columns-2 gap-8 p-4 mb-16">
      <div className="overflow-auto p-8 bg-slate-50 rounded-xl  mb-8 divide-y divide-dashed">
        {toRender.text.map((item, index) => (
          <div key={"p-" + index}>
            <TextSelectionObserver onButtonClick={getSelectedTextInfo}>
              {renderDecoratedText(item, toRender.mark)}
            </TextSelectionObserver>
            <details className="pb-2">
              <summary className="text-sm leading-6 text-slate-900font-semibold select-none hover:cursor-help">
                Translation
              </summary>
              <p className="mt-2 text-sm leading-6 text-slate-600 italic">{toRender.translation[index].text}</p>
            </details>
          </div>
        ))}
      </div>
      <div className=" overflow-auto p-8 bg-slate-50 rounded-xl mb-8">
        {state.matches("idle") && (
          <p className="text-gray-800">Select some text if you want to see more information about it</p>
        )}
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
    </div>
  );
};
