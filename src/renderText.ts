import { CanvasRenderingContext2D } from "canvas";
import { palette } from "./palette";
import { applyModifiers } from "./applyModifiers";
import {
  BACKGROUND_HORIZONTAL_MARGIN,
  BACKGROUND_VERTICAL_MARGIN,
  TERMINAL_HORIZONTAL_MARGIN,
  TERMINAL_VERTICAL_MARGIN,
} from "./style";

export const renderText = (context: CanvasRenderingContext2D, text: string) => {
  context.font = "20px Fira Code Regular";
  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillStyle = palette.white;

  const textMeasurements = context.measureText(text);
  const height =
    textMeasurements.actualBoundingBoxAscent +
    textMeasurements.actualBoundingBoxDescent;

  const leftPosition =
    BACKGROUND_HORIZONTAL_MARGIN + TERMINAL_HORIZONTAL_MARGIN;
  const lineHeight = height / text.split("\n").length;

  const withModifiers = text.split(/(\x1B.+?m)/);
  let offsetX = leftPosition;
  let offsetY = BACKGROUND_VERTICAL_MARGIN + TERMINAL_VERTICAL_MARGIN;
  let background: string | null = null;

  withModifiers.forEach((chunk) => {
    if (chunk.startsWith("\x1B")) {
      background = applyModifiers(context, chunk) ?? null;
    } else {
      const lines = chunk.split("\n");
      lines.forEach((line, index) => {
        const { width } = context.measureText(line);

        if (background) {
          context.save();
          context.fillStyle = background;
          context.fillRect(
            offsetX,
            Math.round(offsetY),
            width,
            Math.round(lineHeight),
          );
          context.restore();
        }

        context.fillText(line, offsetX, offsetY);

        if (index === lines.length - 1) {
          offsetX += width;
        } else {
          offsetX = leftPosition;
          offsetY += lineHeight;
        }
      });
    }
  });
};
