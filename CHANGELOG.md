# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-02-06

### Added

- **Marketplace Fallback Strategy:** Introduced a robust fallback mechanism for extension installation. If the standard installation fails (common in forks like Windsurf/VSCodium due to marketplace restrictions), the CLI now automatically downloads the official `.vsix` from the Microsoft Marketplace and performs a manual installation.
- **Windsurf Support:** Added dedicated detection and support for the Windsurf IDE.
- **Advanced Binary Detection:** Implemented `ide-finder` infrastructure to locate IDE executables in standard system directories (`AppData`, `Program Files`, `/Applications`) when they are not available in the global PATH.

### Changed

- Enhanced `installExtensions` robustness with visual progress feedback (spinner) and detailed error reporting.
- Improved CLI UX to explicitly communicate success and failure states during batch operations.

### Removed

- Temporarily disabled `settings.json` migration option in the CLI prompt to ensure stability for this release.

## [2.0.2] - Previous Version

- Basic detection of installed IDEs.
- Interactive prompts for Source/Destination selection.
