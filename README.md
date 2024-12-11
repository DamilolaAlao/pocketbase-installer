# PocketBase Installer

A cross-platform TypeScript utility for downloading and installing PocketBase.

## Installation

```bash
npm install pocketbase-installer
```

## Usage

### As a CLI Tool

```bash
npx pocketbase-installer
```

### As a Module

```typescript
import installPocketBase from 'pocketbase-installer';

// Basic usage
await installPocketBase();

// With custom options
await installPocketBase({
  version: '0.23.5',
  downloadDir: './custom-download-path',
  githubBaseUrl: 'https://github.com/pocketbase/pocketbase/releases/download'
});
```

## Features

- Cross-platform support (macOS, Linux, Windows)
- Automatic architecture detection
- Configurable download and installation
- Supports multiple PocketBase versions

## Requirements

- Node.js 16+
- Platform-specific unzip utility (built-in on macOS, requires `unzip` on Linux, PowerShell on Windows)
