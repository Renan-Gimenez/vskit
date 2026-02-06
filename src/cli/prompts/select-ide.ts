import { select } from "@inquirer/prompts";
import type { DetectedIDE } from "../../shared/types.js";

export interface IdeSelection {
  source: DetectedIDE;
  destination: DetectedIDE;
}

export async function promptIdeSelection(
  ides: DetectedIDE[],
): Promise<IdeSelection | null> {
  if (ides.length < 2) {
    return null;
  }

  const source = await select<DetectedIDE>({
    message: "Select the SOURCE IDE (copy from):",
    choices: ides.map((ide) => ({
      name: ide.name,
      value: ide,
    })),
  });

  const destination = await select<DetectedIDE>({
    message: "Select the DESTINATION IDE (paste to):",
    choices: ides
      .filter((ide) => ide.id !== source.id)
      .map((ide) => ({
        name: ide.name,
        value: ide,
      })),
  });

  return { source, destination };
}
