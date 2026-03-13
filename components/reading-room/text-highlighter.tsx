"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface TextHighlighterProps {
  text: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
}

export function TextHighlighter({ text, currentTime, duration, isPlaying }: TextHighlighterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const [highlightRatio, setHighlightRatio] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTopRef = useRef(0);

  useEffect(() => {
    if (duration > 0) {
      const ratio = currentTime / duration;
      setHighlightRatio(Math.min(Math.max(ratio, 0), 1));
    }
  }, [currentTime, duration]);

  useEffect(() => {
    if (!containerRef.current || !markerRef.current || isUserScrolling || !isPlaying) return;

    const container = containerRef.current;
    const marker = markerRef.current;
    
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
      className="h-full overflow-y-auto"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div className="leading-relaxed whitespace-pre-wrap text-2xl">
        <span className="text-yellow-400">{highlightedText}</span>
        <span ref={markerRef} className="text-gray-400">{remainingText}</span>
      </div>
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
