import { CanvasRenderingContext2D } from "canvas";
import { TERMINAL_BORDER_RADIUS } from "./style";
import { renderBackgroundGradient } from "./renderBackgroundGradient";

export const renderTerminal = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  context.save();

  context.shadowColor = "rgba(0, 0, 0, .45)";
  context.shadowOffsetY = 30;
  context.shadowBlur = 35;

  const gradient = renderBackgroundGradient(context, width, height);
  context.fillStyle = gradient;

  context.beginPath();
  context.moveTo(x + TERMINAL_BORDER_RADIUS, y);
  context.lineTo(x + width - TERMINAL_BORDER_RADIUS, y);
  context.quadraticCurveTo(x + width, y, x + width, y + TERMINAL_BORDER_RADIUS);
  context.lineTo(x + width, y + height - TERMINAL_BORDER_RADIUS);
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - TERMINAL_BORDER_RADIUS,
    y + height,
  );
  context.lineTo(x + TERMINAL_BORDER_RADIUS, y + height);
  context.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - TERMINAL_BORDER_RADIUS,
  );
  context.lineTo(x, y + TERMINAL_BORDER_RADIUS);
  context.quadraticCurveTo(x, y, x + TERMINAL_BORDER_RADIUS, y);
  context.closePath();
  context.fill();

  context.restore();
  context.save();

  context.fillStyle = "#000000";
  context.globalAlpha = 0.6;

  context.beginPath();
  context.moveTo(x + TERMINAL_BORDER_RADIUS, y);
  context.lineTo(x + width - TERMINAL_BORDER_RADIUS, y);
  context.quadraticCurveTo(x + width, y, x + width, y + TERMINAL_BORDER_RADIUS);
  context.lineTo(x + width, y + height - TERMINAL_BORDER_RADIUS);
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - TERMINAL_BORDER_RADIUS,
    y + height,
  );
  context.lineTo(x + TERMINAL_BORDER_RADIUS, y + height);
  context.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - TERMINAL_BORDER_RADIUS,
  );
  context.lineTo(x, y + TERMINAL_BORDER_RADIUS);
  context.quadraticCurveTo(x, y, x + TERMINAL_BORDER_RADIUS, y);
  context.closePath();
  context.fill();

  context.restore();
};
