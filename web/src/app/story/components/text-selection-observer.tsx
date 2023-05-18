import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Popover } from "./imported/react-text-selection-popover";

export interface SelectionInfo {
  selectedText: string;
  startOffset: number;
  endOffset: number;
}

interface TextSelectionObserverProps {
  children: React.ReactNode;
  onButtonClick?: (selectionInfo: SelectionInfo) => void;
}
export const TextSelectionObserver: React.FC<TextSelectionObserverProps> = ({ children, onButtonClick }) => {
  const [ref, setRef] = useState<HTMLElement>();

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
      <div ref={(el) => el != null && setRef(el)}>{children}</div>
      <Popover
        mount={ref}
        target={ref}
        render={({ clientRect, isCollapsed, textContent }) => {
          if (clientRect == null || isCollapsed || !ref) return null;

          const popoverWidth = 44;
          const popoverHeight = 44;
          const tooltipArrowHeight = 7; // 7px === arrow in the bootom
          // HACK as positions get crazy due to the header sticky,
          // not sure how to get actual offset without hardcoding
          // either the valur or geting the header dimension  🤷‍♂️
          const headerOffset = 74;

          const selection = window.getSelection();
          if (!selection || selection.rangeCount === 0) return null;
          const range = selection.getRangeAt(0);
          const rects = range.getClientRects();
          if (rects.length === 0) return null;
          const selectionRect = rects[rects.length - 1]; // to get the last box and position the tooltip on top of the last char

          const leftPosition = Math.floor(selectionRect.right - popoverWidth / 2) + "px";
          const topPosition =
            selectionRect.top + window.scrollY - headerOffset - popoverHeight - tooltipArrowHeight + "px";

          return (
            <div>
              <div
                className="py-2 px-2 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                style={{
                  position: "absolute",
                  textAlign: "center",
                  left: leftPosition,
                  top: topPosition,
                }}
              >
                <button
                  onClick={() => {
                    if (textContent) handleClick(textContent);
                  }}
                >
                  <img src="/icons/info.svg" className="w-7 h-7" />
                </button>
                <div className="tooltip-arrow-down" />
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};
