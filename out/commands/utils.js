"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatFeatureFlagName = exports.capitalize = exports.isLukoWorkspace = exports.getWorkspaceFolder = void 0;
const vscode = require("vscode");
const getWorkspaceFolder = () => {
    if (vscode.workspace.workspaceFolders !== undefined) {
        return vscode.workspace.workspaceFolders[0].uri.path;
    }
};
exports.getWorkspaceFolder = getWorkspaceFolder;
const isLukoWorkspace = (showErrorMessage = true) => {
    if (vscode.workspace.workspaceFolders !== undefined) {
        const path = `${vscode.workspace.workspaceFolders[0].uri.path}/package.json`;
        try {
            const json = require(path);
            return json.name === 'Luko';
        }
        catch (_a) {
            showErrorMessage && vscode.window.showErrorMessage('Not in Luko\'s workspace');
            return false;
        }
    }
    showErrorMessage && vscode.window.showErrorMessage('Not in Luko\'s workspace');
    return false;
};
exports.isLukoWorkspace = isLukoWorkspace;
const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);
exports.capitalize = capitalize;
const formatFeatureFlagName = (ff) => ff.split('_').map((e) => exports.capitalize(e)).join('');
exports.formatFeatureFlagName = formatFeatureFlagName;
//# sourceMappingURL=utils.js.map