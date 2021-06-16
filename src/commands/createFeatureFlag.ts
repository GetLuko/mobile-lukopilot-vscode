import * as vscode from 'vscode';

import { formatFeatureFlagName, getWorkspaceFolder, isLukoWorkspace } from './utils';

const prompt: vscode.InputBoxOptions = {
  prompt: 'What is the Feature Flags\'s name ?',
  placeHolder: 'Feature Flag\'s name (i.e.: app_user_unlogged_enable 🥵 )'
};

const createScreen = async (ctx: vscode.ExtensionContext, uri: vscode.Uri) => {
  if (isLukoWorkspace()) {
    const featureFlagName = await vscode.window.showInputBox(prompt);
    if (!featureFlagName) { return; };
    const formatedFF = formatFeatureFlagName(featureFlagName);

    const configFilePath = vscode.Uri.parse(`${getWorkspaceFolder()}/app/core/featuresFlags/config.ts`);
    const e2eFilePath = vscode.Uri.parse(`${getWorkspaceFolder()}/app/core/featuresFlags/index.e2e.ts`);
    const indexFilePath = vscode.Uri.parse(`${getWorkspaceFolder()}/app/core/featuresFlags/index.ts`);

    /* =========== Update Config File =========== */
     vscode.workspace.openTextDocument(configFilePath).then(document => {
      const edit = new vscode.WorkspaceEdit();

      edit.insert(configFilePath, new vscode.Position(3, 0), `export const ${featureFlagName.toLocaleUpperCase()} = '${featureFlagName}';\n`);

      const line = document.getText().split('\n').findIndex((lineValue) => /export const defaultConfig = {/g.test(lineValue));
      edit.insert(configFilePath, new vscode.Position(line + 1, 0), `  [${featureFlagName.toLocaleUpperCase()}]: false,\n`);
      
      return vscode.workspace.applyEdit(edit).then(success => {
        if (success) {
          vscode.window.showTextDocument(document);
        } else {
          vscode.window.showInformationMessage('An error occured :(');
        }
      });
    });
 

    /* =========== Update E2E File =========== */
     vscode.workspace.openTextDocument(e2eFilePath).then(document => {
      const edit = new vscode.WorkspaceEdit();

      edit.insert(e2eFilePath, new vscode.Position(2, 0), `  ${featureFlagName.toLocaleUpperCase()},\n`);

      const listLine = document.getText().split('\n').findIndex((lineValue) => /const featureFlagsList = {/g.test(lineValue));
      edit.insert(e2eFilePath, new vscode.Position(listLine + 1, 0), `  [${featureFlagName.toLocaleUpperCase()}]: false,\n`);

      const flagsLine = document.getText().split('\n').findIndex((lineValue) => /export const featureFlags: FeatureFlagsInstance = {/g.test(lineValue));
      edit.insert(e2eFilePath, new vscode.Position(flagsLine + 1, 0), `  is${formatedFF}: () => featureFlagsList[${featureFlagName.toLocaleUpperCase()}],\n`);

      return vscode.workspace.applyEdit(edit).then(success => {
        if (success) {
          vscode.window.showTextDocument(document);
        } else {
          vscode.window.showInformationMessage('An error occured :(');
        }
      });
    });

    /* =========== Update index File =========== */
    vscode.workspace.openTextDocument(indexFilePath).then(document => {
      const edit = new vscode.WorkspaceEdit();

      edit.insert(indexFilePath, new vscode.Position(3, 0), `  ${featureFlagName.toLocaleUpperCase()},\n`);

      const flagsLine = document.getText().split('\n').findIndex((lineValue) => /export const featureFlags = {/g.test(lineValue));
      edit.insert(indexFilePath, new vscode.Position(flagsLine + 1, 0), `  is${formatedFF}: () => isFeatureFlagEnabled(${featureFlagName.toLocaleUpperCase()}),\n`);

      return vscode.workspace.applyEdit(edit).then(success => {
        if (success) {
          vscode.window.showTextDocument(document);
        } else {
          vscode.window.showInformationMessage('An error occured :(');
        }
      });
    });
  }
};

export default createScreen;