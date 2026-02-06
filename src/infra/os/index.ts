import os from "os";
import path from "path";

export function getConfigBaseDir(): string {
  const platform = process.platform;
  const home = os.homedir();

  if (platform === "win32") {
    return process.env.APPDATA || path.join(home, "AppData", "Roaming");
  } else if (platform === "darwin") {
    return path.join(home, "Library", "Application Support");
  } else {
    // Linux and others
    return process.env.XDG_CONFIG_HOME || path.join(home, ".config");
  }
}

export function getExtensionsBaseDir(): string {
  const home = os.homedir();
  // Default vscode extensions folder is usually ~/.vscode/extensions
  // or ~/.cursor/extensions etc.
  // This is tricky because forks might use different standards.
  // VS Code: ~/.vscode/extensions
  // VSCodium: ~/.vscode-oss/extensions (sometimes) or standard
  return path.join(home);
}
