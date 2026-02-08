import { writeFile } from "node:fs/promises";
import { render } from "./render";

const cleen = async (content: string, filepath: string, command?: string) => {
  const image = render(content, command ?? null);
  await writeFile(filepath, image);
};

export default cleen;
