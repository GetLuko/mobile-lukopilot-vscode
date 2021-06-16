"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAll = void 0;
const vscode = require("vscode");
const createScreen_1 = require("./commands/createScreen");
const createFeatureFlag_1 = require("./commands/createFeatureFlag");
// Do not forget to add commands in the package.json
const commands = [
    {
        name: 'squad-app-ext.createScreen',
        action: createScreen_1.default,
    },
    {
        name: 'squad-app-ext.createFeatureFlag',
        action: createFeatureFlag_1.default,
    }
];
const registerAll = (ctx) => {
    commands.forEach((cmd) => {
        let disposable = vscode.commands.registerCommand(cmd.name, (uri) => cmd.action(ctx, uri));
        ctx.subscriptions.push(disposable);
    });
};
exports.registerAll = registerAll;
//# sourceMappingURL=registerCommands.js.map