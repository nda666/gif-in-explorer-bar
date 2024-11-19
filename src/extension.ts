import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log(`Activating ${GifViewProvider.viewType} extension...`);
  const provider = new GifViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      GifViewProvider.viewType, // Matches the ID from package.json
      provider
    )
  );

  // let openWebview = vscode.commands.registerCommand(
  //   "gifExplorerView.open",
  //   () => {
  //     const panel = vscode.window.createWebviewPanel(
  //       "gifViewer", // Identifies the type of the webview. Used internally
  //       "GIF Viewer", // Title of the panel displayed to the user
  //       vscode.ViewColumn.One, // Editor column to show the new webview panel in.
  //       {
  //         // Enable scripts in the webview
  //         enableScripts: true, //Set this to true if you want to enable Javascript.
  //         localResourceRoots: [
  //           vscode.Uri.joinPath(context.extensionUri, "media"),
  //         ],
  //       }
  //     );
  //     panel.webview.html = getHtmlForWebview(
  //       panel.webview,
  //       context.extensionUri
  //     );
  //   }
  // );
  // context.subscriptions.push(openWebview);
}

export function deactivate() {}

function getHtmlForWebview(
  webview: vscode.Webview,
  extensionUri: vscode.Uri
): string {
  const gifUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "media", "example.gif")
  );

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
      </style>
    </head>
    <body>
      <img src="${gifUri}" alt="GIF Viewer">
    </body>
    </html>
  `;
}

class GifViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "gifInSidebarView"; // Must match the ID in package.json

  constructor(private readonly extensionUri: vscode.Uri) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };

    webviewView.webview.html = getHtmlForWebview(
      webviewView.webview,
      this.extensionUri
    );
  }
}
