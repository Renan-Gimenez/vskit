#!/usr/bin/env node

import chalk from "chalk";
import { detectInstalledIdes } from "./core/ide-detector/index.js";
import { promptIdeSelection } from "./cli/prompts/select-ide.js";

import ora from "ora";

console.log(chalk.green("Welcome to VSKit!"));

async function main() {
  const spinner = ora(chalk.blue("Detecting IDEs...")).start();

  try {
    const ides = await detectInstalledIdes();
    spinner.succeed(chalk.green(`Detected ${ides.length} IDE(s)`));

    if (ides.length === 0) {
      console.log(chalk.red("No IDEs detected."));
    } else if (ides.length === 1) {
      console.log(
        chalk.yellow("Found only 1 IDE. Need at least 2 to migrate settings."),
      );
      // List the single IDE anyway for info
      const ide = ides[0];
      console.log(`- ${chalk.bold(ide?.name)}`);
    } else {
      // Prompt for selection
      const selection = await promptIdeSelection(ides);

      if (selection) {
        console.log("");
        console.log(chalk.cyan("Migration Plan:"));
        console.log(`${chalk.bold("Source:")}      ${selection.source.name}`);
        console.log(
          `${chalk.bold("Destination:")} ${selection.destination.name}`,
        );
        console.log("");
      }
    }
  } catch (error) {
    spinner.fail(chalk.red("Failed to detect IDEs"));
    console.error(error);
  }
}

main().catch(console.error);
