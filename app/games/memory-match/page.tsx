"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "./components/Card";
import { shuffleCards } from "./utils/shuffle";

const emojis = [
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
  "🦁", "🐯", "🐨", "🐵", "🐮", "🐷", "🐸", "🐔",
];

interface CardType {
  id: number;
  content: string;
  flipped: boolean;
  matched: boolean;
}

export default function MemoryMatchGame() {
  const searchParams = useSearchParams();
  const mkt = searchParams.get("mkt");
  const isZh = mkt === "cn";

  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [pairsMatched, setPairsMatched] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const totalPairs = 8; // 4x4 grid = 16 cards = 8 pairs

  const initGame = () => {
    const selectedEmojis = emojis.slice(0, totalPairs);
    const gameEmojis = [...selectedEmojis, ...selectedEmojis];
    const shuffled = shuffleCards(gameEmojis).map((content, index) => ({
      id: index,
      content,
      flipped: false,
      matched: false,
    }));
    setCards(shuffled);
    setFlippedIds([]);
    setPairsMatched(0);
    setMoves(0);
    setGameWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const flipCard = (id: number) => {
    if (gameWon) return;
    if (flippedIds.length >= 2) return;
    if (cards[id].flipped || cards[id].matched) return;

    const newCards = [...cards];
    newCards[id] = { ...newCards[id], flipped: true };
    setCards(newCards);

    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);

    // Check match when two cards flipped
    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].content === cards[second].content) {
        // Match found
        newCards[first] = { ...newCards[first], matched: true };
        newCards[second] = { ...newCards[second], matched: true };
        setCards(newCards);
        setPairsMatched(pairsMatched + 1);
        setFlippedIds([]);

        // Check win
        if (pairsMatched + 1 === totalPairs) {
          setGameWon(true);
        }
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          newCards[first] = { ...newCards[first], flipped: false };
          newCards[second] = { ...newCards[second], flipped: false };
          setCards(newCards);
          setFlippedIds([]);
        }, 800);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold mb-2 text-purple-600 dark:text-purple-300">
            🃏 {isZh ? "记忆翻牌" : "Memory Match"}
          </h1>
          <p className="text-purple-500 dark:text-purple-300">
            {isZh ? "找出所有配对" : "Find all matching pairs"}
          </p>
        </div>

        <div className="flex justify-between items-center mb-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg p-3">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{isZh ? "步数" : "Moves"}</div>
            <div className="font-bold text-xl">{moves}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{isZh ? "配对" : "Pairs"}</div>
            <div className="font-bold text-xl">{pairsMatched} / {totalPairs}</div>
          </div>
          <button
            onClick={initGame}
            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg font-medium"
          >
            🔄 {isZh ? "重来" : "Restart"}
          </button>
        </div>

        {gameWon && (
          <div className="mb-4 text-center">
            <div className="inline-block bg-green-100 dark:bg-green-900/50 px-6 py-3 rounded-full">
              <span className="font-bold text-xl text-green-600 dark:text-green-400">
                🎉 {isZh ? `恭喜完成！用了 ${moves} 步` : "You Won! Completed in " + moves + " moves"}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-3 bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
          {cards.map(card => (
            <Card
              key={card.id}
              content={card.content}
              flipped={card.flipped || card.matched}
              matched={card.matched}
              onClick={() => flipCard(card.id)}
            />
          ))}
        </div>

        <div className="mt-4 text-center text-sm text-purple-600 dark:text-purple-400">
          {isZh ? "点击卡片翻开，找出相同的一对" : "Click to flip cards, find matching pairs"}
        </div>
      </div>
    </div>
  );
}
