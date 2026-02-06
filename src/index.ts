#!/usr/bin/env node

import chalk from "chalk";
import { detectInstalledIdes } from "./core/ide-detector/index.js";
import { promptIdeSelection } from "./cli/prompts/select-ide.js";
import { promptItemSelection } from "./cli/prompts/select-items.js";
import { listExtensions, installExtensions } from "./core/extensions/index.js";
import { confirm } from "@inquirer/prompts";

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
      const ideSelection = await promptIdeSelection(ides);

      if (ideSelection) {
        const itemSelection = await promptItemSelection();

        console.log("");
        console.log(chalk.cyan("Migration Plan:"));
        console.log(
          `${chalk.bold("Source:")}      ${ideSelection.source.name}`,
        );
        console.log(
          `${chalk.bold("Destination:")} ${ideSelection.destination.name}`,
        );
        console.log(
          `${chalk.bold("Items:")}       ${itemSelection.items.join(", ")}`,
        );
        console.log("");

        if (itemSelection.items.includes("extensions")) {
          const extensionSpinner = ora(
            `Reading extensions from ${ideSelection.source.name}...`,
          ).start();

          try {
            const extensions = await listExtensions(ideSelection.source);
            extensionSpinner.succeed(
              `Found ${extensions.length} extensions in ${ideSelection.source.name}`,
            );

            if (extensions.length > 0) {
              console.log(chalk.gray("--------------------------------"));
              extensions.forEach((ext) => console.log(chalk.dim(`- ${ext}`)));
              console.log(chalk.gray("--------------------------------"));

              const shouldInstall = await confirm({
                message: `Install these ${extensions.length} extensions to ${ideSelection.destination.name}?`,
                default: true,
              });

              if (shouldInstall) {
                const installSpinner = ora(
                  `Installing extensions in ${ideSelection.destination.name}...`,
                ).start();

                const { success, failed } = await installExtensions(
                  ideSelection.destination,
                  extensions,
                  (ext, current, total) => {
                    installSpinner.text = `Installing (${current}/${total}): ${ext}`;
                  },
                );

                if (failed.length > 0) {
                  installSpinner.warn(
                    `Installed ${success.length} extensions. Failed to install ${failed.length}.`,
                  );
                  console.log(chalk.red("Failed extensions:"));
                  failed.forEach((ext) => console.log(chalk.red(`- ${ext}`)));
                } else {
                  installSpinner.succeed(
                    chalk.green(
                      `Successfully installed all ${success.length} extensions!`,
                    ),
                  );
                }
              }
            }
          } catch (error) {
            extensionSpinner.fail(
              `Failed to read extensions from ${ideSelection.source.name}`,
            );
            console.error(
              chalk.red(
                error instanceof Error ? error.message : "Unknown error",
              ),
            );
          }
        }
      }
    }
  } catch (error) {
    spinner.fail(chalk.red("Failed to detect IDEs"));
    console.error(error);
  }
}

main().catch(console.error);
