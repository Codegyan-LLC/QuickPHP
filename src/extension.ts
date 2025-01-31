import { exec } from 'child_process';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let currentDecorationType: vscode.TextEditorDecorationType | undefined;
let errorDecorationType: vscode.TextEditorDecorationType | undefined;
let timeout: NodeJS.Timeout | undefined;

// Default configuration
const defaultConfig = {
    executionDelay: 300, // Delay in milliseconds before executing code
    phpPath: 'php', // Path to PHP executable
    inlineColor: 'grey',
};

function activate(context: vscode.ExtensionContext) {
    const textChangeDisposable = vscode.workspace.onDidChangeTextDocument((event) => {
        const editor = vscode.window.activeTextEditor;
        if (editor && event.document === editor.document) {
            updateOutput(editor);
        }
    });

    const selectionChangeDisposable = vscode.window.onDidChangeTextEditorSelection((event) => {
        const editor = event.textEditor;
        updateOutput(editor);
    });

    const blockExecutionDisposable = vscode.commands.registerCommand('quickphp.runBlock', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            runSelectedBlock(editor);
        }
    });

    context.subscriptions.push(textChangeDisposable, selectionChangeDisposable, blockExecutionDisposable);
}

function updateOutput(editor: vscode.TextEditor) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        const currentLine = editor.selection.active.line;
        const currentLineText = editor.document.lineAt(currentLine).text.trim();
        if (currentLineText.startsWith('echo ') || currentLineText.includes('print') || currentLineText.includes('$')) {
            const documentText = editor.document.getText();
            runPHPCode(documentText, editor, currentLine);
        } else {
            clearOutput(editor);
        }
    }, defaultConfig.executionDelay);
}

function clearOutput(editor: vscode.TextEditor) {
    if (currentDecorationType) {
        editor.setDecorations(currentDecorationType, []);
        currentDecorationType.dispose();
        currentDecorationType = undefined;
    }
    if (errorDecorationType) {
        editor.setDecorations(errorDecorationType, []);
        errorDecorationType.dispose();
        errorDecorationType = undefined;
    }
}

// function runPHPCode(code: string, editor: vscode.TextEditor, currentLine: number) {
//     const tempFilePath = path.join(__dirname, 'quickphp.php');
// 	fs.writeFileSync(tempFilePath, `${code}`);

//     const phpPath = vscode.workspace.getConfiguration('quickphp').get<string>('phpPath') || defaultConfig.phpPath;
//     const startTime = Date.now();

//     exec(`${phpPath} "${tempFilePath}"`, (error, stdout, stderr) => {
//         const endTime = Date.now();
//         const executionTime = ((endTime - startTime) / 1000).toFixed(2);

//         if (error || stderr) {
//             clearOutput(editor);
//             displayInlineOutput(`Error: ${stderr.trim() || (error ? error.message : 'Unknown error')}`, editor, currentLine, executionTime, true);
//         } else {
//             clearOutput(editor);
//             displayInlineOutput(stdout.trim(), editor, currentLine, executionTime);
//         }
//         fs.unlinkSync(tempFilePath);
//     });
// }

function runPHPCode(code: string, editor: vscode.TextEditor, currentLine: number) {
    let filePath = editor.document.uri.fsPath; // Get the actual file path from the open document
    let isTempFile = false;

    // If the file is untitled (new unsaved file), use a temporary file
    if (!filePath || editor.document.isUntitled) {
        filePath = path.join(__dirname, 'quickphp.php');
        fs.writeFileSync(filePath, `<?php\n${code}\n?>`);
        isTempFile = true;
    }

    const phpPath = vscode.workspace.getConfiguration('quickphp').get<string>('phpPath') || 'php';
    const startTime = Date.now();

    exec(`${phpPath} "${filePath}"`, (error, stdout, stderr) => {
        const endTime = Date.now();
        const executionTime = ((endTime - startTime) / 1000).toFixed(2);

        console.log(`Executing: ${phpPath} "${filePath}"`);
        console.log(`Stdout: ${stdout}`);
        console.log(`Stderr: ${stderr}`);
        console.log(`Error: ${error}`);

        if (error || stderr) {
            clearOutput(editor);
            let errorMessage = stderr.trim() || (error ? error.message : 'Unknown error');

            // Replace temp file path with actual file path in errors
            if (isTempFile) {
                errorMessage = errorMessage.replace(filePath, 'Current File');
            }

            displayInlineOutput(`Error: ${errorMessage}`, editor, currentLine, executionTime, true);
        } else {
            clearOutput(editor);
            displayInlineOutput(stdout.trim(), editor, currentLine, executionTime);
        }

        // Delete temp file if used
        if (isTempFile) {
            fs.unlinkSync(filePath);
        }
    });
}

function runSelectedBlock(editor: vscode.TextEditor) {
    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    if (!selectedText.trim()) {
        vscode.window.showErrorMessage('No PHP code selected to execute.');
        return;
    }

    const tempFilePath = path.join(__dirname, 'quickphp_block.php');
	fs.writeFileSync(tempFilePath, `${selectedText}`);

    const phpPath = vscode.workspace.getConfiguration('quickphp').get<string>('phpPath') || defaultConfig.phpPath;

    exec(`${phpPath} "${tempFilePath}"`, (error, stdout, stderr) => {
        if (error || stderr) {
            clearOutput(editor);
            vscode.window.showErrorMessage(stderr.trim() || (error ? error.message : 'Unknown error'));
        } else {
            vscode.window.showInformationMessage(stdout.trim());
        }
        fs.unlinkSync(tempFilePath);
    });
}

function displayInlineOutput(output: string, editor: vscode.TextEditor, currentLine: number, executionTime: string, isError = false) {
    if (!output.trim()) {return;}
    clearOutput(editor);

    const color = isError ? 'red' : vscode.workspace.getConfiguration('quickphp').get<string>('inlineColor') || defaultConfig.inlineColor;
    const formattedOutput = isError ? `Error: ${output} (Execution Time: ${executionTime}s)` : `${output} (Execution Time: ${executionTime}s)`;

    const targetLineText = editor.document.lineAt(currentLine).text;
    const decorations: vscode.DecorationOptions[] = [
        {
            range: new vscode.Range(currentLine, targetLineText.length, currentLine, targetLineText.length),
            renderOptions: {
                after: {
                    contentText: ` // ${formattedOutput}`,
                    color,
                },
            },
        },
    ];

    currentDecorationType = vscode.window.createTextEditorDecorationType({});
    editor.setDecorations(currentDecorationType, decorations);
}

function deactivate() {
    if (currentDecorationType) {currentDecorationType.dispose();}
    if (errorDecorationType) {errorDecorationType.dispose();}
}

module.exports = { activate, deactivate };
