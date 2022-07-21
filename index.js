#!/usr/bin/env node

const fs = require("fs");
const { createCanvas, registerFont } = require("canvas");

registerFont("./FiraCode.ttf", { family: "Fira Code" });

{
  const stdin = process.openStdin();

  let data = "";

  stdin.on("data", (chunk) => (data += chunk));

  stdin.on("end", () => {
    console.log(data);
    print(data.slice(0, -1));
  });
}

const terminalHorizontalMargin = 30;
const terminalVerticalMargin = 30;
const terminalBorderRadius = 20;
const backgroundHorizontalMargin = 90;
const backgroundVerticalMargin = 90;

const terminal = (context, x, y, width, height) => {
  context.fillStyle = "#000";

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
};

const text = (context, text) => {
  context.font = "20px Fira Code";
  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillStyle = "white";

  context.fillText(
    text,
    backgroundHorizontalMargin + terminalHorizontalMargin,
    backgroundVerticalMargin + terminalVerticalMargin
  );
};

const print = (input) => {
  const throwableContext = createCanvas(1, 1).getContext("2d");
  throwableContext.font = "20px Fira Code";

  const { width, ...textMeasurements } = throwableContext.measureText(input);
  const height =
    textMeasurements.actualBoundingBoxAscent +
    textMeasurements.actualBoundingBoxDescent;

  const canvas = createCanvas(
    width + 2 * terminalHorizontalMargin + 2 * backgroundHorizontalMargin,
    height + 2 * terminalVerticalMargin + 2 * backgroundVerticalMargin
  );
  const context = canvas.getContext("2d");

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
