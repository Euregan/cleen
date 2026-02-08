#!/usr/bin/env node

import parseArguments from "minimist";
import { render } from "./render";
import { writeFile } from "node:fs/promises";

const args = parseArguments(process.argv.slice(2), {
  string: ["command"],
  boolean: ["display"],
});

// The user didn't specify the target image
if (!args._[0]) {
  console.error("You need to specify the image to output to");
  console.error("For example: npx cleen image.png");
  process.exit(1);
}

{
  let data = "";

  process.stdin.on("data", (chunk) => {
    if (args.display) {
      process.stdout.write(chunk);
    }
    data += chunk;
  });

  process.stdin.on("end", async () => {
    const image = render(data.slice(0, -1), args.command);
    await writeFile(args._[0], image);
  });
}
