<p align="center">
  <img src="https://6jft62zmy9nx2oea.public.blob.vercel-storage.com/eslintconfig-bXk1q9MhiaTOgJbp6VOt82kSdJYuYG.png" width="500" alt="project-logo">
</p>

<h1 align="center">ESLint-Config 🛡️</h1>
<p align="center"><em>A comprehensive and modular ESLint configuration system by ElsiKora</em></p>

<p align="center">
    <a aria-label="ElsiKora logo" href="https://elsikora.com">
  <img src="https://img.shields.io/badge/MADE%20BY%20ElsiKora-333333.svg?style=for-the-badge" alt="ElsiKora">
</a> <img src="https://img.shields.io/badge/version-blue.svg?style=for-the-badge&logo=npm&logoColor=white" alt="version"> <img src="https://img.shields.io/badge/typescript-blue.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript"> <img src="https://img.shields.io/badge/eslint-4B32C3.svg?style=for-the-badge&logo=eslint&logoColor=white" alt="eslint"> <img src="https://img.shields.io/badge/license-MIT.svg?style=for-the-badge&logo=license&logoColor=white" alt="license"> <img src="https://img.shields.io/badge/node-green.svg?style=for-the-badge&logo=node.js&logoColor=white" alt="node"> <img src="https://img.shields.io/badge/dependencies-red.svg?style=for-the-badge&logo=npm&logoColor=white" alt="dependencies">
</p>

## 📚 Table of Contents

- [Description](#-description)
- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [Roadmap](#-roadmap)
- [FAQ](#-faq)
- [License](#-license)

## 📖 Description

ESLint-Config provides a sophisticated, modular ESLint configuration system that simplifies the enforcement of
consistent code style and quality standards across projects. It offers a range of specialized rule sets for various
environments, frameworks, and languages including TypeScript, React, Next.js, NestJS, and more. By adopting this
package, development teams can ensure code consistency, reduce bugs, improve maintainability, and accelerate onboarding
processes for new team members. The plugin-based architecture makes it easy to adapt to different project requirements
while maintaining a consistent coding style across your organization.

## 🚀 Features

- ✨ **✅ Highly modular and customizable configuration system with granular control**
- ✨ **✅ Comprehensive TypeScript support with strict type checking and naming conventions**
- ✨ **✅ First-class React, Next.js and NestJS integration with specialized rules**
- ✨ **✅ Built-in support for modern CSS, Tailwind, JSON, YAML and Markdown linting**
- ✨ **✅ Format-agnostic with Prettier compatibility for consistent code style**
- ✨ **✅ Advanced code quality rules from SonarJS and perfectionists**
- ✨ **✅ Robust file structure enforcement with check-file plugin**
- ✨ **✅ Smart plugin name remapping to avoid conflicts**
- ✨ **✅ Optimized for monorepos and multi-framework projects**
- ✨ **✅ Extensive test coverage and E2E validation**

## 🛠 Installation

```bash
# Using npm
npm install --save-dev @elsikora/eslint-config

# Using yarn
yarn add --dev @elsikora/eslint-config

# Using pnpm
pnpm add --save-dev @elsikora/eslint-config

# Using bun
bun add --dev @elsikora/eslint-config


Optional dependencies will be installed based on your configuration requirements. For example, if you plan to use TypeScript linting, ensure you have the TypeScript-related ESLint plugins installed.
```

## 💡 Usage

## Basic Usage

Create an `eslint.config.js` file at the root of your project:

```javascript
import { createConfig } from "@elsikora/eslint-config";

export default createConfig({
	withTypescript: true,
	withPrettier: true
});
```

## With Ignore Patterns

```javascript
import { createConfig } from "@elsikora/eslint-config";

const config = {
	ignores: [
		"node_modules/**",
		"dist/**",
		"build/**",
		"coverage/**"
	]
};

export default [
	config,
	...(await createConfig({
		withTypescript: true,
		withJavascript: true,
		withPrettier: true
	}))
];
```

## TypeScript Project Configuration

For a TypeScript project with React:

```javascript
import { createConfig } from "@elsikora/eslint-config";

export default createConfig({
	withTypescript: true,
	withReact: true,
	withStylistic: true,
	withSonar: true
});
```

## NestJS Backend Configuration

```javascript
import { createConfig } from "@elsikora/eslint-config";

export default createConfig({
	withTypescript: true,
	withNest: true,
	withTypeorm: true,
	withNode: true
});
```

## Next.js Full-Stack Configuration

```javascript
import { createConfig } from "@elsikora/eslint-config";

export default createConfig({
	withTypescript: true,
	withReact: true,
	withNext: true,
	withTailwindCss: true,
	withNode: true,
	withPrettier: true
});
```

## Available Configuration Options

The configuration factory accepts the following options:

```typescript
interface IConfigOptions {
	withCheckFile?: boolean;      // File structure and naming convention rules
	withCss?: boolean;           // CSS linting
	withJavascript?: boolean;    // JavaScript rules
	withJsDoc?: boolean;         // JSDoc validation
	withJson?: boolean;          // JSON linting
	withJsx?: boolean;           // JSX a11y rules
	withMarkdown?: boolean;      // Markdown linting
	withNest?: boolean;          // NestJS specific rules
	withNext?: boolean;          // Next.js specific rules
	withNode?: boolean;          // Node.js specific rules
	withPackageJson?: boolean;   // package.json validation
	withPerfectionist?: boolean; // Sorting imports, props, etc.
	withPrettier?: boolean;      // Prettier integration
	withReact?: boolean;         // React rules
	withRegexp?: boolean;        // RegExp validation
	withSonar?: boolean;         // SonarJS code quality rules
	withStylistic?: boolean;     // Code style rules
	withTailwindCss?: boolean;   // Tailwind CSS specific rules
	withTypeorm?: boolean;       // TypeORM specific rules
	withTypescript?: boolean;    // TypeScript rules
	withUnicorn?: boolean;       // Unicorn rules
	withYaml?: boolean;          // YAML linting
}
```

## CLI Usage

Run ESLint using your configured rules:

```bash
# Check files
npx eslint "src/**/*.{ts,tsx,js,jsx}"

# Fix issues automatically
npx eslint "src/**/*.{ts,tsx,js,jsx}" --fix
```

## Package.json Integration with lint-staged

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## VS Code Integration

Create a `.vscode/settings.json` file:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "typescript",
    "javascriptreact",
    "typescriptreact",
    "json",
    "jsonc",
    "yaml"
  ]
}
```

## Advanced: Custom Rule Extension

You can extend the configuration with your own custom rules:

```javascript
import { createConfig } from "@elsikora/eslint-config";

export default [
	...(await createConfig({
		withTypescript: true,
		withReact: true
	})),
	{
		rules: {
			// Override or add custom rules
			"@elsikora-typescript/naming-convention": ["error", {
				// Your custom configuration
			}]
		}
	}
];
```

## 🛣 Roadmap

| Task / Feature                                                                                                                                            | Status         |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| Future plans for ESLint-Config include:                                                                                                                   | 🚧 In Progress |
| - Expanded configuration options for additional frameworks and libraries                                                                                  | 🚧 In Progress |
| - Integration with more language servers for better IDE support                                                                                           | 🚧 In Progress |
| - Pre-built configurations for common project types (monorepo, microservices, etc.)                                                                       | 🚧 In Progress |
| - Custom rule generator for organization-specific standards                                                                                               | 🚧 In Progress |
| - Performance optimizations for large codebases                                                                                                           | 🚧 In Progress |
| - Expanded test coverage with more framework-specific test cases                                                                                          | 🚧 In Progress |
| - Web-based configuration tool for generating custom configurations                                                                                       | 🚧 In Progress |
| - Integration with more CI/CD platforms                                                                                                                   | 🚧 In Progress |
| **Completed tasks from CHANGELOG:**                                                                                                                       |                |
| **config:** javascript and typescript configs push ([b4d52fa](https://github.com/ElsiKora/ESLint-Config/commit/b4d52fa0c5f6288c95671a65bed5655d790dd0ba)) | ✅ Done         |
| b0a2622: Add licensing setup and improve ESLint configurations                                                                                            | ✅ Done         |
| f5ff96f: Update package version to 3.2.2 and add dependencies                                                                                             | ✅ Done         |
| e130422: Refactor ESLint CLI and feature configurations                                                                                                   | ✅ Done         |
| 724aa99: Enhance gitignore handling in CLI setup process                                                                                                  | ✅ Done         |
| 924e701: Add automated .gitignore configuration in CLI setup                                                                                              | ✅ Done         |
| 10dd85f: Added GitHub CI and Changesets, bug fixes                                                                                                        | ✅ Done         |
| c617e39: Added GitHub CI and Changesets, bug fixes                                                                                                        | ✅ Done         |
| 22b3e8e: Updated                                                                                                                                          | ✅ Done         |
| 545cdc3: Updated                                                                                                                                          | ✅ Done         |
| f3ebdb2: Updated                                                                                                                                          | ✅ Done         |
| feed5d9: Updated                                                                                                                                          | ✅ Done         |
| 1530118: Updated formats                                                                                                                                  | ✅ Done         |
| e0207ae: Update                                                                                                                                           | ✅ Done         |
| eb5978e: Remove ESLint configuration files                                                                                                                | ✅ Done         |
| 7faa539: Update eslint-plugin-sonarjs version                                                                                                             | ✅ Done         |
| da065c9: Update eslint-plugin-unused-imports version                                                                                                      | ✅ Done         |
| 41904f8: Update src/react.js with new configurations                                                                                                      | ✅ Done         |
| b7e4114: Add react.js to package.json                                                                                                                     | ✅ Done         |
| 8ed4d7b: Add support for React in eslint configuration                                                                                                    | ✅ Done         |
| d1397a2: Add TypeScript resolver to eslint configuration                                                                                                  | ✅ Done         |
| f39fafb: Update dependency version and eslint format for Readonly properties                                                                              | ✅ Done         |
| bacf14c: Add Snyk, Qodana, and CodeCommit workflows; update eslint rules                                                                                  | ✅ Done         |
| 4ea686c: Add peer dependency and refactor README paths                                                                                                    | ✅ Done         |
| 4855b6a: Update main file and fix README links                                                                                                            | ✅ Done         |
| 4855b6a: Update main file and fix README links                                                                                                            | ✅ Done         |
| 8cce705: Update postbuild script and README with detailed configs                                                                                         | ✅ Done         |
| 909b60d: Optimize build script and update files list in package.json                                                                                      | ✅ Done         |
| 053c4d9: Refactor package structure and improve build process                                                                                             | ✅ Done         |
| 1cb8e4c: Convert project to use ECMAScript modules                                                                                                        | ✅ Done         |
| 68069a5: Update filename and folder naming conventions in configuration                                                                                   | ✅ Done         |
| de6cf23: Remove specific parserOptions and settings in typescript.js                                                                                      | ✅ Done         |
| 951eaec: Add detailed linting rules and configurations                                                                                                    | ✅ Done         |
| ecf92eb: Add readme file and update package.json scripts                                                                                                  | ✅ Done         |
| 2577937: Added NestJS config                                                                                                                              | ✅ Done         |
| 2577937: Added basic JavaScript rules                                                                                                                     | ✅ Done         |

## ❓ FAQ

## Frequently Asked Questions

### How do I migrate from a traditional .eslintrc configuration?

ESLint 9.x and above use the new flat config format. To migrate, convert your existing .eslintrc file to an
eslint.config.js file and use the createConfig function with the appropriate options to match your previous setup.

### Will this work with my editor's ESLint plugin?

Yes, modern editor ESLint plugins (VS Code, WebStorm, etc.) support the new flat config format used by this package.

### How does this handle conflicting rules between plugins?

The configuration has been carefully designed to avoid rule conflicts. When conflicts might occur, we've established a
priority system, generally favoring TypeScript-specific rules over general ESLint rules when applicable.

### Can I use this with Prettier?

Yes! Enable the `withPrettier` option to integrate Prettier. This will ensure ESLint doesn't conflict with Prettier's
formatting rules.

### Does this support React Native projects?

Yes, you can use this with React Native by enabling the `withReact` option. Additional React Native specific rules may
need to be added separately.

### How do I debug rule conflicts or issues?

You can run ESLint with the `--debug` flag to see detailed information about rule resolution and conflicts:

```bash
npx eslint --debug src/file.ts
```

### How can I contribute to this project?

Contributions are welcome! Please check the contribution guidelines in the repository for information on how to submit
issues or pull requests.

## 🔒 License

This project is licensed under **MIT License

Copyright (c) 2025 ElsiKora

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.**.

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for details.
