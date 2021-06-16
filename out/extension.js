"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const utils_1 = require("./commands/utils");
const registerCommands_1 = require("./registerCommands");
let lukoStatusBar;
function activate(context) {
    registerCommands_1.registerAll(context);
    const isLukoWS = utils_1.isLukoWorkspace(false);
    lukoStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -100);
    if (isLukoWS) {
        lukoStatusBar.text = `$(pass-filled) Luko`;
    }
    else {
        lukoStatusBar.text = `$(alert) Luko Workspace not found !`;
    }
    lukoStatusBar.show();
}
exports.activate = activate;
function deactivate() {
    lukoStatusBar.hide();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map