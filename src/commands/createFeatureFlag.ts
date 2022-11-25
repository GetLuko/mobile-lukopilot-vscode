import * as vscode from 'vscode';

import { formatFeatureFlagName, getWorkspaceFolder, isLukoWorkspace } from './utils';

const prompt: vscode.InputBoxOptions = {
  prompt: 'What is the Feature Flags\'s name ?',
  placeHolder: 'Feature Flag\'s name (i.e.: app_user_unlogged_enable )'
};

const promptDefaultFlag : vscode.InputBoxOptions = {
  prompt: 'What is the Feature Flags\'s default value ?',
  placeHolder: 'What is the Feature Flags\'s default value ? true | false'
};

const createFeatureFlag = async (ctx: vscode.ExtensionContext, uri: vscode.Uri) => {
    if (!isLukoWorkspace()) {
      return;
    }
    
    const featureFlagName = await vscode.window.showInputBox(prompt);
    const defaultFlagValue = await vscode.window.showInputBox(promptDefaultFlag);
    
    if (!featureFlagName) { return; };
    const formatedFF = formatFeatureFlagName(featureFlagName);

    const configFilePath = vscode.Uri.parse(`${getWorkspaceFolder()}/app/core/featuresFlags/config.ts`);
    const e2eFilePath = vscode.Uri.parse(`${getWorkspaceFolder()}/app/core/featuresFlags/index.e2e.ts`);
    const indexFilePath = vscode.Uri.parse(`${getWorkspaceFolder()}/app/core/featuresFlags/index.ts`);
    const fixtureFilePath = vscode.Uri.parse(`${getWorkspaceFolder()}/app/core/featuresFlags/__tests__/featureFlags.fixture.ts`);
    
    /* =========== Update Config File =========== */
     vscode.workspace.openTextDocument(configFilePath).then(document => {
      const edit = new vscode.WorkspaceEdit();
      edit.insert(configFilePath, new vscode.Position(3, 0), `export const ${featureFlagName.toLocaleUpperCase()} = '${featureFlagName}';\n`);

      const line = document.getText().split('\n').findIndex((lineValue) => /export const defaultConfig = {/g.test(lineValue));
      edit.insert(configFilePath, new vscode.Position(line + 1, 0), `  [${featureFlagName.toLocaleUpperCase()}]: ${defaultFlagValue},\n`);
      
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

      const listLine = document.getText().split('\n').findIndex((lineValue) => /const featureFlagsList/g.test(lineValue));
      edit.insert(e2eFilePath, new vscode.Position(listLine + 1, 0), `  [FLAGS.${featureFlagName.toLocaleUpperCase()}]: ${defaultFlagValue},\n`);

      const flagsLine = document.getText().split('\n').findIndex((lineValue) => /export const featureFlags: FeatureFlagsInstance = {/g.test(lineValue));
      edit.insert(e2eFilePath, new vscode.Position(flagsLine + 1, 0), `  is${formatedFF}: () => featureFlagsList[FLAGS.${featureFlagName.toLocaleUpperCase()}],\n`);

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

      const flagsLine = document.getText().split('\n').findIndex((lineValue) => /export const featureFlags = {/g.test(lineValue));

      console.log("DEBUG ", `  is${formatedFF}: () => isFeatureFlagEnabled(FLAGS.${featureFlagName.toLocaleUpperCase()}),\n`)
      
      edit.insert(indexFilePath, new vscode.Position(flagsLine + 1, 0), `  is${formatedFF}: () => isFeatureFlagEnabled(FLAGS.${featureFlagName.toLocaleUpperCase()}),\n`);

      return vscode.workspace.applyEdit(edit).then(success => {
        if (success) {
          vscode.window.showTextDocument(document);
        } else {
          vscode.window.showInformationMessage('An error occured :(');
        }
      });
    });


    /* =========== Update fixture File =========== */
    vscode.workspace.openTextDocument(fixtureFilePath).then(document => {
       const edit = new vscode.WorkspaceEdit();

       const flagsLine = document.getText().split('\n').findIndex((lineValue) => /export const defaultFeatureFlags =/g.test(lineValue));
       edit.insert(fixtureFilePath, new vscode.Position(flagsLine + 1, 0), `  ${featureFlagName}: ${defaultFlagValue},\n`);

       return vscode.workspace.applyEdit(edit).then(success => {
         if (success) {
           vscode.window.showTextDocument(document);
         } else {
           vscode.window.showInformationMessage('An error occured :(');
         }
       });
     });
};

export default createFeatureFlag;