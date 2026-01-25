export interface IDEMetadata {
  /**
   * Friendly name of the IDE (e.g. "Visual Studio Code")
   */
  name: string;
  /**
   * CLI command to execute (e.g. "code", "codium")
   */
  command: string;
  /**
   * Internal identifier for the IDE
   */
  id:
    | "vscode"
    | "vscodium"
    | "cursor"
    | "windsurf"
    | "vscode-insiders"
    | "antigravity";
  /**
   * Expected configuration paths (relative to Home or absolute)
   * This can vary by OS, handled by resolver utils usually,
   * but here we might store standard subpaths.
   */
  confDirName: string; // e.g. "Code", "VSCodium"
}

export interface DetectedIDE extends IDEMetadata {
  /**
   * Whether the functionality is available via PATH
   */
  isAvailableOnPath: boolean;
  /**
   * Absolute path to the configuration directory
   */
  configPath: string;
  /**
   * Absolute path to the extensions directory
   */
  extensionsPath: string;
}
