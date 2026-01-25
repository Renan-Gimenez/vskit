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

export async function detectInstalledIdes(): Promise<DetectedIDE[]> {
  const configBase = getConfigBaseDir();
  const home = os.homedir();
  const detected: DetectedIDE[] = [];

  for (const ide of SUPPORTED_IDES) {
    let isAvailableOnPath = false;

    // Check if command exists
    try {
      // 'where' on windows, 'which' on unix.
      // execa has a simpler way? execa('code', ['--version']) is safer
      await execa(ide.command, ["--version"]);
      isAvailableOnPath = true;
    } catch {
      isAvailableOnPath = false;
    }

    // Resolve Config Path
    // On Windows: %APPDATA%/Code -> C:\Users\user\AppData\Roaming\Code
    const configPath = path.join(configBase, ide.confDirName);
    const configExists = await fs.pathExists(configPath);

    // Resolve Extensions Path
    // Standard: ~/.vscode/extensions
    // This is an assumption that might need refinement per IDE
    // VSCodium often uses .vscode-oss
    let extensionsDirName = ".vscode";
    if (ide.id === "vscodium") extensionsDirName = ".vscode-oss";
    if (ide.id === "cursor") extensionsDirName = ".cursor";
    if (ide.id === "windsurf") extensionsDirName = ".windsurf";
    if (ide.id === "antigravity") extensionsDirName = ".antigravity";

    const extensionsPath = path.join(home, extensionsDirName, "extensions");

    // We consider it detected if EITHER binary is in path OR config dir exists
    // But for "migration" we really need the config dir.
    if (configExists || isAvailableOnPath) {
      detected.push({
        ...ide,
        isAvailableOnPath,
        configPath,
        extensionsPath,
      });
    }
  }

  return detected;
}
