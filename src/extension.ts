import * as vscode from 'vscode';
import { isLukoWorkspace } from './commands/utils';

import { registerAll } from './registerCommands';

let lukoStatusBar: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
	registerAll(context);

  const isLukoWS = isLukoWorkspace(false);
  lukoStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -100);
  if (isLukoWS) {
    lukoStatusBar.text = `$(getting-started-item-checked) Luko`;
  } else {
    lukoStatusBar.text = `$(alert) Luko Workspace not found !`;
  }
  lukoStatusBar.show();
}

export function deactivate() {
  lukoStatusBar.hide();
}
