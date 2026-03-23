"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Minus, Plus, RotateCcw, Save, Settings2 } from "lucide-react";
import { Character, CharacterSprite } from "../types/index";
import { SpritePreviewCanvas } from "./SpritePreviewCanvas";
import { clampSpriteConfig, getSpriteSheetMetrics } from "../utils/sprite";

interface SpriteDebugPanelProps {
  character: Character;
  sprite: CharacterSprite | null;
  defaultSprite: CharacterSprite | null;
  isZh: boolean;
  showDebugOverlay: boolean;
  onChange: (sprite: CharacterSprite) => void;
  onReset: () => void;
  onSave: (sprite: CharacterSprite) => void;
  onToggleDebugOverlay: (nextValue: boolean) => void;
}

type SpriteNumberField =
  | "startXPercent"
  | "startYPercent"
  | "endXPercent"
  | "endYPercent"
  | "rowEndXPercent"
  | "frameStepXPercent"
  | "frameStepYPercent"
  | "frameDurationMs"
  | "renderWidth"
  | "renderHeight";

type FieldConfig = {
  key: SpriteNumberField;
  labelZh: string;
  labelEn: string;
  step?: number;
};

const fieldGroups: Array<{
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  fields: FieldConfig[];
}> = [
  {
    titleZh: "帧网格",
    titleEn: "Frame Grid",
    descriptionZh: "用百分比定义第一帧区域、行尾位置以及每一帧的步长。",
    descriptionEn: "Define the first frame, row end, and step size with percentages.",
    fields: [
      { key: "startXPercent", labelZh: "起始X %", labelEn: "Start X %", step: 0.5 },
      { key: "startYPercent", labelZh: "起始Y %", labelEn: "Start Y %", step: 0.5 },
      { key: "endXPercent", labelZh: "结束X %", labelEn: "End X %", step: 0.5 },
      { key: "endYPercent", labelZh: "结束Y %", labelEn: "End Y %", step: 0.5 },
      { key: "rowEndXPercent", labelZh: "行尾X %", labelEn: "Row End X %", step: 0.5 },
      { key: "frameStepXPercent", labelZh: "步长X %", labelEn: "Step X %", step: 0.5 },
      { key: "frameStepYPercent", labelZh: "步长Y %", labelEn: "Step Y %", step: 0.5 },
      { key: "frameDurationMs", labelZh: "切换速度ms", labelEn: "Frame ms" },
    ],
  },
  {
    titleZh: "游戏显示",
    titleEn: "Game Render",
    descriptionZh: "只控制角色在游戏里的最终显示宽高，不参与精灵图切片计算。",
    descriptionEn: "Only controls in-game render size, not sprite slicing.",
    fields: [
      { key: "renderWidth", labelZh: "显示宽", labelEn: "Render W" },
      { key: "renderHeight", labelZh: "显示高", labelEn: "Render H" },
    ],
  },
];

function NumberField({
  label,
  value,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="rounded-2xl bg-slate-100 p-3">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(value - step)}
          className="rounded-xl bg-white p-2 text-slate-700 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-slate-50"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
        />
        <button
          type="button"
          onClick={() => onChange(value + step)}
          className="rounded-xl bg-white p-2 text-slate-700 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-slate-50"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </label>
  );
}

export function SpriteDebugPanel({
  character,
  sprite,
  defaultSprite,
  isZh,
  showDebugOverlay,
  onChange,
  onReset,
  onSave,
  onToggleDebugOverlay,
}: SpriteDebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [manualFrame, setManualFrame] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [copyFeedback, setCopyFeedback] = useState<"idle" | "done" | "failed">("idle");

  const safeSprite = useMemo(() => (sprite ? clampSpriteConfig(sprite) : null), [sprite]);

  useEffect(() => {
    setManualFrame(0);
    setElapsedMs(0);
    setIsPlaying(true);
  }, [character.id]);

  useEffect(() => {
    if (!safeSprite || !isPlaying) return;

    let animationFrame = 0;
    let previous = 0;

    const tick = (timestamp: number) => {
      if (!previous) previous = timestamp;
      const delta = Math.min(timestamp - previous, 32);
      previous = timestamp;
      setElapsedMs((value) => value + delta);
      animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [safeSprite, isPlaying]);

  if (!safeSprite || !defaultSprite) return null;

  const metrics = getSpriteSheetMetrics(safeSprite);
  const animatedFrame = Math.floor(elapsedMs / safeSprite.frameDurationMs) % metrics.frameCount;
  const activeFrame = isPlaying ? animatedFrame : Math.min(Math.max(manualFrame, 0), Math.max(0, metrics.frameCount - 1));

  const handleNumberChange = (key: SpriteNumberField, value: string) => {
    const nextValue = Number(value);
    onChange({
      ...safeSprite,
      [key]: Number.isFinite(nextValue) ? nextValue : 0,
    });
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(safeSprite, null, 2));
      setCopyFeedback("done");
    } catch {
      setCopyFeedback("failed");
    }

    window.setTimeout(() => {
      setCopyFeedback("idle");
    }, 1600);
  };

  return (
    <div className="fixed left-4 top-4 z-50 w-[520px] max-w-[calc(100vw-2rem)]">
      <button
        onClick={() => setIsOpen((value) => !value)}
        className="mb-3 flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-3 text-sm font-semibold text-slate-800 shadow-xl backdrop-blur"
      >
        <Settings2 className="h-4 w-4" />
        {isZh ? "帧图调试" : "Sprite Debug"}
      </button>

      {isOpen && (
        <div className="flex h-[calc(100vh-5.5rem)] max-h-[calc(100vh-5.5rem)] flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/95 p-4 shadow-2xl backdrop-blur">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isZh ? "角色帧图调试" : "Sprite Tuning"}
              </h2>
              <p className="text-sm text-slate-500">
                {isZh ? `当前角色：${character.nameCn}` : `Character: ${character.name}`}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopyJson}
                className="rounded-xl bg-sky-500 px-3 py-2 text-white transition-colors hover:bg-sky-600"
                title={isZh ? "复制当前 JSON" : "Copy current JSON"}
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={() => onSave(safeSprite)}
                className="rounded-xl bg-emerald-500 px-3 py-2 text-white transition-colors hover:bg-emerald-600"
                title={isZh ? "保存到本地" : "Save locally"}
              >
                <Save className="h-4 w-4" />
              </button>
              <button
                onClick={onReset}
                className="rounded-xl bg-slate-200 px-3 py-2 text-slate-700 transition-colors hover:bg-slate-300"
                title={isZh ? "恢复默认" : "Reset"}
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="shrink-0 space-y-3">
            <SpritePreviewCanvas sprite={safeSprite} frameIndex={activeFrame} isPlaying={isPlaying} />

            <div className="rounded-2xl bg-slate-100 p-3">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                SRC
              </label>
              <input
                value={safeSprite.src}
                onChange={(e) => onChange({ ...safeSprite, src: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              />
            </div>

            <div className="rounded-2xl bg-slate-100 p-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {isZh ? "帧控制" : "Frame Control"}
                </span>
                <button
                  onClick={() => setIsPlaying((value) => !value)}
                  className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  {isPlaying ? (isZh ? "暂停" : "Pause") : (isZh ? "播放" : "Play")}
                </button>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(0, metrics.frameCount - 1)}
                value={activeFrame}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setManualFrame(value);
                  setElapsedMs(value * safeSprite.frameDurationMs);
                  setIsPlaying(false);
                }}
                className="w-full"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                <span>{isZh ? "当前帧" : "Current"}: {activeFrame + 1}</span>
                <span>{isZh ? `自动帧数 ${metrics.frameCount}` : `Auto frames ${metrics.frameCount}`}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
            <div className="space-y-4">
              {fieldGroups.map((group) => (
                <div key={group.titleEn} className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="mb-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {isZh ? group.titleZh : group.titleEn}
                    </div>
                    <div className="mt-1 text-xs text-slate-600">
                      {isZh ? group.descriptionZh : group.descriptionEn}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {group.fields.map((field) => (
                      <NumberField
                        key={field.key}
                        label={isZh ? field.labelZh : field.labelEn}
                        value={safeSprite[field.key]}
                        step={field.step}
                        onChange={(value) => handleNumberChange(field.key, String(value))}
                      />
                    ))}
                  </div>
                </div>
              ))}

              <div className="rounded-2xl bg-slate-100 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {isZh ? "主画布调试叠层" : "Game Overlay"}
                    </div>
                    <div className="mt-1 text-xs text-slate-600">
                      {isZh ? "显示角色包围框、落地基线和实际绘制框" : "Show bounds, baseline, and draw box"}
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleDebugOverlay(!showDebugOverlay)}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                      showDebugOverlay ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-slate-300 text-slate-700 hover:bg-slate-400"
                    }`}
                  >
                    {showDebugOverlay ? (isZh ? "已开启" : "On") : (isZh ? "已关闭" : "Off")}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900 p-3 text-xs text-slate-200">
                {copyFeedback !== "idle" && (
                  <div className={`mb-2 font-semibold ${copyFeedback === "done" ? "text-emerald-300" : "text-red-300"}`}>
                    {copyFeedback === "done"
                      ? (isZh ? "已复制当前 sprite JSON" : "Copied current sprite JSON")
                      : (isZh ? "复制失败" : "Copy failed")}
                  </div>
                )}
                <div>Default: {JSON.stringify(defaultSprite)}</div>
                <div className="mt-2 break-all">Active: {JSON.stringify(safeSprite)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
