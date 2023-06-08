// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { writeFileSync, readFileSync } from 'fs';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "scriptable" is now active!');

	vscode.commands.registerCommand('scriptable.extractScriptFile', (uri) => {
		const currentFileUri = uri.fsPath;
		const scriptFilePath = currentFileUri.replace('.scriptable', '.js');
		const scriptableContent = readFileSync(currentFileUri, 'utf-8');
		const scriptContent = JSON.parse(scriptableContent).script;

		writeFileSync(scriptFilePath, scriptContent);

		vscode.workspace.openTextDocument(scriptFilePath).then((document) => {
			vscode.window.showTextDocument(document);
		});
	});

	vscode.commands.registerCommand('scriptable.compileScriptableFile', (uri) => {

		const currentFileUri = uri.fsPath;
		const scriptableFilePath = currentFileUri.replace('.js', '.scriptable');
		const jsFilePath = currentFileUri;

		const jsContent = readFileSync(jsFilePath, 'utf-8');

		const scriptableContent = readFileSync(scriptableFilePath, 'utf-8');
		const scriptableObject = JSON.parse(scriptableContent);

		scriptableObject.script = jsContent;
		console.log(scriptableObject);
		writeFileSync(scriptableFilePath, sanitizeContent(JSON.stringify(scriptableObject, null, 2)));

		vscode.workspace.openTextDocument(scriptableFilePath).then((document) => {
			vscode.window.showTextDocument(document);
		});
	});
}

function sanitizeContent(content: string) {
	const sanitizedContent = content
		.replace(/\//g, '\\/');
	return sanitizedContent;
}

// This method is called when your extension is deactivated
export function deactivate() { }
