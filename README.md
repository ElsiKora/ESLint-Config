<p align="center">
  <img src="https://6jft62zmy9nx2oea.public.blob.vercel-storage.com/eslintconfig-bXk1q9MhiaTOgJbp6VOt82kSdJYuYG.png" width="500" alt="project-logo">
</p>

<h1 align="center">ESLint-Config 🎯</h1>
<p align="center"><em>Comprehensive ESLint configuration with TypeScript, React, and NestJS support using ESLint Flat config</em></p>

<p align="center">
    <a aria-label="ElsiKora logo" href="https://elsikora.com">
  <img src="https://img.shields.io/badge/MADE%20BY%20ElsiKora-333333.svg?style=for-the-badge" alt="ElsiKora">
</a> <img src="https://img.shields.io/badge/version-blue.svg?style=for-the-badge&logo=npm&logoColor=white" alt="version"> <img src="https://img.shields.io/badge/typescript-blue.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript"> <img src="https://img.shields.io/badge/eslint-purple.svg?style=for-the-badge&logo=eslint&logoColor=white" alt="eslint"> <img src="https://img.shields.io/badge/prettier-ff69b4.svg?style=for-the-badge&logo=prettier&logoColor=white" alt="prettier"> <img src="https://img.shields.io/badge/license-green.svg?style=for-the-badge&logo=license&logoColor=white" alt="license">
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

ESLint-Config is a powerful, extensible ESLint configuration system designed for modern JavaScript and TypeScript projects. It provides a robust set of rules and configurations that help maintain code quality and consistency across different frameworks and environments. The configuration is particularly optimized for TypeScript, React, and NestJS applications, offering specialized rules and best practices for each ecosystem.

## 🚀 Features

- ✨ **Modular configuration system with support for multiple frameworks**
- ✨ **Comprehensive TypeScript support with strict type checking**
- ✨ **Advanced React hooks and component validation rules**
- ✨ **NestJS-specific rules for better API documentation and controller structure**
- ✨ **Integration with Prettier for consistent code formatting**
- ✨ **Support for modern JavaScript features and best practices**
- ✨ **Custom naming conventions for different code elements**
- ✨ **Specialized rules for JSON, YAML, and package.json files**
- ✨ **Automatic import sorting and organization**
- ✨ **File naming convention enforcement**

## 🛠 Installation

```bash
npm install --save-dev @elsikora/eslint-config

# Install peer dependencies
npm install --save-dev eslint typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

## 💡 Usage

# Configuration Usage

## Basic Setup

Create an `eslint.config.js` file in your project root:

```javascript
import createConfig from "@elsikora/eslint-config";

export default await createConfig({
	withTypescript: true,
	withPrettier: true,
});
```

## TypeScript Configuration

For TypeScript projects, enable specific features:

```javascript
import createConfig from "@elsikora/eslint-config";

export default await createConfig({
	withTypescript: true,
	withPrettier: true,
	withSonar: true,
	withStylistic: true,
});
```

## React Configuration

For React projects:

```javascript
import createConfig from "@elsikora/eslint-config";

export default await createConfig({
	withTypescript: true,
	withReact: true,
	withPrettier: true,
	withTailwindCss: true,
});
```

## NestJS Configuration

For NestJS applications:

```javascript
import createConfig from "@elsikora/eslint-config";

export default await createConfig({
	withTypescript: true,
	withNest: true,
	withPrettier: true,
	withTypeorm: true,
});
```

## CLI Usage

Add scripts to your package.json:

```json
{
	"scripts": {
		"lint": "eslint .",
		"lint:fix": "eslint . --fix"
	}
}
```

## Advanced Configuration

Combine multiple configurations:

```javascript
import createConfig from "@elsikora/eslint-config";

export default await createConfig({
	withTypescript: true,
	withReact: true,
	withNest: true,
	withPrettier: true,
	withSonar: true,
	withStylistic: true,
	withPerfectionist: true,
	withUnicorn: true,
});
```

## 🛣 Roadmap

| Task / Feature                                                               | Status         |
| ---------------------------------------------------------------------------- | -------------- |
| - Integration with more frameworks and libraries                             | 🚧 In Progress |
| - Support for additional file types and configurations                       | 🚧 In Progress |
| - Enhanced performance optimization rules                                    | 🚧 In Progress |
| - Custom rule creation toolkit                                               | 🚧 In Progress |
| - Integration with CI/CD platforms                                           | 🚧 In Progress |
| - Extended documentation and examples                                        | 🚧 In Progress |
| - Rule impact analysis tools                                                 | 🚧 In Progress |
| **Completed tasks from CHANGELOG:**                                          |                |
| f5ff96f: Update package version to 3.2.2 and add dependencies                | ✅ Done        |
| e130422: Refactor ESLint CLI and feature configurations                      | ✅ Done        |
| 724aa99: Enhance gitignore handling in CLI setup process                     | ✅ Done        |
| 924e701: Add automated .gitignore configuration in CLI setup                 | ✅ Done        |
| 10dd85f: Added GitHub CI and Changesets, bug fixes                           | ✅ Done        |
| c617e39: Added GitHub CI and Changesets, bug fixes                           | ✅ Done        |
| 22b3e8e: Updated                                                             | ✅ Done        |
| 545cdc3: Updated                                                             | ✅ Done        |
| f3ebdb2: Updated                                                             | ✅ Done        |
| feed5d9: Updated                                                             | ✅ Done        |
| 1530118: Updated formats                                                     | ✅ Done        |
| e0207ae: Update                                                              | ✅ Done        |
| eb5978e: Remove ESLint configuration files                                   | ✅ Done        |
| 7faa539: Update eslint-plugin-sonarjs version                                | ✅ Done        |
| da065c9: Update eslint-plugin-unused-imports version                         | ✅ Done        |
| 41904f8: Update src/react.js with new configurations                         | ✅ Done        |
| b7e4114: Add react.js to package.json                                        | ✅ Done        |
| 8ed4d7b: Add support for React in eslint configuration                       | ✅ Done        |
| d1397a2: Add TypeScript resolver to eslint configuration                     | ✅ Done        |
| f39fafb: Update dependency version and eslint format for Readonly properties | ✅ Done        |
| bacf14c: Add Snyk, Qodana, and CodeCommit workflows; update eslint rules     | ✅ Done        |
| 4ea686c: Add peer dependency and refactor README paths                       | ✅ Done        |
| 4855b6a: Update main file and fix README links                               | ✅ Done        |
| 4855b6a: Update main file and fix README links                               | ✅ Done        |
| 8cce705: Update postbuild script and README with detailed configs            | ✅ Done        |
| 909b60d: Optimize build script and update files list in package.json         | ✅ Done        |
| 053c4d9: Refactor package structure and improve build process                | ✅ Done        |
| 1cb8e4c: Convert project to use ECMAScript modules                           | ✅ Done        |
| 68069a5: Update filename and folder naming conventions in configuration      | ✅ Done        |
| de6cf23: Remove specific parserOptions and settings in typescript.js         | ✅ Done        |
| 951eaec: Add detailed linting rules and configurations                       | ✅ Done        |
| ecf92eb: Add readme file and update package.json scripts                     | ✅ Done        |
| 2577937: Added NestJS config                                                 | ✅ Done        |
| 2577937: Added basic JavaScript rules                                        | ✅ Done        |

## ❓ FAQ

## Frequently Asked Questions

### How does this differ from standard ESLint configurations?

This configuration provides a more comprehensive and opinionated set of rules specifically tailored for TypeScript, React, and NestJS projects, with additional focus on code quality and maintainability.

### Can I use this with Create React App?

Yes, the configuration is compatible with Create React App projects. You'll need to eject or use tools like CRACO to override the default ESLint configuration.

### How do I override specific rules?

You can extend the configuration and override rules in your eslint.config.js file by adding custom rule configurations after the default export.

### Does this work with VS Code?

Yes, the configuration works seamlessly with VS Code's ESLint extension. Just ensure you have the ESLint extension installed and properly configured.

## 🔒 License

This project is licensed under **MIT License - Copyright (c) 2025 ElsiKora**.

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for details.
