"use client";

import { Tube as TubeType } from "../types";
import { COLOR_LIST } from "../types";

interface TubeProps {
  tube: TubeType;
  isSelected: boolean;
  onClick: () => void;
}

const TUBE_HEIGHT = 200;
const TUBE_WIDTH = 50;
const COLOR_SIZE = 40;

export function Tube({ tube, isSelected, onClick }: TubeProps) {
  return (
    <div
      className={`relative cursor-pointer transition-all ${
        isSelected ? "scale-110 -translate-y-4" : "scale-100"
      }`}
      onClick={onClick}
    >
      <div
        className={`border-4 ${
          isSelected ? "border-blue-500" : "border-gray-400"
        } rounded-b-[30px] bg-gray-100`}
        style={{
          width: TUBE_WIDTH,
          height: TUBE_HEIGHT,
        }}
      >
        <div className="flex flex-col-reverse items-center gap-1 pt-2">
          {tube.colors.map((color, index) => (
            <div
              key={index}
              className="rounded-full"
              style={{
                width: COLOR_SIZE,
                height: COLOR_SIZE,
                backgroundColor: COLOR_LIST[color],
                border: "2px solid rgba(0,0,0,0.2)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
