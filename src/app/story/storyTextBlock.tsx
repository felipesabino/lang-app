"use client"

import { TextSelectionObserver, SelectionInfo } from "../components/TextSelectionObserver";
import { useState } from "react";
import classNames from 'classnames'
import { TextContext } from "../api/story/text-context/[slug]/route";

export interface Story {
  text: string;
  translation: string;
  marks: any[];
  audio: string;
}

export interface StoryTextBlockProps {
  story: Story;
}

export const StoryTextBlock: React.FC<StoryTextBlockProps> = (({ story }) => {

  const [selectedText, setSelectedText] = useState('');
  const [textExplanationIsLoading, setTextExplanationIsLoading] = useState(false);
  const [textExplanation, setTextExplanation] = useState<TextContext>({
    text: '',
    explanation: '',
  });

  const toRender = story.text.split("\n").flatMap((paragraph, index) => {
    if (paragraph.trim().length === 0) return [];
    return [{ text: paragraph, translation: story.translation.split("\n")[index] }];
  });

  async function onButtonClick(selectionInfo: SelectionInfo) {
    // @ts-ignore
    setSelectedText(selectionInfo.selectedText);
    setTextExplanationIsLoading(true);
    await fetch(`/api/story/text-context/${selectionInfo.selectedText}`)
      .then(response => response.json())
      .then(data => {
        setTextExplanation(data);
        setTextExplanationIsLoading(false);
      });
  };

  return (
    <div className="columns-2 gap-10 p-8 bg-slate-50 rounded-xl  dark:bg-slate-800/25">
      <div className="overflow-auto">
       {toRender.map((item, index) =>
          <div key={"p-" + index}>
            <TextSelectionObserver onButtonClick={onButtonClick} >
              <p className="text-base/7 whitespace-pre-line">
                {item.text}
              </p>
            </TextSelectionObserver>
            <details className=" ">
              <summary className="text-sm leading-6 text-slate-900 dark:text-white font-semibold select-none hover:cursor-help">Translation</summary>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400 italic">
                {item.translation}
              </p>
            </details>
          </div>
        )}
      </div>
      <div>
        <div className={classNames({
          'pt-4': true,
          'px-8': true,
          'hidden': selectedText.length > 0,
        })}>
          <p className="text-gray-800 dark:text-gray-400">
            Select some text if you want to see more information about it
          </p>
        </div>
        <div className={classNames({
          'pt-4': true,
          'px-8': true,
          'hidden': selectedText.length === 0,
        })}>
          <p className="text-gray-800 dark:text-gray-400">
            Selected text: "{selectedText}"
          </p>
        </div>
        <div className={classNames({
          'pt-4': true,
          'px-8': true,
          'hidden': !textExplanationIsLoading,
          'animate-pulse': true,
        })}>
          <p className="text-gray-800 dark:text-gray-400">
            Building explanation...
          </p>
        </div>
        <div className={classNames({
          'pt-4 px-8 text-gray-800 dark:text-gray-400': true,
          'px-8': true,
          'hidden': textExplanationIsLoading,
        })}>
            {textExplanation.explanation.split("\n").map((paragraph, index) =>
              <p key={index}>{paragraph}</p>
            )}
      </div>
    </div>
  </div>
  );
});
