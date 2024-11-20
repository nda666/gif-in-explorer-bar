# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Support for loading GIFs from a local file system or a URL.
- Dynamically handle the GIF type (`file` or `url`) based on the provided path.
- Option to change the GIF path via settings, reflected immediately in the sidebar view.
- Local file paths are now correctly handled using the `file://` URI scheme in webviews.

### Fixed

- Resolved the 401 Unauthorized error when loading local files using the `vscode-resource://` scheme.
- Ensured that file paths outside the extension's local directory can be accessed via the `file://` scheme.
- Corrected the handling of local file paths when first loading the extension.

### Changed

- Updated `GifViewProvider` to load the GIF based on the current configuration without needing to set the `gifType` manually in settings.
- Improved handling of the default GIF path, falling back to a default file if no setting is found.

## [1.0.0] - YYYY-MM-DD

### Added

- Initial release of the GIF Viewer extension in the VS Code sidebar.
- Displays GIFs from a specified file path or URL.
- GIF path can be configured via settings or using a command to update dynamically.
