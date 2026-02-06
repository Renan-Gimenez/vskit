/**
 * Logic for IDE Detection:
 *
 * 1. Check if CLI is in PATH (execa('which', [cmd]))
 * 2. Check if Config Dir exists (fs.pathExists)
 * 3. Return object with status
 */

import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import type { DetectedIDE, IDEMetadata } from "../../shared/types.js";
import { SUPPORTED_IDES } from "../../shared/constants.js";
import { getConfigBaseDir } from "../../infra/os/index.js";
import os from "os";

import { resolveIdeExecutable } from "../../infra/filesystem/ide-finder.js";

export async function detectInstalledIdes(): Promise<DetectedIDE[]> {
  const configBase = getConfigBaseDir();
  const home = os.homedir();
  const detected: DetectedIDE[] = [];

  for (const ide of SUPPORTED_IDES) {
    let isAvailableOnPath = false;
    let resolvedCommand = ide.command;

    // Check if command exists in PATH
    try {
      await execa(ide.command, ["--version"]);
      isAvailableOnPath = true;
    } catch {
      isAvailableOnPath = false;
    }

    // Try to resolve absolute path if not in PATH (or even if it is, to be safe?)
    // If not in PATH, we MUST find it elsewhere.
    if (!isAvailableOnPath) {
      const foundPath = await resolveIdeExecutable(ide.command, ide.name);
      if (foundPath) {
        resolvedCommand = foundPath;
        // logic check: if we found the absolute path, we can technically execute it, so it is "available" to us.
        isAvailableOnPath = true;
      }
    }

    // Resolve Config Path
    const configPath = path.join(configBase, ide.confDirName);
    const configExists = await fs.pathExists(configPath);

    // Resolve Extensions Path
    let extensionsDirName = ".vscode";
    if (ide.id === "vscodium") extensionsDirName = ".vscode-oss";
    if (ide.id === "cursor") extensionsDirName = ".cursor";
    if (ide.id === "windsurf") extensionsDirName = ".windsurf";
    if (ide.id === "antigravity") extensionsDirName = ".antigravity";

    const extensionsPath = path.join(home, extensionsDirName, "extensions");

    if (configExists || isAvailableOnPath) {
      detected.push({
        ...ide,
        command: resolvedCommand, // Update command with absolute path if found
        isAvailableOnPath,
        configPath,
        extensionsPath,
      });
    }
  }

  return detected;
}
