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
const utils_1 = require("./utils");
const prompt = {
    prompt: 'What is the Feature Flags\'s name ?',
    placeHolder: 'Feature Flag\'s name (i.e.: app_user_unlogged_enable )'
};
const promptDefaultFlag = {
    prompt: 'What is the Feature Flags\'s default value ?',
    placeHolder: 'What is the Feature Flags\'s default value ? true | false'
};
const createFeatureFlag = (ctx, uri) => __awaiter(void 0, void 0, void 0, function* () {
    if (!utils_1.isLukoWorkspace()) {
        return;
    }
    const featureFlagName = yield vscode.window.showInputBox(prompt);
    const defaultFlagValue = yield vscode.window.showInputBox(promptDefaultFlag);
    if (!featureFlagName) {
        return;
    }
    ;
    const formatedFF = utils_1.formatFeatureFlagName(featureFlagName);
    const configFilePath = vscode.Uri.parse(`${utils_1.getWorkspaceFolder()}/app/core/featuresFlags/config.ts`);
    const e2eFilePath = vscode.Uri.parse(`${utils_1.getWorkspaceFolder()}/app/core/featuresFlags/index.e2e.ts`);
    const indexFilePath = vscode.Uri.parse(`${utils_1.getWorkspaceFolder()}/app/core/featuresFlags/index.ts`);
    const fixtureFilePath = vscode.Uri.parse(`${utils_1.getWorkspaceFolder()}/app/core/featuresFlags/__tests__/featureFlags.fixture.ts`);
    /* =========== Update Config File =========== */
    vscode.workspace.openTextDocument(configFilePath).then(document => {
        const edit = new vscode.WorkspaceEdit();
        edit.insert(configFilePath, new vscode.Position(3, 0), `export const ${featureFlagName.toLocaleUpperCase()} = '${featureFlagName}';\n`);
        const line = document.getText().split('\n').findIndex((lineValue) => /export const defaultConfig = {/g.test(lineValue));
        edit.insert(configFilePath, new vscode.Position(line + 1, 0), `  [${featureFlagName.toLocaleUpperCase()}]: ${defaultFlagValue},\n`);
        return vscode.workspace.applyEdit(edit).then(success => {
            if (success) {
                vscode.window.showTextDocument(document);
            }
            else {
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
            }
            else {
                vscode.window.showInformationMessage('An error occured :(');
            }
        });
    });
    /* =========== Update index File =========== */
    vscode.workspace.openTextDocument(indexFilePath).then(document => {
        const edit = new vscode.WorkspaceEdit();
        const flagsLine = document.getText().split('\n').findIndex((lineValue) => /export const featureFlags = {/g.test(lineValue));
        console.log("DEBUG ", `  is${formatedFF}: () => isFeatureFlagEnabled(FLAGS.${featureFlagName.toLocaleUpperCase()}),\n`);
        edit.insert(indexFilePath, new vscode.Position(flagsLine + 1, 0), `  is${formatedFF}: () => isFeatureFlagEnabled(FLAGS.${featureFlagName.toLocaleUpperCase()}),\n`);
        return vscode.workspace.applyEdit(edit).then(success => {
            if (success) {
                vscode.window.showTextDocument(document);
            }
            else {
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
            }
            else {
                vscode.window.showInformationMessage('An error occured :(');
            }
        });
    });
});
exports.default = createFeatureFlag;
//# sourceMappingURL=createFeatureFlag.js.map