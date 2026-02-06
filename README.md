# VSKit

> **The ultimate CLI to migrate settings and extensions between VS Code and its forks.**

[![npm version](https://img.shields.io/npm/v/vskit.svg?style=flat-square)](https://www.npmjs.com/package/vskit)
[![install size](https://img.shields.io/badge/dynamic/json?url=https://packagephobia.com/v2/api.json?p=vskit&query=$.install.pretty&label=install%20size&style=flat-square)](https://packagephobia.com/result?p=vskit)

Moves your development environment from **Visual Studio Code** to **Windsurf**, **Cursor**, **VSCodium**, **Antigravity**, or vice-versa, in seconds.

## 🚀 Quick Start

You don't need to install anything. Just run:

```bash
npx vskit
```

## ✨ Features

- **🛡️ Auto-Detection:** Automatically finds installed IDEs on Windows, MacOS, and Linux.
- **📦 Smart Extension Migration:**
  - Lists extensions from your Source IDE.
  - Installs them on the Destination IDE.
  - **Fallback Strategy:** If the destination IDE (e.g., Windsurf) fails to find an extension in its marketplace, VSKit automatically downloads the official `.vsix` from Microsoft and installs it manually.
- **⚡ Interactive CLI:** Safe, step-by-step wizard. Nothing is changed without your confirmation.
- **🔧 Cross-Platform:** Works on Windows, macOS, and Linux.

## 📱 Supported IDEs

- Visual Studio Code (Stable & Insiders)
- VSCodium
- Cursor
- Windsurf
- Antigravity

## 🛠️ How it works

1. **Detection:** VSKit scans standard system paths (`PATH`, `AppData`, `/Applications`) to find IDE binaries and config folders.
2. **Selection:** You choose "Where from" and "Where to".
3. **Execution:**
   - It reads your extension list (`code --list-extensions`).
   - It attempts to install them on the destination (`windsurf --install-extension <id>`).
   - If that fails (due to marketplace restrictions), it downloads the extension directly from the Visual Studio Marketplace and forces installation via file.

## 🤝 Contributing

Contributions are welcome!

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## 📄 License

MIT
