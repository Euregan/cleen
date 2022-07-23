#!/usr/bin/env node

const fs = require("fs");
const { createCanvas, registerFont } = require("canvas");
const argv = require("minimist")(process.argv.slice(2));

// The user didn't specify the target image
if (!argv._[0]) {
  console.error("You need to specify the image to output to");
  console.error("For example: npx cleen image.png");
  process.exit(1);
}

const palette = {
  black: "#151515",
  red: "#a53c23",
  green: "#7b9246",
  yellow: "#d3a04d",
  blue: "#6c99bb",
  magenta: "#9f4e85",
  cyan: "#7dd6cf",
  white: "#e5e9f0",
};

registerFont(`${__dirname}/FiraCode-Light.ttf`, { family: "Fira Code Light" });
registerFont(`${__dirname}/FiraCode-Regular.ttf`, {
  family: "Fira Code Regular",
});
registerFont(`${__dirname}/FiraCode-Bold.ttf`, { family: "Fira Code Bold" });

{
  const stdin = process.openStdin();

  let data = "";

  stdin.on("data", (chunk) => (data += chunk));

  stdin.on("end", () => {
    print(data.slice(0, -1));
  });
}

const terminalHorizontalMargin = 30;
const terminalVerticalMargin = 30;
const terminalBorderRadius = 20;
const backgroundHorizontalMargin = 90;
const backgroundVerticalMargin = 90;

const backgroundGradient = (context, width, height) => {
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#88c0d0");
  gradient.addColorStop(1, "#5e81ac");

  return gradient;
};

const modifier = (context, modifier) => {
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

const background = (context, width, height) => {
  const gradient = backgroundGradient(context, width, height);

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
};

const terminal = (context, x, y, width, height) => {
  context.save();

  context.shadowColor = "rgba(0, 0, 0, .45)";
  context.shadowOffsetY = 30;
  context.shadowBlur = 35;

  const gradient = backgroundGradient(context, width, height);
  context.fillStyle = gradient;

  context.beginPath();
  context.moveTo(x + terminalBorderRadius, y);
  context.lineTo(x + width - terminalBorderRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + terminalBorderRadius);
  context.lineTo(x + width, y + height - terminalBorderRadius);
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - terminalBorderRadius,
    y + height
  );
  context.lineTo(x + terminalBorderRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - terminalBorderRadius);
  context.lineTo(x, y + terminalBorderRadius);
  context.quadraticCurveTo(x, y, x + terminalBorderRadius, y);
  context.closePath();
  context.fill();

  context.restore();
  context.save();

  context.fillStyle = "#000000";
  context.globalAlpha = 0.6;

  context.beginPath();
  context.moveTo(x + terminalBorderRadius, y);
  context.lineTo(x + width - terminalBorderRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + terminalBorderRadius);
  context.lineTo(x + width, y + height - terminalBorderRadius);
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - terminalBorderRadius,
    y + height
  );
  context.lineTo(x + terminalBorderRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - terminalBorderRadius);
  context.lineTo(x, y + terminalBorderRadius);
  context.quadraticCurveTo(x, y, x + terminalBorderRadius, y);
  context.closePath();
  context.fill();

  context.restore();
};

const text = (context, text) => {
  context.font = "20px Fira Code Regular";
  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillStyle = palette.white;

  const textMeasurements = context.measureText(text);
  const height =
    textMeasurements.actualBoundingBoxAscent +
    textMeasurements.actualBoundingBoxDescent;

  const leftPosition = backgroundHorizontalMargin + terminalHorizontalMargin;
  const lineHeight = height / text.split("\n").length;

  const withModifiers = text.split(/(\x1B.+?m)/);
  let offsetX = leftPosition;
  let offsetY = backgroundVerticalMargin + terminalVerticalMargin;
  let background = null;

  withModifiers.forEach((chunk) => {
    if (chunk.startsWith("\x1B")) {
      background = modifier(context, chunk);
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
            Math.round(lineHeight)
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

const print = (input) => {
  const throwableContext = createCanvas(1, 1).getContext("2d");
  throwableContext.font = "20px Fira Code Regular";

  const command = argv.command ? `$ ${argv.command}\n\n` : "";

  const cleanedInput = command + input.replace(/^\n/, "").trimEnd();

  const textWithoutModifiers = cleanedInput
    .split(/(\x1B.+?m)/)
    .filter((chunk) => !chunk.startsWith("\x1B"))
    .join("");

  const { width, ...textMeasurements } = throwableContext.measureText(
    textWithoutModifiers
  );
  const height =
    textMeasurements.actualBoundingBoxAscent +
    textMeasurements.actualBoundingBoxDescent;

  const canvas = createCanvas(
    width + 2 * terminalHorizontalMargin + 2 * backgroundHorizontalMargin,
    height + 2 * terminalVerticalMargin + 2 * backgroundVerticalMargin
  );
  const context = canvas.getContext("2d");

  background(
    context,
    width + 2 * terminalHorizontalMargin + 2 * backgroundHorizontalMargin,
    height + 2 * terminalVerticalMargin + 2 * backgroundVerticalMargin
  );

  terminal(
    context,
    backgroundHorizontalMargin,
    backgroundVerticalMargin,
    width + 2 * terminalHorizontalMargin,
    height + 2 * terminalVerticalMargin
  );

  text(context, cleanedInput);

  fs.writeFileSync(argv._[0], canvas.toBuffer("image/png"));
};
