import fs from "fs-extra";
import path from "path";
import os from "os";

/**
 * Downloads a VSIX file from the Microsoft Marketplace.
 * @param extensionId The extension ID (e.g. "esbenp.prettier-vscode")
 * @param tempDir Directory to save the file
 * @returns absolute path to the downloaded .vsix file
 */
export async function downloadVsix(
  extensionId: string,
  tempDir: string,
): Promise<string> {
  const [publisher, name] = extensionId.split(".");
  if (!publisher || !name) {
    throw new Error(`Invalid extension ID: ${extensionId}`);
  }

  // Construct URL for the latest version
  // Note: This fetches the "latest" implicitly. Ideally we might want to check versions,
  // but for migration usually "latest compatible" is what 'install-extension' does anyway.
  // The official URL pattern for direct download is often:
  // https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${name}/latest/vspackage

  const url = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${name}/latest/vspackage`;
  const destPath = path.join(tempDir, `${extensionId}.vsix`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to download ${extensionId}: ${response.status} ${response.statusText}`,
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  await fs.writeFile(destPath, Buffer.from(arrayBuffer));

  return destPath;
}
