import { CanvasRenderingContext2D } from "canvas";
import { palette } from "./palette";

export const applyModifiers = (
  context: CanvasRenderingContext2D,
  modifier: string,
) => {
  const parsedModifiers = modifier.match(/(\d+;?)+/);
  const modifiers = parsedModifiers ? parsedModifiers[0].split(";") : [];

  const backgrounds = modifiers.map((modifier) => {
    switch (modifier) {
      case "0":
        context.font = "20px Fira Code Regular";
        context.fillStyle = palette.white;
        break;
      case "01":
      case "1":
        context.font = "20px Fira Code Bold";
        break;
      case "30":
        context.fillStyle = palette.black;
        break;
      case "31":
        context.fillStyle = palette.red;
        break;
      case "32":
        context.fillStyle = palette.green;
        break;
      case "33":
        context.fillStyle = palette.yellow;
        break;
      case "34":
        context.fillStyle = palette.blue;
        break;
      case "35":
        context.fillStyle = palette.magenta;
        break;
      case "36":
        context.fillStyle = palette.cyan;
        break;
      case "37":
        context.fillStyle = palette.white;
        break;
      case "40":
        return palette.black;
        break;
      case "41":
        return palette.red;
        break;
      case "42":
        return palette.green;
        break;
      case "43":
        return palette.yellow;
        break;
      case "44":
        return palette.blue;
        break;
      case "45":
        return palette.magenta;
        break;
      case "46":
        return palette.cyan;
        break;
      case "47":
        return palette.white;
        break;
    }
  });

  return backgrounds[backgrounds.length - 1];
};
