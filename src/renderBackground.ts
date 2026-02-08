import { CanvasRenderingContext2D } from "canvas";
import { renderBackgroundGradient } from "./renderBackgroundGradient";

export const renderBackground = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
) => {
  const gradient = renderBackgroundGradient(context, width, height);

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
};
