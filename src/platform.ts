import os from "os";

export interface PlatformInfo {
  platform: string;
  arch: string;
  packageName: string;
}

export function getPlatformInfo(version: string): PlatformInfo {
  const platform = os.platform();
  const arch = os.arch();

  // Map Node.js arch to PocketBase arch names
  const archMap: Record<string, string> = {
    x64: "amd64",
    arm64: "arm64",
    arm: "armv7",
  };

  // Supported platforms and their PocketBase names
  const platformMap: Record<string, string> = {
    darwin: "darwin",
    linux: "linux",
    win32: "windows",
  };

  // Validate platform and architecture
  if (!platformMap[platform]) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  const mappedArch = archMap[arch];
  if (!mappedArch) {
    throw new Error(`Unsupported architecture: ${arch}`);
  }

  return {
    platform,
    arch,
    packageName: `pocketbase_${version}_${platformMap[platform]}_${mappedArch}.zip`,
  };
}

export function getExecutablePath(extractPath: string): string {
  const platform = os.platform();
  return platform === "win32"
    ? `${extractPath}/pocketbase.exe`
    : `${extractPath}/pocketbase`;
}
