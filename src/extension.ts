import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log(`Activating ${GifViewProvider.viewType} extension...`);
  const provider = new GifViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      GifViewProvider.viewType,
      provider
    )
  );

  // Command to select a GIF file
  let selectGifCommand = vscode.commands.registerCommand(
    "gifInSidebar.selectGif",
    async () => {
      const fileUri = await vscode.window.showOpenDialog({
        canSelectMany: false,
        openLabel: "Select GIF",
        filters: {
          Images: ["gif"],
        },
      });

      if (fileUri && fileUri[0]) {
        provider.setGifPath(fileUri[0].fsPath);
      }
    }
  );

  // Command to set GIF from a URL
  let setGifUrlCommand = vscode.commands.registerCommand(
    "gifInSidebar.setGifUrl",
    async () => {
      const url = await vscode.window.showInputBox({
        prompt: "Enter the URL of the GIF",
        placeHolder: "https://example.com/my-gif.gif",
      });

      if (url) {
        provider.setGifPath(url);
      }
    }
  );

  context.subscriptions.push(selectGifCommand, setGifUrlCommand);
}

export function deactivate() {}

class GifViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "gifInSidebarView"; // Must match the ID in package.json
  private gifPath: string | null = null;
  private gifType: "file" | "url" | null = null;
  private webviewView: vscode.WebviewView | null = null;

  constructor(private readonly extensionUri: vscode.Uri) {
    this.loadGifPathFromSettings();
    vscode.workspace.onDidChangeConfiguration(
      this.handleConfigurationChange,
      this
    );
  }

  private handleConfigurationChange(e: vscode.ConfigurationChangeEvent) {
    if (e.affectsConfiguration("gifInSidebar.gifPath")) {
      this.loadGifPathFromSettings();
      if (this.webviewView) {
        this.updateWebview(this.webviewView.webview);
      }
    }
  }

  private isUrl(path: string): boolean {
    return /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//i.test(path);
  }

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.webviewView = webviewView;
    this.loadGifPathFromSettings();

    const localResourceRoots = [
      vscode.Uri.joinPath(this.extensionUri, "media"), // Extension's media folder
      ...(this.gifType === "file" ? [vscode.Uri.file(this.gifPath || "")] : []), // Add file path if it's a local file
    ];

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots,
    };

    this.updateWebview(webviewView.webview);
    this.gifPath && this.setGifPath(this.gifPath);
  }

  setGifPath(path: string) {
    this.gifPath = path;
    this.gifType = this.isUrl(path) ? "url" : "file";

    if (this.gifType === "file") {
      const fileRoot = vscode.Uri.file(path).with({
        path: vscode.Uri.file(path).path.split("/").slice(0, -1).join("/"),
      });

      if (this.webviewView) {
        this.webviewView.webview.options = {
          ...this.webviewView.webview.options,
          localResourceRoots: [
            ...(this.webviewView.webview.options.localResourceRoots || []),
            fileRoot,
          ],
        };
      }
    }
    if (this.webviewView) {
      this.updateWebview(this.webviewView.webview); // Update the webview when the path changes
    }
    this.saveGifPathToSettings(path);
  }

  private updateWebview(webview: vscode.Webview) {
    webview.html = this.getHtmlForWebview(webview);
  }

  private saveGifPathToSettings(path: string) {
    const config = vscode.workspace.getConfiguration("gifInSidebar");
    config.update("gifPath", path, vscode.ConfigurationTarget.Global);
  }

  private loadGifPathFromSettings() {
    const config = vscode.workspace.getConfiguration("gifInSidebar");
    this.gifPath =
      config.get<string>("gifPath") ||
      vscode.Uri.joinPath(this.extensionUri, "media", "example.gif").fsPath;
    this.gifType = this.isUrl(this.gifPath) ? "url" : "file";
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    let gifUri = "";

    if (this.gifPath) {
      gifUri =
        this.gifType === "file"
          ? webview.asWebviewUri(vscode.Uri.file(this.gifPath)).toString() // Properly convert file path to webview URI
          : this.gifPath; // Use the URL directly if it's a remote URL
    }

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GIF Viewer</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #1e1e1e;
          }
          img {
            max-width: 100%;
            max-height: 100%;
          }
          .placeholder {
            color: white;
            font-size: 18px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        ${
          gifUri
            ? `<img src="${gifUri}" alt="GIF Viewer">`
            : `<div class="placeholder">No GIF selected. Use the command palette to select one.</div>`
        }
      </body>
      </html>
    `;
  }
}
