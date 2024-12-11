import https from "https";
import fs from "fs";
import { createWriteStream } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";

const streamPipeline = promisify(pipeline);

export interface DownloadOptions {
  url: string;
  outputPath: string;
  maxRedirects?: number;
}

export async function downloadFile({
  url,
  outputPath,
  maxRedirects = 5,
}: DownloadOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const { statusCode, headers } = res;

        // Handle redirects
        if (
          statusCode &&
          statusCode >= 300 &&
          statusCode < 400 &&
          headers.location
        ) {
          if (maxRedirects <= 0) {
            reject(new Error("Too many redirects"));
            return;
          }

          const redirectedUrl = headers.location.startsWith("http")
            ? headers.location
            : new URL(headers.location, url).href;

          res.resume(); // Consume response data to free up memory
          downloadFile({
            url: redirectedUrl,
            outputPath,
            maxRedirects: maxRedirects - 1,
          })
            .then(resolve)
            .catch(reject);
          return;
        }

        // Check for successful response
        if (statusCode !== 200) {
          reject(new Error(`Failed to download: ${statusCode}`));
          res.resume(); // Consume response data to free up memory
          return;
        }

        // Track download progress
        const totalSize = parseInt(headers["content-length"] || "0", 10);
        let downloadedSize = 0;

        res.on("data", (chunk) => {
          downloadedSize += chunk.length;
          const percentage = totalSize
            ? ((downloadedSize / totalSize) * 100).toFixed(2)
            : "0.00";
          process.stdout.write(`Downloading: ${percentage}%\r`);
        });

        // Write to file
        const writeStream = createWriteStream(outputPath);
        res
          .pipe(writeStream)
          .on("finish", () => {
            console.log("\nDownload completed successfully!");
            resolve();
          })
          .on("error", (err) => {
            console.error("Error writing to file:", err);
            reject(err);
          });
      })
      .on("error", (err) => {
        console.error("Error during download:", err);
        reject(err);
      });
  });
}

export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
