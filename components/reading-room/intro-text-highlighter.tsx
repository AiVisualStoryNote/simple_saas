"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface IntroTextHighlighterProps {
  text: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  highlightedClassName?: string;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}

export function IntroTextHighlighter({ text, currentTime, duration, isPlaying, highlightedClassName = "text-primary", scrollContainerRef }: IntroTextHighlighterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const [highlightRatio, setHighlightRatio] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTopRef = useRef(0);

  const getScrollContainer = () => {
    if (scrollContainerRef?.current) {
      return scrollContainerRef.current;
    }
    return containerRef.current;
  };

  useEffect(() => {
    if (duration > 0) {
      const ratio = currentTime / duration;
      setHighlightRatio(Math.min(Math.max(ratio, 0), 1));
    }
  }, [currentTime, duration]);

  useEffect(() => {
    if (!markerRef.current || isUserScrolling || !isPlaying) return;

    const container = getScrollContainer();
    const marker = markerRef.current;
    
    if (!container || !marker) return;
    
    requestAnimationFrame(() => {
      if (!container || !marker) return;

      const containerHeight = container.clientHeight;
      const scrollableDistance = container.scrollHeight - containerHeight;

      if (scrollableDistance <= 0) return;

      const containerRect = container.getBoundingClientRect();
      const markerRect = marker.getBoundingClientRect();

      const markerTopInContainer = markerRect.top - containerRect.top + container.scrollTop;
      
      const targetScrollTop = markerTopInContainer - (containerHeight / 3);
      const clampedScrollTop = Math.max(0, Math.min(targetScrollTop, scrollableDistance));
      
      container.scrollTo({
        top: clampedScrollTop,
        behavior: "smooth",
      });
    });
  }, [highlightRatio, isPlaying, isUserScrolling]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollTop = e.currentTarget.scrollTop;
    
    if (Math.abs(currentScrollTop - lastScrollTopRef.current) > 5) {
      setIsUserScrolling(true);
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false);
      }, 1500);
    }
    
    lastScrollTopRef.current = currentScrollTop;
  }, []);

  const highlightIndex = Math.floor(text.length * highlightRatio);
  const highlightedText = text.slice(0, highlightIndex);
  const remainingText = text.slice(highlightIndex);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`leading-relaxed whitespace-pre-wrap ${!scrollContainerRef ? 'h-full overflow-y-auto pr-2' : ''}`}
      style={{
        scrollbarWidth: "thin",
        msOverflowStyle: "none",
      }}
    >
      <span className={highlightedClassName}>{highlightedText}</span>
      <span ref={markerRef}>{remainingText}</span>
      {!scrollContainerRef && (
        <style jsx>{`
          div::-webkit-scrollbar {
            width: 4px;
          }
          div::-webkit-scrollbar-track {
            background: transparent;
          }
          div::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 2px;
          }
        `}</style>
      )}
    </div>
  );
}