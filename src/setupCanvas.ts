import { registerFont } from "canvas";

export const setupCanvas = () => {
  registerFont(`${__dirname}/FiraCode-Light.ttf`, {
    family: "Fira Code Light",
  });
  registerFont(`${__dirname}/FiraCode-Regular.ttf`, {
    family: "Fira Code Regular",
  });
  registerFont(`${__dirname}/FiraCode-Bold.ttf`, { family: "Fira Code Bold" });
};
