import * as vscode from 'vscode';
import * as path from 'path';

import { getWorkspaceFolder, isLukoWorkspace } from './utils';
import ScreenTemplate from '../templates/newScreen';

const prompt: vscode.InputBoxOptions = {
  prompt: 'What is the screen\'s name ?',
  placeHolder: 'MyAwesomeScreen'
};

const createScreen = async (ctx: vscode.ExtensionContext, uri: vscode.Uri) => {
  if (isLukoWorkspace()) {
    const screenName = await vscode.window.showInputBox(prompt);
    if (!screenName) { return; };
    const newFile = vscode.Uri.parse('untitled:' + path.join(uri.path, `${screenName}.tsx`));

    vscode.workspace.openTextDocument(newFile).then(document => {
      const edit = new vscode.WorkspaceEdit();
      edit.insert(newFile, new vscode.Position(0, 0), ScreenTemplate.split('SCREEN_NAME').join(screenName));
      return vscode.workspace.applyEdit(edit).then(success => {
          if (success) {
              vscode.window.showTextDocument(document);
            } else {
              vscode.window.showInformationMessage('An error occured :(');
          }
      });
    });

    const screenFilePath = vscode.Uri.parse(`${getWorkspaceFolder()}/app/screens.tsx`);

    vscode.workspace.openTextDocument(screenFilePath).then(document => {
      const edit = new vscode.WorkspaceEdit();
      edit.insert(screenFilePath, new vscode.Position(10, 0), `import ${screenName} from '~/features/${path.join(uri.path, `${screenName}`).split('/features/')[1]}';\n`);

      // Search registerComponent available line
      const line = document.getText().split('\n').findIndex((lineValue) => /registerComponent\(\'Initializing\', InitializingScreen\);/g.test(lineValue));

      edit.insert(screenFilePath, new vscode.Position(line + 1, 0), `  registerComponent('myLuko.${screenName}', ${screenName});\n`);
      
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