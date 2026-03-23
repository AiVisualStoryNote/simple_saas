import { Character, CharacterSprite } from "../types/index";

export function resolveCharacterSprite(
  character: Character,
  override?: CharacterSprite | null,
): CharacterSprite | null {
  if (!character.sprite && !override) return null;
  return {
    ...(character.sprite ?? {}),
    ...(override ?? {}),
  } as CharacterSprite;
}

export function clampSpriteConfig(sprite: CharacterSprite): CharacterSprite {
  const clampPercent = (value: number, fallback: number) => {
    const safeValue = Number.isFinite(value) ? value : fallback;
    return Math.max(0, Math.min(100, safeValue));
  };

  const startXPercent = clampPercent(sprite.startXPercent ?? 0, 0);
  const startYPercent = clampPercent(sprite.startYPercent ?? 0, 0);
  const endXPercent = Math.max(startXPercent + 0.1, clampPercent(sprite.endXPercent ?? 100, 100));
  const endYPercent = Math.max(startYPercent + 0.1, clampPercent(sprite.endYPercent ?? 100, 100));

  return {
    ...sprite,
    src: sprite.src || "",
    startXPercent,
    startYPercent,
    endXPercent,
    endYPercent,
    rowEndXPercent: Math.max(endXPercent, clampPercent(sprite.rowEndXPercent ?? endXPercent, endXPercent)),
    frameStepXPercent: Math.max(0.1, Number.isFinite(sprite.frameStepXPercent) ? sprite.frameStepXPercent : 1),
    frameStepYPercent: Math.max(0.1, Number.isFinite(sprite.frameStepYPercent) ? sprite.frameStepYPercent : 1),
    frameDurationMs: Math.max(16, Number.isFinite(sprite.frameDurationMs) ? sprite.frameDurationMs : 100),
    renderWidth: Math.max(8, Number.isFinite(sprite.renderWidth) ? sprite.renderWidth : 80),
    renderHeight: Math.max(8, Number.isFinite(sprite.renderHeight) ? sprite.renderHeight : 52),
  };
}

export function getSpriteSheetMetrics(sprite: CharacterSprite) {
  const frameWidthPercent = Math.max(0.1, sprite.endXPercent - sprite.startXPercent);
  const frameHeightPercent = Math.max(0.1, sprite.endYPercent - sprite.startYPercent);
  const columns = Math.max(1, Math.floor((sprite.rowEndXPercent - sprite.startXPercent) / sprite.frameStepXPercent) + 1);
  const rows = Math.max(1, Math.floor((100 - sprite.endYPercent) / sprite.frameStepYPercent) + 1);
  const frameCount = Math.max(1, columns * rows);

  return {
    frameWidthPercent,
    frameHeightPercent,
    columns,
    rows,
    frameCount,
  };
}

export function getSpriteFrameSource(
  sprite: CharacterSprite,
  frameIndex: number,
  imageWidth: number,
  imageHeight: number,
) {
  const metrics = getSpriteSheetMetrics(sprite);
  const safeFrame = (((Math.floor(frameIndex) % metrics.frameCount) + metrics.frameCount) % metrics.frameCount);
  const columnIndex = safeFrame % metrics.columns;
  const rowIndex = Math.floor(safeFrame / metrics.columns);
  const sourceXPercent = sprite.startXPercent + columnIndex * sprite.frameStepXPercent;
  const sourceYPercent = sprite.startYPercent + rowIndex * sprite.frameStepYPercent;

  return {
    frameIndex: safeFrame,
    sourceX: (sourceXPercent / 100) * imageWidth,
    sourceY: (sourceYPercent / 100) * imageHeight,
    sourceWidth: ((sprite.endXPercent - sprite.startXPercent) / 100) * imageWidth,
    sourceHeight: ((sprite.endYPercent - sprite.startYPercent) / 100) * imageHeight,
  };
}

export function getSpriteRenderSize(sprite: CharacterSprite) {
  return {
    width: sprite.renderWidth,
    height: sprite.renderHeight,
  };
}
