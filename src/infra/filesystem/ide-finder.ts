import os from "os";
import path from "path";
import fs from "fs-extra";

/**
 * Tries to resolve the executable path for a given IDE command.
 * If the command is not in PATH, it checks standard installation locations based on the OS.
 *
 * @param command The binary name (e.g., 'code', 'windsurf')
 * @returns The resolved absolute path to the executable, or the original command if not found (hoping it works in PATH later or fails)
 */
export async function resolveIdeExecutable(
  command: string,
  appName: string, // e.g., "Windsurf", "Visual Studio Code"
): Promise<string | null> {
  const platform = os.platform();

  // 1. Check common Windows paths
  if (platform === "win32") {
    const localAppData = process.env.LOCALAPPDATA;
    const programFiles = process.env.PROGRAMFILES;
    const programFilesX86 = process.env["PROGRAMFILES(X86)"];

    // Windsurf specific: C:\Users\User\AppData\Local\Programs\Windsurf\bin\windsurf.cmd
    if (command === "windsurf" && localAppData) {
      const candidates = [
        path.join(localAppData, "Programs", "Windsurf", "bin", "windsurf.cmd"),
        path.join(localAppData, "Programs", "Windsurf", "windsurf.exe"),
      ];
      for (const p of candidates) if (await fs.pathExists(p)) return p;
    }

    // VS Code specific
    if (command === "code" && localAppData) {
      const candidates = [
        path.join(
          localAppData,
          "Programs",
          "Microsoft VS Code",
          "bin",
          "code.cmd",
        ),
        path.join(localAppData, "Programs", "Microsoft VS Code", "Code.exe"),
      ];
      for (const p of candidates) if (await fs.pathExists(p)) return p;
    }

    // Antigravity specific
    if (command === "antigravity" && localAppData) {
      const candidates = [
        path.join(
          localAppData,
          "Programs",
          "antigravity",
          "bin",
          "antigravity.cmd",
        ),
        path.join(localAppData, "Programs", "antigravity", "antigravity.exe"),
      ];
      for (const p of candidates) if (await fs.pathExists(p)) return p;
    }
  }

  // 2. Check MacOS paths
  if (platform === "darwin") {
    // /Applications/Windsurf.app/Contents/Resources/app/bin/windsurf
    // /Applications/Visual Studio Code.app/Contents/Resources/app/bin/code
    const appPath = `/Applications/${appName}.app`;
    if (await fs.pathExists(appPath)) {
      // Common pattern for Electron apps on Mac
      const binPath = path.join(
        appPath,
        "Contents",
        "Resources",
        "app",
        "bin",
        command,
      );
      if (await fs.pathExists(binPath)) return binPath;
    }
  }

  // 3. Check Linux paths
  if (platform === "linux") {
    // Usually in /usr/bin or /usr/local/bin which are in PATH.
    // If installed via Snap: /snap/bin/...
    // If installed manually, it's harder to guess without PATH.
    // For now, on Linux, we rely heavily on PATH or common /usr/bin.
    const candidates = [
      `/usr/bin/${command}`,
      `/usr/local/bin/${command}`,
      `/snap/bin/${command}`,
    ];
    for (const p of candidates) if (await fs.pathExists(p)) return p;
  }

  return null;
}
