import { execSync } from "child_process";
import os from "os";
import path from "path";

export function unzipPackage(zipPath: string, extractPath: string): void {
  try {
    console.log("Extracting package...");

    // Use built-in unzip on macOS and use unzip command on Linux/Windows
    const platform = os.platform();

    if (platform === "darwin") {
      // macOS: Use built-in unzip
      execSync(`unzip -o "${zipPath}" -d "${extractPath}"`);
    } else if (platform === "linux") {
      // Linux: Use unzip command
      execSync(`unzip -o "${zipPath}" -d "${extractPath}"`);
    } else if (platform === "win32") {
      // Windows: Use Expand-Archive PowerShell cmdlet
      execSync(
        `powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${extractPath}' -Force"`,
      );
    } else {
      throw new Error(`Unsupported platform for unzipping: ${platform}`);
    }

    console.log("Package extracted successfully!");
  } catch (error) {
    console.error("Error extracting package:", error);
    throw error;
  }
}

export function runPocketBase(executablePath: string): void {
  try {
    console.log("Starting PocketBase server...");
    execSync(`"${executablePath}" serve`, { stdio: "inherit" });
  } catch (error) {
    console.error("Error running PocketBase:", error);
    throw error;
  }
}
