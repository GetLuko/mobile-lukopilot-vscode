import * as vscode from 'vscode';
import createScreen from './commands/createScreen';

// Do not forget to add commands in the package.json
const commands = [
    {
        name: 'luko-app.createScreen',
        action: createScreen,
    }
];

export const registerAll = (ctx: vscode.ExtensionContext) => {
    commands.forEach((cmd) => {
        let disposable = vscode.commands.registerCommand(cmd.name, (uri: vscode.Uri) => cmd.action(ctx, uri));
        ctx.subscriptions.push(disposable);
    });
};