# QuickPHP - PHP Inline Execution for VS Code

**QuickPHP** is a lightweight VS Code extension that executes PHP code inline, similar to how QuickPy works for PHP. It helps PHP developers see their output directly within the editor, without switching to the terminal.

<p align="center">
    <img src="https://raw.githubusercontent.com/Codegyan-LLC/QuickPHP/refs/heads/main/images/use.gif" width="600" alt="QuickPHP Use">
</p>

## Getting Started

Installation

1. **VS Code Marketplace :**
    * Open Visual Studio Code.
    * Navigate to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X on macOS).
    * Search for QuickPHP.
    * Click "Install" to add the extension to your VS Code.

2. **Install from VSIX :**
   - Download the latest `.vsix` package from the [Releases](#) page.
   - Open Visual Studio Code.
   - Go to the Extensions view by clicking on the Extensions icon in the Activity Bar or pressing `Ctrl+Shift+X`.
   - Click on the ellipsis (`...`) in the top-right corner of the Extensions view and select "Install from VSIX...".
   - Navigate to the downloaded `.vsix` file and select it to install.

## Features

* `Inline Code Execution`: Run PHP code directly in the editor and display results as inline comments.
* `Real-Time Updates`: Automatically executes code on text changes or cursor movements.
* `Error Feedbac`k: Catch errors like NameError and display clear, formatted messages inline.
* `Temporary File Execution`: Ensures safe execution using temporary files without modifying your project files.
* `Output Formatting`: Displays clean and non-intrusive inline output for easy readability.
* `Enhanced Debugging`: Provides feedback for incomplete or invalid code to help developers debug faster.


## Usage

<p align="center">
    <img src="https://raw.githubusercontent.com/Codegyan-LLC/QuickPHP/refs/heads/main/images/code.png" width="600" alt="QuickPHP Example">
</p>

### Auto Execution

Just write a PHP echo, print_r, or var_dump statement, and the output will appear inline.

``` php
echo "Hello, QuickPHP!";
// Output: Hello, QuickPHP!
```

### Error Highlighting

Errors are shown inline, with the file and line number.
``` php
echo $undefinedVar;
// Error: Undefined variable $undefinedVar (line 3)
```

## Known Issues
* Large scripts or complex logic may cause delays in execution.
* Inline execution is limited to the lines above the current cursor.

Feel free to report bugs or suggest features by opening an issue on GitHub.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request on the Github.

## License

This extension is licensed under the **[MIT license](https://opensource.org/licenses/MIT)**..


## Contact

For questions or feedback, please contact support@codegyan.in.

---

Thank you for using **QuickPHP**! We hope it enhances your coding experience.


