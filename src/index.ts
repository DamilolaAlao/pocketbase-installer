import path from "path";
import { getPlatformInfo, getExecutablePath } from "./platform";
import { downloadFile, ensureDirectoryExists } from "./download";
import { unzipPackage, runPocketBase } from "./unzip";

export interface InstallOptions {
  version?: string;
  downloadDir?: string;
  githubBaseUrl?: string;
}

export async function installPocketBase({
  version = "0.23.5",
  downloadDir = path.join(process.cwd(), "pocketbase-downloads"),
  githubBaseUrl = "https://github.com/pocketbase/pocketbase/releases/download",
}: InstallOptions = {}): Promise<void> {
  try {
    // Ensure download directory exists
    ensureDirectoryExists(downloadDir);

    // Get appropriate package details
    const { packageName } = getPlatformInfo(version);
    const downloadUrl = `${githubBaseUrl}/v${version}/${packageName}`;
    const zipPath = path.join(downloadDir, packageName);
    const extractPath = path.join(downloadDir, "pocketbase");

    // Ensure extraction directory exists
    ensureDirectoryExists(extractPath);

    // Download the package
    await downloadFile({
      url: downloadUrl,
      outputPath: zipPath,
    });

    // Unzip the package
    unzipPackage(zipPath, extractPath);

    console.log(`PocketBase v${version} installed successfully!`);
    console.log(`Installed to: ${extractPath}`);

    // Get executable path and run server
    const pocketbaseExecutable = getExecutablePath(extractPath);
    runPocketBase(pocketbaseExecutable);
  } catch (error) {
    console.error("Installation failed:", error);
    process.exit(1);
  }
}

export default installPocketBase;
