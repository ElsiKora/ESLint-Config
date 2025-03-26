<p align="center">
  <img src="https://6jft62zmy9nx2oea.public.blob.vercel-storage.com/eslintconfig-bXk1q9MhiaTOgJbp6VOt82kSdJYuYG.png" width="500" alt="project-logo">
</p>

<h1 align="center">🛡️ ESLint-Config</h1>
<p align="center"><em>ESLint configuration vision of ElsiKora</em></p>

<p align="center">
    <a aria-label="ElsiKora logo" href="https://elsikora.com">
  <img src="https://img.shields.io/badge/MADE%20BY%20ElsiKora-333333.svg?style=for-the-badge" alt="ElsiKora">
</a> <img src="https://img.shields.io/badge/version-blue.svg?style=for-the-badge&logo=npm&logoColor=white" alt="version"> <img src="https://img.shields.io/badge/license-green.svg?style=for-the-badge&logo=license&logoColor=white" alt="license"> <img src="https://img.shields.io/badge/typescript-blue.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript"> <img src="https://img.shields.io/badge/eslint-purple.svg?style=for-the-badge&logo=eslint&logoColor=white" alt="eslint"> <img src="https://img.shields.io/badge/code-coverage-brightgreen.svg?style=for-the-badge&logo=codecov&logoColor=white" alt="code-coverage"> <img src="https://img.shields.io/badge/npm-downloads-orange.svg?style=for-the-badge&logo=npm&logoColor=white" alt="npm-downloads">
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

ESLint-Config by ElsiKora is a comprehensive and highly customizable ESLint configuration system designed to enforce
coding standards across various JavaScript and TypeScript projects. It provides a modular approach to linting with
support for multiple frameworks including React, Next.js, NestJS, and more. The configuration is built with modern
JavaScript/TypeScript applications in mind, supporting various file types (JS, TS, JSX, TSX, JSON, YAML, CSS) and
integrating seamlessly with popular tools like Prettier. By using this configuration, teams can maintain consistent code
quality, catch potential bugs early, and enforce best practices across their entire codebase.

## 🚀 Features

- ✨ **Modular configuration system with support for 27+ different plugins**
- ✨ **Customizable TypeScript naming conventions and strict type checking**
- ✨ **Advanced React, Next.js and NestJS rule sets with best practices enforced**
- ✨ **Secret detection to prevent accidental credential exposure in code**
- ✨ **Integration with Prettier for consistent code formatting**
- ✨ **Feature-Sliced Design architectural pattern support**
- ✨ **TanStack Query and Router optimization rules**
- ✨ **Internationalization (i18next) support for proper translation usage**
- ✨ **Storybook testing standards enforcement**
- ✨ **File and folder naming conventions with automatic enforcement**
- ✨ **Comprehensive documentation and example configurations**

## 🛠 Installation

```bash
## Quick Start


npm install --save-dev @elsikora/eslint-config


Or if you prefer using yarn:


yarn add --dev @elsikora/eslint-config


Or with pnpm:


pnpm add -D @elsikora/eslint-config


## Required Dependencies

You'll need to install ESLint:


npm install --save-dev eslint


## Optional Dependencies

Some configurations require additional dependencies. Install them based on your needs:


# For React projects
npm install --save-dev eslint-plugin-react @eslint-react/eslint-plugin

# For TypeScript projects
npm install --save-dev typescript typescript-eslint

# For Next.js projects
npm install --save-dev @next/eslint-plugin-next

# For Prettier integration
npm install --save-dev eslint-plugin-prettier prettier
```

## 💡 Usage

## Basic Configuration

Create an `eslint.config.js` file in the root of your project:

```javascript
import { createConfig } from '@elsikora/eslint-config';

export default await createConfig({
	withJavascript: true,
	withTypescript: true,
	withPrettier: true
});
```

## Comprehensive TypeScript Configuration

Set up a more advanced configuration with TypeScript, React, and code quality plugins:

```javascript
import { createConfig } from '@elsikora/eslint-config';

const config = {
	ignores: [
		'dist',
		'node_modules',
		'.cache',
		'coverage'
	]
};

export default [
	config,
	...(await createConfig({
		withTypescript: true,
		withReact: true,
		withSonar: true,
		withUnicorn: true,
		withPerfectionist: true,
		withPrettier: true
	}))
];
```

## CLI Usage

Lint your code using the standard ESLint CLI:

```bash
# Lint all files in src directory
eslint "src/**/*.{js,ts,jsx,tsx}"

# Lint and fix automatically
eslint "src/**/*.{js,ts,jsx,tsx}" --fix
```

## Usage with Next.js

For Next.js projects, include the Next.js specific rules:

```javascript
import { createConfig } from '@elsikora/eslint-config';

export default await createConfig({
	withJavascript: true,
	withTypescript: true,
	withReact: true,
	withNext: true,
	withPrettier: true
});
```

## Usage with NestJS

For NestJS backend applications:

```javascript
import { createConfig } from '@elsikora/eslint-config';

export default await createConfig({
	withTypescript: true,
	withNest: true,
	withNode: true,
	withSonar: true,
	withPrettier: true
});
```

## Feature-Sliced Design Architecture

Support for Feature-Sliced Design architectural pattern:

```javascript
import { createConfig } from '@elsikora/eslint-config';

export default await createConfig({
	withTypescript: true,
	withReact: true,
	withFsd: true,
	withPerfectionist: true, // Will automatically configure for FSD imports ordering
	withPrettier: true
});
```

## Secret Detection

Enable rules to detect potential secrets in your code:

```javascript
import { createConfig } from '@elsikora/eslint-config';

export default await createConfig({
	withTypescript: true,
	withNoSecrets: true,
	withPrettier: true
});
```

## Advanced Usage: Custom Rule Configuration

You can extend the configuration with your own custom rules:

```javascript
import { createConfig } from '@elsikora/eslint-config';

const customRules = {
	rules: {
		'no-console': 'warn',
		'@elsikora/typescript/naming-convention': ['error', {
			// Custom naming convention overrides
		}]
	}
};

export default [
	...(await createConfig({
		withTypescript: true,
		withReact: true,
		withPrettier: true
	})),
	customRules
];
```

## Configuration Options

Here's a complete list of available configuration options:

```typescript
interface IConfigOptions {
	withCheckFile?: boolean;       // File naming conventions
	withCss?: boolean;            // CSS linting
	withFsd?: boolean;            // Feature-Sliced Design
	withI18next?: boolean;        // Internationalization
	withJavascript?: boolean;     // JavaScript rules
	withJsDoc?: boolean;          // JSDoc documentation
	withJson?: boolean;           // JSON files
	withJsx?: boolean;            // JSX accessibility
	withMarkdown?: boolean;       // Markdown files
	withNest?: boolean;           // NestJS framework
	withNext?: boolean;           // Next.js framework
	withNode?: boolean;           // Node.js environment
	withNoSecrets?: boolean;      // Secret detection
	withPackageJson?: boolean;    // package.json files
	withPerfectionist?: boolean;  // Code organization
	withPrettier?: boolean;       // Prettier integration
	withReact?: boolean;          // React framework
	withRegexp?: boolean;         // Regular expressions
	withSonar?: boolean;          // SonarJS rules
	withStorybook?: boolean;      // Storybook integration
	withStylistic?: boolean;      // Code style
	withTailwindCss?: boolean;    // TailwindCSS
	withTanstack?: boolean;       // TanStack Query/Router
	withTypeorm?: boolean;        // TypeORM
	withTypescript?: boolean;     // TypeScript
	withUnicorn?: boolean;        // Unicorn rules
	withYaml?: boolean;           // YAML files
}
```

## 🛣 Roadmap

| Task / Feature                 | Status         |
|--------------------------------|----------------|
| TypeScript naming conventions  | ✅ Done         |
| React support                  | ✅ Done         |
| Next.js integration            | ✅ Done         |
| NestJS support                 | ✅ Done         |
| Prettier integration           | ✅ Done         |
| TailwindCSS support            | ✅ Done         |
| Feature-Sliced Design          | ✅ Done         |
| TanStack Query/Router rules    | ✅ Done         |
| i18next translation rules      | ✅ Done         |
| Storybook integration          | ✅ Done         |
| Secret detection               | ✅ Done         |
| File naming conventions        | ✅ Done         |
| JSDoc validation               | ✅ Done         |
| CSS linting                    | ✅ Done         |
| Markdown support               | ✅ Done         |
| JSON file formatting           | ✅ Done         |
| YAML file support              | ✅ Done         |
| SonarJS integration            | ✅ Done         |
| Interactive CLI wizard         | 🚧 In Progress |
| ESLint plugin editor           | 🚧 In Progress |
| VS Code extension              | 🚧 In Progress |
| TypeScript 5.0+ features       | 🚧 In Progress |
| React Server Components        | 🚧 In Progress |
| Astro framework support        | 🚧 In Progress |
| Performance optimization rules | 🚧 In Progress |
| Web Components support         | 🚧 In Progress |
| Svelte integration             | 🚧 In Progress |
| Vue.js support                 | 🚧 In Progress |
| GraphQL validation             | 🚧 In Progress |

## ❓ FAQ

## Frequently Asked Questions

### Which ESLint version is supported?

This configuration requires ESLint v8.0.0 or higher and is built for the ESLint flat config system. It is not compatible
with older ESLint configurations using .eslintrc files.

### How do I use this with TypeScript?

Install typescript and typescript-eslint as dev dependencies, then enable the `withTypescript` option in your
configuration.

### Can I use this with Create React App?

Yes, but you'll need to configure it to use ESLint's flat config system. CRA typically uses the older config format, so
you might need to eject or use a custom setup.

### How do I resolve rule conflicts with Prettier?

Enable the `withPrettier` option to automatically handle rule conflicts between ESLint and Prettier. This ensures that
formatting rules defer to Prettier's configuration.

### What's the difference between `withStylistic` and `withPrettier`?

`withStylistic` enforces stylistic code conventions through ESLint rules, while `withPrettier` integrates with the
Prettier formatter and disables ESLint rules that might conflict with Prettier's formatting.

### How can I customize the rules?

You can extend the configuration by adding your own rules after the ones from this package. Place your custom rules
after the generated config in the array to override specific rules.

### How do I handle false positives in the secret detection?

The secret detection (`withNoSecrets`) might sometimes flag strings that aren't actually secrets. You can customize the
sensitivity threshold or add specific exceptions in your configuration.

### Why use flat config instead of traditional .eslintrc?

ESLint's flat config system is the future of ESLint configuration. It's more performant, more explicit, and provides
better typing support for TypeScript users. It also allows for more flexible configuration composition.

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
