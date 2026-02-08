import { createCanvas } from "canvas";
import {
  BACKGROUND_HORIZONTAL_MARGIN,
  BACKGROUND_VERTICAL_MARGIN,
  TERMINAL_HORIZONTAL_MARGIN,
  TERMINAL_VERTICAL_MARGIN,
} from "./style";
import { renderText } from "./renderText";
import { renderBackground } from "./renderBackground";
import { renderTerminal } from "./renderTerminal";
import { setupCanvas } from "./setupCanvas";

export const render = (input: string, command: string | null) => {
  setupCanvas();

  const throwableContext = createCanvas(1, 1).getContext("2d");
  throwableContext.font = "20px Fira Code Regular";

  const renderedCommand = command ? `$ ${command}\n\n` : "";

  const cleanedInput = renderedCommand + input.replace(/^\n/, "").trimEnd();

  const textWithoutModifiers = cleanedInput
    .split(/(\x1B.+?m)/)
    .filter((chunk) => !chunk.startsWith("\x1B"))
    .join("");

  const { width, ...textMeasurements } =
    throwableContext.measureText(textWithoutModifiers);
  const height =
    textMeasurements.actualBoundingBoxAscent +
    textMeasurements.actualBoundingBoxDescent;

  const canvas = createCanvas(
    width + 2 * TERMINAL_HORIZONTAL_MARGIN + 2 * BACKGROUND_HORIZONTAL_MARGIN,
    height + 2 * TERMINAL_VERTICAL_MARGIN + 2 * BACKGROUND_VERTICAL_MARGIN,
  );
  const context = canvas.getContext("2d");

  renderBackground(
    context,
    width + 2 * TERMINAL_HORIZONTAL_MARGIN + 2 * BACKGROUND_HORIZONTAL_MARGIN,
    height + 2 * TERMINAL_VERTICAL_MARGIN + 2 * BACKGROUND_VERTICAL_MARGIN,
  );

  renderTerminal(
    context,
    BACKGROUND_HORIZONTAL_MARGIN,
    BACKGROUND_VERTICAL_MARGIN,
    width + 2 * TERMINAL_HORIZONTAL_MARGIN,
    height + 2 * TERMINAL_VERTICAL_MARGIN,
  );

  renderText(context, cleanedInput);

  return canvas.toBuffer("image/png");
};
