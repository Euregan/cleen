#!/usr/bin/env node

const fs = require("fs");
const { createCanvas, registerFont } = require("canvas");

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

const modifier = (context, modifier) => {
  const modifiers = modifier.match(/(\d+;?)+/)[0].split(";");
  modifiers.forEach((modifier) => {
    switch (modifier) {
      case "0":
        context.font = "20px Fira Code Regular";
        context.fillStyle = "white";
        break;
      case "01":
      case "1":
        context.font = "20px Fira Code Bold";
        break;
      case "30":
        context.fillStyle = "#3b4252";
        break;
      case "31":
        context.fillStyle = "#bf616a";
        break;
      case "32":
        context.fillStyle = "#a3be8c";
        break;
      case "33":
        context.fillStyle = "#ebcb8b";
        break;
      case "34":
        context.fillStyle = "#81a1c1";
        break;
      case "35":
        context.fillStyle = "#b48ead";
        break;
      case "36":
        context.fillStyle = "#88c0d0";
        break;
      case "37":
        context.fillStyle = "#e5e9f0";
        break;
    }
  });
};

const background = (context, width, height) => {
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#88c0d0");
  gradient.addColorStop(1, "#5e81ac");

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
};

const terminal = (context, x, y, width, height) => {
  context.fillStyle = "#000000";
  context.globalAlpha = 0.75;

  context.shadowColor = "rgba(0, 0, 0, .45)";
  context.shadowOffsetY = 30;
  context.shadowBlur = 35;

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

  context.shadowBlur = 0;
  context.globalAlpha = 1;
  context.shadowOffsetY = 0;
  context.shadowBlur = 30;
};

const text = (context, text) => {
  context.font = "20px Fira Code Regular";
  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillStyle = "white";

  const textMeasurements = context.measureText(text);
  const height =
    textMeasurements.actualBoundingBoxAscent +
    textMeasurements.actualBoundingBoxDescent;

  const leftPosition = backgroundHorizontalMargin + terminalHorizontalMargin;
  const lineHeight = height / text.split("\n").length;

  const withModifiers = text.split(/(\x1B.+?m)/);
  let offsetX = leftPosition;
  let offsetY = backgroundVerticalMargin + terminalVerticalMargin;

  withModifiers.forEach((chunk) => {
    if (chunk.startsWith("\x1B")) {
      modifier(context, chunk);
    } else {
      const lines = chunk.split("\n");
      lines.forEach((line, index) => {
        context.fillText(line, offsetX, offsetY);

        if (index === lines.length - 1) {
          const { width } = context.measureText(line);
          offsetX = leftPosition + width;
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

  const { width, ...textMeasurements } = throwableContext.measureText(input);
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

  text(context, input);

  fs.writeFileSync("./image.png", canvas.toBuffer("image/png"));
};
