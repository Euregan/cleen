import { CanvasRenderingContext2D } from "canvas";

export const renderBackgroundGradient = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
) => {
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#88c0d0");
  gradient.addColorStop(1, "#5e81ac");

  return gradient;
};
