"use client"

import { NextPage } from "next";
import React, { useRef } from "react";
import classNames from "classnames";

import { useState, useEffect } from 'react'

import { AudioPlayer } from "../components/AudioPlayer";

type StoryParagraphItemType = "sentence" | "word";

interface Mark {
  time: number;
  start: number;
  value: string;
  type: StoryParagraphItemType;
}

interface StoryParagraphItem {
  value: string;
  time: number;
  type: StoryParagraphItemType;
  playing?: boolean;
}

type StoryParagraph = StoryParagraphItem[]

const StoryPage: NextPage = () => {

  const [storyMarks, setStoryMarks] = useState([] as Mark[]);
  const [parsedText, setParsedText] = useState([] as StoryParagraph[]);
  const [storyParagraphIndexes, setStoryParagraphIndexes] = useState(new Set() as Set<number>);

  const audioRef = useRef();

  useEffect(() => {

    function getParagraphByteIndices(text: string): Set<number> {
      const byteIndices: number[] = [];
      let byteOffset = 0;

      text.split('').forEach((char) => {
        const byteSize = Buffer.byteLength(char);
        byteOffset += byteSize;
        if (char == '\n') {
          byteIndices.push(byteOffset);
        }
      });

      return new Set(byteIndices);
    }

    const fetchData = async () => {
      try {
        const marksResponse = await fetch('/story.marks');
        const marksData = await marksResponse.text();
        const marksJson = marksData
          .split('\n')
          .filter(line => line.trim() !== '')
          .map(line => JSON.parse(line));
        setStoryMarks(marksJson);

        const textResponse = await fetch('/story.txt');
        const textData = await textResponse.text();

        setStoryParagraphIndexes(getParagraphByteIndices(textData));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {

    const parseText = (renderType: StoryParagraphItemType): StoryParagraph[] => {
      return storyMarks
        .filter(mark => mark.type == renderType)
        .reduce<StoryParagraph[]>((result: StoryParagraph[], mark, index, marks) => {
          let paragraph: StoryParagraph;
          if (storyParagraphIndexes.has(mark.start) || result.length == 0) {
            paragraph = [];
            result.push(paragraph);
          } else {
            paragraph = result[result.length - 1];
          }
          paragraph.push(mark as StoryParagraphItem);
          return result;
        }, []);
    };

    const renderType = "word";
    setParsedText(parseText(renderType));
  }, [storyMarks]);

  const textSelectedOnTime = (time: number) => {
    audioRef.current.updateTime(time);
  };

  const audioPlayerTimeUpdated = (time: number) => {
    setParsedText((currentParsedText) => {
      return currentParsedText.map(paragraph => {
        return paragraph.map(paragraphItem => {
          paragraphItem.playing = paragraphItem.time < time;
          return paragraphItem;
        });
      });
    })
  }

  const textElements = parsedText.map((paragraph, paragraphIndex) => (
    <p key={'p-' + paragraphIndex}>
      {paragraph.map((word, index) => (
        <span
          className={classNames({
            "cursor-pointer": true,
            "underline": word.playing,
          })}
          key={'it-' + paragraphIndex + '' + index}
          onClick={() => textSelectedOnTime(word.time)}>{word.value} </span>
      ))}
    </p>
  ));

  return (
    <div>
      <div className="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
        <div className="flex flex-col justify-center overflow-hidden bg-blue-500" role="progressbar" style={{"width": "25%"}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
      <div className="grid grid-cols-2 gap-10">
        <div className="text-base text-base/7 whitespace-pre-line pt-7">
          {textElements}
        </div>
        <div className="text-base text-base/7 whitespace-pre-line pt-7">
          {textElements}
        </div>
        <AudioPlayer audioSrc="/story.mp3" timeUpdated={audioPlayerTimeUpdated} ref={audioRef}></AudioPlayer>
      </div>
    </div>
  );
};

export default StoryPage;
