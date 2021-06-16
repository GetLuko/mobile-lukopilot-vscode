import * as vscode from 'vscode';
import createScreen from './commands/createScreen';
import createFeatureFlag from './commands/createFeatureFlag';
// Do not forget to add commands in the package.json
const commands = [
    {
        name: 'squad-app-ext.createScreen',
        action: createScreen,
    },
    {
        name: 'squad-app-ext.createFeatureFlag',
        action: createFeatureFlag,
    }
];

export const registerAll = (ctx: vscode.ExtensionContext) => {
    commands.forEach((cmd) => {
        let disposable = vscode.commands.registerCommand(cmd.name, (uri: vscode.Uri) => cmd.action(ctx, uri));
        ctx.subscriptions.push(disposable);
    });
};