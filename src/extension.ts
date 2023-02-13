import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('tab-destroyer.closetabs', async () => {
		const pattern = await vscode.window.showInputBox({
			prompt: "Enter a regex pattern that matches the tabs you want to close",
			title: "Tab Destroyer",
			placeHolder: ".*\\.js",
			validateInput: (value) => {
				if (!!value && value.length > 0) {
					try {
						new RegExp(value);
						return null;
					} catch (e) {
						return "Invalid regex pattern";
					}
				} else {
					return "Please enter a regex pattern";
				}
			}
		});

		const regex = new RegExp(pattern!);

		let closedTabCount = 0;
		vscode.window.tabGroups.all.forEach((tabGroup) => {
			tabGroup.tabs.forEach((tab) => {
				if (regex.test(tab.label)) {
					console.log("closing tab: " + tab.label);
					vscode.window.tabGroups.close(tab);
					closedTabCount += 1;
				}
			});
		});

		const message = closedTabCount > 0 ? `${closedTabCount} tab(s) closed` : "No tabs were closed";
		vscode.window.showInformationMessage(message);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
