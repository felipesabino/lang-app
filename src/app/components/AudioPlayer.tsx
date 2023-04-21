"use client"

import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { PlayIcon, ForwardIcon, BackwardIcon, PauseIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';

interface AudioPlayerProps {
  audioSrc: string;
  timeUpdated?: (timeInMilliSeconds: number) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = forwardRef(({ audioSrc, timeUpdated }, ref) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  useImperativeHandle(ref, () => ({
    updateTime(timeInMilliSeconds: number) {
      // @ts-ignore
      audio.currentTime = Math.max((timeInMilliSeconds - 200)/ 1000, 0);
    }
  }));

  useEffect(() => {
    const audioObj = new Audio(audioSrc);
    setAudio(audioObj);

    audioObj.ontimeupdate = () => {
      setCurrentTime(audioObj.currentTime);
      timeUpdated && timeUpdated(Math.floor(audioObj.currentTime * 1000));
    };

    audioObj.onloadedmetadata = () => {
      setAudioDuration(audioObj.duration);
    };

    return () => {
      audioObj.pause();
      setAudio(null);
    };
  }, [audioSrc]);

  const play = () => audio?.play();
  const pause = () => audio?.pause();
  const forward = () => {
    if (audio) {
      audio.currentTime = Math.min(audio.currentTime + 10, audioDuration);
    }
  };
  const backward = () => {
    if (audio) {
      audio.currentTime = Math.max(audio.currentTime - 10, 0);
    }
  };

  const progressPercentage = (currentTime / audioDuration) * 100;

  return (
    <div className="fixed bottom-0 h-12 w-full flex items-center justify-center bg-white border-t-2 border-gray-300">
      <a href="#" onClick={backward}><BackwardIcon className='h-6 w-6 text-blue-500'/></a>
      <a href="#" onClick={play}><PlayIcon className={classNames({
        'h-6 w-6': true,
        'text-blue-500': audio?.paused,
        'text-gray-300': !audio?.paused
      })}/></a>
      <a href='#' onClick={pause}><PauseIcon className={classNames({
        'h-6 w-6': true,
        'text-blue-500': !audio?.paused,
        'text-gray-300': audio?.paused
      })}/></a>
      <a href='#' onClick={forward}><ForwardIcon className='h-6 w-6 text-blue-500'/></a>
      <p>Duration: {audioDuration.toFixed(2)} seconds</p>
      <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '5px', backgroundColor: 'black' }}>
        <div style={{ width: `${progressPercentage}%`, height: '100%', backgroundColor: 'red' }}></div>
      </div>
    </div>
  );
});