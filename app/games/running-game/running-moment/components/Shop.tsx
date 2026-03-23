"use client";

import { useState } from "react";
import { ITEMS_SHOP, CHARACTERS } from "../constants";
import { getProgress, spendCoins, unlockCharacter, purchaseItem } from "../utils/storage";
import { X, Check, Lock } from "lucide-react";

interface ShopProps {
  isZh: boolean;
  onClose: () => void;
}

export function Shop({ isZh, onClose }: ShopProps) {
  const [progress, setProgress] = useState(getProgress());
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleBuyItem = (item: typeof ITEMS_SHOP[0]) => {
    if (progress.totalCoins >= item.cost) {
      const success = spendCoins(item.cost);
      if (success) {
        purchaseItem(item.type);
        setProgress(getProgress());
        setMessage({ type: 'success', text: isZh ? `购买成功！${item.icon}` : `Purchased! ${item.icon}` });
        setTimeout(() => setMessage(null), 2000);
      }
    } else {
      setMessage({ type: 'error', text: isZh ? "金币不足！" : "Not enough coins!" });
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const handleBuyCharacter = (character: typeof CHARACTERS[0]) => {
    if (progress.totalCoins >= character.unlockCost) {
      const success = spendCoins(character.unlockCost);
      if (success) {
        unlockCharacter(character.id);
        setProgress(getProgress());
        setMessage({ type: 'success', text: isZh ? `解锁成功！${character.icon}` : `Unlocked! ${character.icon}` });
        setTimeout(() => setMessage(null), 2000);
      }
    } else {
      setMessage({ type: 'error', text: isZh ? "金币不足！" : "Not enough coins!" });
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const isCharacterUnlocked = (id: string) => progress.charactersUnlocked.includes(id);
  const hasItem = (type: string) => progress.itemsOwned.includes(type as any);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-purple-900 to-purple-700 p-6 rounded-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isZh ? "商店" : "Shop"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6 bg-white/10 rounded-xl py-3">
          <span className="text-2xl">🪙</span>
          <span className="text-2xl font-bold text-yellow-400">{progress.totalCoins}</span>
          <span className="text-white/70">{isZh ? "金币" : "coins"}</span>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-xl text-center font-medium ${
            message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              {isZh ? "道具" : "Items"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ITEMS_SHOP.map((item) => {
                const owned = hasItem(item.type);
                return (
                  <div
                    key={item.type}
                    className={`bg-white/10 rounded-xl p-3 flex flex-col items-center ${
                      owned ? 'opacity-50' : ''
                    }`}
                  >
                    <span className="text-3xl mb-1">{item.icon}</span>
                    <span className="text-white font-medium text-sm">
                      {isZh ? item.nameCn : item.name}
                    </span>
                    <span className="text-white/60 text-xs text-center">
                      {isZh ? item.descriptionCn : item.description}
                    </span>
                    {owned ? (
                      <div className="mt-2 flex items-center gap-1 text-green-400 text-sm">
                        <Check className="h-4 w-4" />
                        {isZh ? "已拥有" : "Owned"}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleBuyItem(item)}
                        disabled={progress.totalCoins < item.cost}
                        className="mt-2 px-4 py-1.5 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-500 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-black"
                      >
                        🪙 {item.cost}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              {isZh ? "角色" : "Characters"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CHARACTERS.filter(c => !c.isDefault).map((char) => {
                const unlocked = isCharacterUnlocked(char.id);
                return (
                  <div
                    key={char.id}
                    className={`bg-white/10 rounded-xl p-3 flex flex-col items-center ${
                      unlocked ? 'opacity-50' : ''
                    }`}
                  >
                    <span className="text-4xl mb-1">{char.icon}</span>
                    <span className="text-white font-medium">
                      {isZh ? char.nameCn : char.name}
                    </span>
                    <span className="text-white/60 text-xs">
                      {char.hp}❤️ | {char.speed}x Speed
                    </span>
                    {unlocked ? (
                      <div className="mt-2 flex items-center gap-1 text-green-400 text-sm">
                        <Check className="h-4 w-4" />
                        {isZh ? "已解锁" : "Unlocked"}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleBuyCharacter(char)}
                        disabled={progress.totalCoins < char.unlockCost}
                        className="mt-2 px-4 py-1.5 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-500 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-black"
                      >
                        🪙 {char.unlockCost}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
