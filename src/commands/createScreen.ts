import * as vscode from 'vscode';
import * as path from 'path';

import { getWorkspaceFolder, isLukoWorkspace } from './utils';
import ScreenTemplate from '../templates/NewScreen';
import ScreenNavTemplate from '../templates/NewScreenNav';
import ScreenIndexTemplate from '../templates/NewScreenIndex';

const prompt: vscode.InputBoxOptions = {
  prompt: 'What is the screen\'s name ?',
  placeHolder: 'MyAwesomeScreen'
};

const createScreen = async (ctx: vscode.ExtensionContext, uri: vscode.Uri) => {
  if (isLukoWorkspace()) {
    const screenName = await vscode.window.showInputBox(prompt);
    if (!screenName) { return; };
    const ScreenFile = vscode.Uri.parse('untitled:' + path.join(`${uri.path}/${screenName}`, `${screenName}.tsx`));
    const NavFile = vscode.Uri.parse('untitled:' + path.join(`${uri.path}/${screenName}`, `${screenName}.nav.tsx`));
    const IndexFile = vscode.Uri.parse('untitled:' + path.join(`${uri.path}/${screenName}`, 'index.ts'));

    vscode.workspace.openTextDocument(ScreenFile).then(document => {
      const edit = new vscode.WorkspaceEdit();
      edit.insert(ScreenFile, new vscode.Position(0, 0), ScreenTemplate.split('SCREEN_NAME').join(screenName));
      return vscode.workspace.applyEdit(edit).then(success => {
          if (success) {
              vscode.window.showTextDocument(document);
            } else {
              vscode.window.showInformationMessage('An error occured :(');
          }
      });
    });

    vscode.workspace.openTextDocument(NavFile).then(document => {
      const edit = new vscode.WorkspaceEdit();
      edit.insert(NavFile, new vscode.Position(0, 0), ScreenNavTemplate.split('SCREEN_NAME').join(screenName));
      return vscode.workspace.applyEdit(edit).then(success => {
          if (success) {
              vscode.window.showTextDocument(document);
            } else {
              vscode.window.showInformationMessage('An error occured :(');
          }
      });
    });

    vscode.workspace.openTextDocument(IndexFile).then(document => {
      const edit = new vscode.WorkspaceEdit();
      edit.insert(IndexFile, new vscode.Position(0, 0), ScreenIndexTemplate.split('SCREEN_NAME').join(screenName));
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
      edit.insert(screenFilePath, new vscode.Position(10, 0), `import { register${screenName} } from '~/features/${path.join(uri.path, `${screenName}`).split('/features/')[1]}';\n`);

      // Search registerComponent available line
      const line = document.getText().split('\n').findIndex((lineValue) => /registerComponent\(\'Initializing\', InitializingScreen\);/g.test(lineValue));

      edit.insert(screenFilePath, new vscode.Position(line + 1, 0), `  register${screenName}();\n`);
      
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