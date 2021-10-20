"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const utils_1 = require("./utils");
const NewScreen_1 = require("../templates/NewScreen");
const NewScreenNav_1 = require("../templates/NewScreenNav");
const NewScreenIndex_1 = require("../templates/NewScreenIndex");
const prompt = {
    prompt: 'What is the screen\'s name ?',
    placeHolder: 'MyAwesomeScreen'
};
const createScreen = (ctx, uri) => __awaiter(void 0, void 0, void 0, function* () {
    if (utils_1.isLukoWorkspace()) {
        const screenName = yield vscode.window.showInputBox(prompt);
        if (!screenName) {
            return;
        }
        ;
        const ScreenFile = vscode.Uri.parse('untitled:' + path.join(`${uri.path}/${screenName}`, `${screenName}.tsx`));
        const NavFile = vscode.Uri.parse('untitled:' + path.join(`${uri.path}/${screenName}`, `${screenName}.nav.ts`));
        const IndexFile = vscode.Uri.parse('untitled:' + path.join(`${uri.path}/${screenName}`, 'index.ts'));
        vscode.workspace.openTextDocument(ScreenFile).then(document => {
            const edit = new vscode.WorkspaceEdit();
            edit.insert(ScreenFile, new vscode.Position(0, 0), NewScreen_1.default.split('SCREEN_NAME').join(screenName));
            return vscode.workspace.applyEdit(edit).then(success => {
                if (success) {
                    vscode.window.showTextDocument(document);
                }
                else {
                    vscode.window.showInformationMessage('An error occured :(');
                }
            });
        });
        vscode.workspace.openTextDocument(NavFile).then(document => {
            const edit = new vscode.WorkspaceEdit();
            edit.insert(NavFile, new vscode.Position(0, 0), NewScreenNav_1.default.split('SCREEN_NAME').join(screenName));
            return vscode.workspace.applyEdit(edit).then(success => {
                if (success) {
                    vscode.window.showTextDocument(document);
                }
                else {
                    vscode.window.showInformationMessage('An error occured :(');
                }
            });
        });
        vscode.workspace.openTextDocument(IndexFile).then(document => {
            const edit = new vscode.WorkspaceEdit();
            edit.insert(IndexFile, new vscode.Position(0, 0), NewScreenIndex_1.default.split('SCREEN_NAME').join(screenName));
            return vscode.workspace.applyEdit(edit).then(success => {
                if (success) {
                    vscode.window.showTextDocument(document);
                }
                else {
                    vscode.window.showInformationMessage('An error occured :(');
                }
            });
        });
        const screenFilePath = vscode.Uri.parse(`${utils_1.getWorkspaceFolder()}/app/screens.tsx`);
        vscode.workspace.openTextDocument(screenFilePath).then(document => {
            const edit = new vscode.WorkspaceEdit();
            edit.insert(screenFilePath, new vscode.Position(10, 0), `import { register${screenName} } from '~/features/${path.join(uri.path, `${screenName}`).split('/features/')[1]}';\n`);
            // Search registerComponent available line
            const line = document.getText().split('\n').findIndex((lineValue) => /registerComponent\(\'Initializing\', InitializingScreen\);/g.test(lineValue));
            edit.insert(screenFilePath, new vscode.Position(line + 1, 0), `  register${screenName}();\n`);
            return vscode.workspace.applyEdit(edit).then(success => {
                if (success) {
                    vscode.window.showTextDocument(document);
                }
                else {
                    vscode.window.showInformationMessage('An error occured :(');
                }
            });
        });
    }
});
exports.default = createScreen;
//# sourceMappingURL=createScreen.js.map