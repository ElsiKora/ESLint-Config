<p align="center">
  <img src="https://6jft62zmy9nx2oea.public.blob.vercel-storage.com/eslintconfig-bXk1q9MhiaTOgJbp6VOt82kSdJYuYG.png" width="500" alt="project-logo">
</p>

<h1 align="center">ESLint-Config 🎯</h1>
<p align="center"><em>A comprehensive ESLint configuration system for modern TypeScript and JavaScript projects</em></p>

<p align="center">
    <a aria-label="ElsiKora logo" href="https://elsikora.com">
  <img src="https://img.shields.io/badge/MADE%20BY%20ElsiKora-333333.svg?style=for-the-badge" alt="ElsiKora">
</a> <img src="https://img.shields.io/badge/version-blue.svg?style=for-the-badge&logo=npm&logoColor=white" alt="version"> <img src="https://img.shields.io/badge/typescript-blue.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript"> <img src="https://img.shields.io/badge/eslint-purple.svg?style=for-the-badge&logo=eslint&logoColor=white" alt="eslint"> <img src="https://img.shields.io/badge/license-green.svg?style=for-the-badge&logo=license&logoColor=white" alt="license"> <img src="https://img.shields.io/badge/node-green.svg?style=for-the-badge&logo=node.js&logoColor=white" alt="node">
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

ESLint-Config is a sophisticated ESLint configuration manager designed to provide robust linting rules for modern
JavaScript and TypeScript applications. It offers specialized configurations for various frameworks and tools including
React, Next.js, NestJS, and more. The project focuses on maintaining code quality and consistency across different
project types while providing flexible configuration options through a modular architecture.

## 🚀 Features

- ✨ **Comprehensive TypeScript support with strict type checking rules**
- ✨ **Framework-specific configurations for React, Next.js, and NestJS**
- ✨ **Modular architecture allowing selective rule activation**
- ✨ **Built-in Prettier integration for consistent code formatting**
- ✨ **Custom naming convention rules for improved code consistency**
- ✨ **Automatic plugin name and rule prefix remapping**
- ✨ **Support for modern JavaScript features and best practices**
- ✨ **Integration with popular tools like Tailwind CSS and TypeORM**
- ✨ **Extensive test coverage with unit and E2E tests**
- ✨ **Custom rules for enforcing architectural patterns**

## 🛠 Installation

```bash
npm install --save-dev @elsikora/eslint-config

# Install peer dependencies
npm install --save-dev eslint typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

## 💡 Usage

### Basic Configuration

Create an `eslint.config.js` file in your project root:

```javascript
import { createConfig } from '@elsikora/eslint-config';

export default await createConfig({
	withTypescript: true,
	withPrettier: true
});
```

### TypeScript Configuration

For TypeScript projects with strict type checking:

```javascript
import { createConfig } from '@elsikora/eslint-config';

export default await createConfig({
	withTypescript: true,
	withStylistic: true,
	withSonar: true
});
```

### React Configuration

For React projects with Next.js support:

```javascript
import { createConfig } from '@elsikora/eslint-config';

export default await createConfig({
	withTypescript: true,
	withReact: true,
	withNext: true,
	withJsx: true
});
```

### NestJS Configuration

For NestJS applications:

```javascript
import { createConfig } from '@elsikora/eslint-config';

export default await createConfig({
	withTypescript: true,
	withNest: true,
	withTypeorm: true
});
```

### Advanced Usage

Custom configuration with multiple features:

```javascript
import { createConfig } from '@elsikora/eslint-config';

export default await createConfig({
	withTypescript: true,
	withReact: true,
	withNext: true,
	withPrettier: true,
	withTailwindCss: true,
	withSonar: true,
	withStylistic: true,
	withPerfectionist: true
});
```

### CLI Usage

Run ESLint with the configuration:

```bash
# Check files
npx eslint "src/**/*.{ts,tsx}"

# Fix automatically fixable problems
npx eslint "src/**/*.{ts,tsx}" --fix
```

## 🛣 Roadmap

| Task / Feature                                                                                                                                            | Status         |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| - Add support for Vue.js and Angular frameworks                                                                                                           | 🚧 In Progress |
| - Implement AI-powered rule suggestions                                                                                                                   | 🚧 In Progress |
| - Create a web interface for configuration generation                                                                                                     | 🚧 In Progress |
| - Add support for more specialized TypeScript patterns                                                                                                    | 🚧 In Progress |
| - Develop custom rules for microservices architecture                                                                                                     | 🚧 In Progress |
| - Integrate with more build tools and CI/CD platforms                                                                                                     | 🚧 In Progress |
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

Q: Can I use this configuration with JavaScript-only projects?
A: Yes, the configuration supports both JavaScript and TypeScript projects. Simply disable the TypeScript options in the
config.

Q: How does it handle conflicts with Prettier?
A: The configuration automatically handles Prettier conflicts when withPrettier option is enabled.

Q: Can I extend the configuration?
A: Yes, you can extend or override any rules by adding your custom rules after the main configuration.

Q: Does it support monorepos?
A: Yes, you can use different configurations for different packages in your monorepo by creating separate
eslint.config.js files.

## 🔒 License

This project is licensed under **MIT License - Copyright (c) 2025 ElsiKora**.

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for details.
