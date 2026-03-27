"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

type Choice = "rock" | "paper" | "scissors";
type Result = "win" | "lose" | "draw";

const choices: { id: Choice; emoji: string; name: { zh: string; en: string } }[] = [
  { id: "rock", emoji: "🪨", name: { zh: "石头", en: "Rock" } },
  { id: "paper", emoji: "📄", name: { zh: "布", en: "Paper" } },
  { id: "scissors", emoji: "✂️", name: { zh: "剪刀", en: "Scissors" } },
];

function determineWinner(player: Choice, computer: Choice): Result {
  if (player === computer) return "draw";
  if (
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper")
  ) {
    return "win";
  }
  return "lose";
}

export default function RockPaperScissorsGame() {
  const searchParams = useSearchParams();
  const mkt = searchParams.get("mkt");
  const isZh = mkt === "cn";

  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [score, setScore] = useState({ wins: 0, draws: 0, losses: 0 });

  const play = (choice: Choice) => {
    const computer = choices[Math.floor(Math.random() * choices.length)].id;
    const gameResult = determineWinner(choice, computer);

    setPlayerChoice(choice);
    setComputerChoice(computer);
    setResult(gameResult);

    setScore(prev => {
      const newScore = { ...prev };
      if (gameResult === "win") newScore.wins++;
      else if (gameResult === "draw") newScore.draws++;
      else newScore.losses++;
      return newScore;
    });
  };

  const reset = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
  };

  const getResultText = () => {
    if (!result) return "";
    if (isZh) {
      if (result === "win") return "🎉 你赢了！";
      if (result === "lose") return "😔 你输了";
      return "🤝 平局";
    } else {
      if (result === "win") return "You Win!";
      if (result === "lose") return "You Lose";
      return "It's a Draw";
    }
  };

  const getResultColor = () => {
    if (result === "win") return "text-green-500";
    if (result === "lose") return "text-red-500";
    return "text-yellow-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-indigo-600 dark:text-indigo-300">
            🪨📄✂️ {isZh ? "石头剪刀布" : "Rock Paper Scissors"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {isZh ? "经典猜拳游戏" : "Classic Hand Game"}
          </p>
        </div>

        {/* Score Board */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl p-4 mb-6 shadow-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-green-600 font-bold text-2xl">{score.wins}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{isZh ? "胜" : "Wins"}</div>
            </div>
            <div>
              <div className="text-yellow-600 font-bold text-2xl">{score.draws}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{isZh ? "平" : "Draws"}</div>
            </div>
            <div>
              <div className="text-red-600 font-bold text-2xl">{score.losses}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{isZh ? "负" : "Losses"}</div>
            </div>
          </div>
        </div>

        {/* Result Display */}
        {playerChoice && computerChoice && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl p-6 mb-6 shadow-lg text-center">
            <div className="flex justify-around items-center mb-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{isZh ? "你出" : "You"}</div>
                <div className="text-6xl">{choices.find(c => c.id === playerChoice)?.emoji}</div>
                <div className="mt-1 font-medium">{choices.find(c => c.id === playerChoice)?.name[isZh ? "zh" : "en"]}</div>
              </div>
              <div className="text-2xl font-bold">VS</div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{isZh ? "电脑" : "Computer"}</div>
                <div className="text-6xl">{choices.find(c => c.id === computerChoice)?.emoji}</div>
                <div className="mt-1 font-medium">{choices.find(c => c.id === computerChoice)?.name[isZh ? "zh" : "en"]}</div>
              </div>
            </div>
            <div className={`text-2xl font-bold ${getResultColor()}`}>
              {getResultText()}
            </div>
          </div>
        )}

        {/* Choices */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl p-6 shadow-lg">
          <h3 className="text-center font-bold text-lg mb-4 text-gray-700 dark:text-gray-200">
            {isZh ? "选择你的出拳" : "Choose your move"}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {choices.map(choice => (
              <button
                key={choice.id}
                onClick={() => play(choice.id)}
                className="aspect-square flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-800 dark:to-indigo-700 hover:from-indigo-200 hover:to-indigo-300 dark:hover:from-indigo-700 dark:hover:to-indigo-600 transition-all active:scale-95 shadow hover:shadow-lg"
              >
                <span className="text-4xl mb-1">{choice.emoji}</span>
                <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">
                  {choice.name[isZh ? "zh" : "en"]}
                </span>
              </button>
            ))}
          </div>

          {playerChoice && (
            <div className="mt-4">
              <button
                onClick={reset}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-full transition-transform active:scale-95"
              >
                🔄 {isZh ? "再来一局" : "Play Again"}
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          {isZh ? "和电脑对战，看看谁赢的次数多！" : "Play against the computer, see who wins more!"}
        </div>
      </div>
    </div>
  );
}
