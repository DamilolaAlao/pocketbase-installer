#!/usr/bin/env node
import installPocketBase from "../index";

// CLI entry point
async function main() {
  try {
    await installPocketBase();
  } catch (error) {
    console.error("PocketBase installation failed:", error);
    process.exit(1);
  }
}

main();
