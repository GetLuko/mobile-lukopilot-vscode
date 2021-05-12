import * as vscode from 'vscode';

export const getWorkspaceFolder = () => {
  if (vscode.workspace.workspaceFolders !== undefined) {
    return vscode.workspace.workspaceFolders[0].uri.path;
  }
};

export const isLukoWorkspace = (showErrorMessage = true) => {
  if (vscode.workspace.workspaceFolders !== undefined) {
    const path = `${vscode.workspace.workspaceFolders[0].uri.path}/package.json`;
    try {
      const json = require(path);
      return json.name === 'Luko';
    } catch {
      showErrorMessage && vscode.window.showErrorMessage('Not in Luko\'s workspace');
      return false;
    }
  }
  showErrorMessage && vscode.window.showErrorMessage('Not in Luko\'s workspace');
  return false;
};