# monorun

For a single repository, you can access all the scripts you can run anywhere within the project structure. When you're in any directory, you'll have a list of all the scripts defined in package.json you can execute. You can easily select the script you want to run using auto-completion or arrow keys. After confirmation, the chosen script will be executed, simplifying your project work.

In a multi-repository setup, you have access to the list of scripts from the root package.json if you're not in the terminal within a specific package. When you're in the terminal within a package, you have the option to choose between two scopes: the current package or the root repository. You'll get a list of available scripts that you can select or quickly find using auto-completion and run.

This is great because it eliminates the need to switch between package and repository roots in the terminal and automatically lists all the package.json scripts for you to choose from, making your workflow more efficient.

![Preview](https://homoky-2022.objects-us-east-1.dream.io/hgBYpDro.gif)`

## Features

- Intelligently detects whether you're in the root or deep within a monorepo package. When in the root, it offers root-level scripts. When elsewhere, it prompts you to choose between package-specific or root-level scripts, tailoring the options accordingly
- Execute scripts defined in your package.json with ease
- Enjoy built-in autocompletion
- Suitable for both monorepo and single-package projects
- Automatically detects the package manager; supports npm, pnpm, yarn, and bun
- Forget script names; we provide script suggestions for you
- After selecting a script, it becomes interactive, mimicking user-initiated execution

## Installation

You can install this package globally to use it as a command-line tool:

```bash
npm install -g monorun
```

## Aliases

- `monorun`
- `mrun`
- `run`

## Usage

To use this package, run it from the command line:

```bash
monorun
```

Follow the prompts to select the scope (current package or project root) and script you want to run.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to help improve this package.

## License

This package is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
