#!/usr/bin/env node

import chalk from "chalk";
import { detectInstalledIdes } from "./core/ide-detector/index.js";

import ora from "ora";

console.log(chalk.green("Welcome to VSKit!"));

async function main() {
  const spinner = ora(chalk.blue("Detecting IDEs...")).start();

  try {
    const ides = await detectInstalledIdes();
    spinner.succeed(chalk.green(`Detected ${ides.length} IDE(s)`));

    if (ides.length === 0) {
      console.log(chalk.red("No IDEs detected."));
    } else {
      ides.forEach((ide) => {
        console.log(chalk.green(`- ${chalk.bold(ide.name)} (${ide.id})`));
        console.log(chalk.green(`  Config: ${ide.configPath}`));
        console.log(
          chalk.green(
            `  Available in PATH: ${ide.isAvailableOnPath ? "Yes" : "No"}`,
          ),
        );
      });
    }
  } catch (error) {
    spinner.fail(chalk.red("Failed to detect IDEs"));
    console.error(error);
  }
}

main().catch(console.error);
