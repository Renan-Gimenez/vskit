import { executeIdeCommand } from "../../infra/shell/index.js";
import type { DetectedIDE } from "../../shared/types.js";

/**
 * Lists all installed extensions for a given IDE.
 * Uses the `--list-extensions` CLI flag.
 */
export async function listExtensions(ide: DetectedIDE): Promise<string[]> {
  // If the IDE is not in PATH, we might need a full path to the binary if we detected it via config folder.
  // For now, assuming standard command works or 'ide.command' holds a usable command.
  // TODO: Handle case where 'ide.command' is not in PATH but we know where it is?
  // For now, let's try using the command string.

  const output = await executeIdeCommand(ide.command, ["--list-extensions"]);

  // Split by new line and filter empty strings
  return output.split(/\r?\n/).filter((line) => line.trim() !== "");
}

import { downloadVsix } from "../marketplace/downloader.js";
import fs from "fs-extra";
import path from "path";
import os from "os";

// ... listExtensions definitions ...

/**
 * Installs a list of extensions into a target IDE.
 * uses `code --install-extension <id> --force`
 * Fallback: Downloads .vsix from MS Marketplace if direct install fails.
 */
export async function installExtensions(
  ide: DetectedIDE,
  extensions: string[],
  onProgress?: (ext: string, current: number, total: number) => void,
): Promise<{ success: string[]; failed: string[] }> {
  const success: string[] = [];
  const failed: string[] = [];
  let current = 0;

  // Create a temp directory for downloads
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "vskit-extensions-"));

  for (const ext of extensions) {
    current++;
    if (onProgress) onProgress(ext, current, extensions.length);

    try {
      // Strategy 1: Direct Install (fastest)
      await executeIdeCommand(ide.command, [
        "--install-extension",
        ext,
        "--force",
      ]);
      success.push(ext);
    } catch (directError) {
      // Strategy 2: Download VSIX & Install (Fallback)
      try {
        if (onProgress)
          onProgress(`${ext} (downloading...)`, current, extensions.length);

        const vsixPath = await downloadVsix(ext, tempDir);

        if (onProgress)
          onProgress(`${ext} (installing vsix...)`, current, extensions.length);

        await executeIdeCommand(ide.command, [
          "--install-extension",
          vsixPath,
          "--force",
        ]);

        success.push(ext);
      } catch (fallbackError) {
        failed.push(ext);
      }
    }
  }

  // Cleanup temp dir
  try {
    await fs.remove(tempDir);
  } catch {}

  return { success, failed };
}
