import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

export interface SelectionInfo {
  selectedText: string;
  startOffset: number;
  endOffset: number;
}

interface TextSelectionObserverProps {
  children: React.ReactNode;
  onButtonClick?: (selectionInfo: SelectionInfo) => void;
}

const DynamicPopOver = dynamic(() =>
  import('react-text-selection-popover').then((mod) => mod.Popover)
)

export const TextSelectionObserver: React.FC<TextSelectionObserverProps> = ({
  children,
  onButtonClick,
}) => {
  const [ref, setRef] = useState<HTMLElement>()

  const handleClick = (selectedText: string) => {
    const selection = window.getSelection();
    if (selection) {
      const startOffset = selection.anchorOffset;
      const endOffset = selection.focusOffset;
      if (onButtonClick) onButtonClick({ selectedText, startOffset, endOffset });
    }
  };

  return (
    <div>
      <div ref={(el) => el != null && setRef(el)}>
        {children}
      </div>
      <DynamicPopOver
        mount={ref}
        target={ref}
        render={
          ({ clientRect, isCollapsed, textContent }) => {
            if (clientRect == null || isCollapsed || !ref) return null

            console.log(clientRect, isCollapsed, ref, textContent);

            const leftPosition = Math.floor(clientRect.left + clientRect.width / 2) + 'px';
            const topPosition = (clientRect.top - 55 + window.scrollY) + 'px';

            return <div
              className='py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800'
              style= {{
                position: 'absolute',
                marginLeft: '-65px',
                textAlign: 'center',
                left: leftPosition,
                top: topPosition,
              }}
            >
              <a href='#' onClick= {() => handleClick(textContent || '')}>
                <QuestionMarkCircleIcon className='w-5 h-5 text-color-white' />
              </a>
            </div>
          }
        } />
      </div>
  );
};