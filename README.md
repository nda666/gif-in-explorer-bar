# GIF-in-Explorer Extension for VS Code

This Visual Studio Code extension allows you to display GIFs within the editor, either in a dedicated sidebar view or in a webview panel. It's a lightweight and fun way to integrate visuals into your development workflow!

![Alt text](./Screenshot.png)

## Features

- **Sidebar GIF Viewer:** View a GIF in a custom sidebar panel.
- **Webview Panel Support (Optional):** Option to open GIFs in a resizable, standalone webview (code available but commented out).
- **Customizable GIF Path:** Allows users to set a custom GIF path through settings. The GIF can be loaded from a local file path or a URL.
- **Dynamic GIF Type:** The extension automatically detects whether the provided path is a file or a URL, making it easy to switch between local and online sources without manual configuration.

## Installation

1. Clone this repository or download the source files.
2. Open the project folder in Visual Studio Code.
3. Run `npm install` to install dependencies.
4. Press `F5` to launch an Extension Development Host.

## Usage

### Sidebar GIF Viewer

1. The extension registers a custom webview in the sidebar.
2. This webview automatically displays a default GIF located at `media/example.gif`.
3. You can change the displayed GIF by modifying the path in the settings (either a local file path or a URL).
4. The GIF will update in the sidebar whenever the setting is changed.

### Changing the GIF Path

1. You can specify a custom GIF path via the extension settings.
2. Supported paths:

   - **Local file path** (e.g., `C:\path\to\your\gif.gif` or `/path/to/your/gif.gif`).
   - **URL** (e.g., `https://example.com/path/to/gif.gif`).

   The extension automatically detects whether the path is a file or a URL, so there's no need to manually configure the GIF type.

## Development

### Project Structure

- **`src/extension.ts`:** The main entry point for the extension.
- **`media/example.gif`:** The default GIF displayed in the viewer.

### Adding Custom GIFs

To use your own GIFs:

1. Replace the `media/example.gif` file with your own.
2. You can change the default GIF path from the settings by specifying either a local file path or a URL.

### Running the Extension

1. Open the project in VS Code.
2. Press `F5` to start the Extension Development Host.
3. The sidebar panel should load automatically.

## API

The extension registers the following:

- **View Provider:** `gifInSidebarView` – Adds a custom sidebar panel for displaying GIFs.
- **Command (Optional):** `gifInSidebar.open` – Opens a standalone webview panel.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Feel free to fork this repository, create a branch, and submit a pull request.

---

Enjoy displaying your favorite GIFs in VS Code!
