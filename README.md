<p align="center">
  <img src="https://6jft62zmy9nx2oea.public.blob.vercel-storage.com/eslint-config-WPPCbc2Zwdy2RQfrjXbSRHiORNYogb.png" width="500" alt="project-logo">
</p>

<h1 align="center">🛡️ ESLint-Config</h1>
<p align="center"><em>Enterprise-grade ESLint configuration system with 27+ plugin integrations for modern JavaScript/TypeScript projects</em></p>

<p align="center">
    <a aria-label="ElsiKora logo" href="https://elsikora.com">
  <img src="https://img.shields.io/badge/MADE%20BY%20ElsiKora-333333.svg?style=for-the-badge" alt="ElsiKora">
</a> <img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"> <img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint"> <img src="https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"> <img src="https://img.shields.io/badge/React-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black" alt="React"> <img src="https://img.shields.io/badge/Next.js-000000.svg?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"> <img src="https://img.shields.io/badge/Vue.js-4FC08D.svg?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue.js"> <img src="https://img.shields.io/badge/NestJS-E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS"> <img src="https://img.shields.io/badge/Prettier-F7B93E.svg?style=for-the-badge&logo=prettier&logoColor=black" alt="Prettier"> <img src="https://img.shields.io/badge/Jest-C21325.svg?style=for-the-badge&logo=jest&logoColor=white" alt="Jest"> <img src="https://img.shields.io/badge/Vitest-6E9F18.svg?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest"> <img src="https://img.shields.io/badge/Rollup-EC4A3F.svg?style=for-the-badge&logo=rollup&logoColor=white" alt="Rollup"> <img src="https://img.shields.io/badge/pnpm-F69220.svg?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm"> <img src="https://img.shields.io/badge/npm-CB3837.svg?style=for-the-badge&logo=npm&logoColor=white" alt="npm"> <img src="https://img.shields.io/badge/Yarn-2C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white" alt="Yarn">
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
ESLint-Config by ElsiKora is a comprehensive, battle-tested ESLint configuration system designed to enforce consistent code quality across enterprise JavaScript and TypeScript applications. Built with modularity at its core, it provides seamless integration with popular frameworks like React, Next.js, Vue.js, and NestJS, while supporting advanced architectural patterns like Feature-Sliced Design. The configuration system goes beyond basic linting by incorporating security scanning for secrets, internationalization enforcement, accessibility checks, and performance optimizations. With support for 27+ carefully curated plugins, it handles everything from CSS-in-JS to GraphQL, from Storybook stories to TanStack Query patterns. Whether you're building a startup MVP or maintaining a large-scale enterprise application, this configuration adapts to your needs while maintaining strict quality standards that catch bugs before they reach production.

## 🚀 Features
- ✨ **🔧 **Modular Architecture** - Pick only what you need with 27+ optional plugins that can be enabled/disabled independently**
- ✨ **🏗️ **Framework Support** - First-class support for React, Vue.js, Next.js, NestJS, and more with framework-specific best practices**
- ✨ **🔐 **Security First** - Built-in secret detection prevents accidental credential exposure with customizable pattern matching**
- ✨ **🌍 **i18n Enforcement** - Automatically detect hardcoded strings that should be internationalized in your React/Vue components**
- ✨ **♿ **Accessibility Checks** - JSX accessibility rules ensure your applications are usable by everyone**
- ✨ **🎨 **Style Consistency** - Prettier integration with automatic conflict resolution between formatting and linting rules**
- ✨ **📁 **File Organization** - Enforce consistent file/folder naming conventions and architectural patterns like Feature-Sliced Design**
- ✨ **🚀 **Performance Rules** - Catch performance anti-patterns in React hooks, TanStack Query, and other libraries**
- ✨ **📝 **Documentation Linting** - Validate JSDoc comments, Markdown files, and ensure proper code documentation**
- ✨ **🧪 **Testing Support** - Special configurations for Storybook, Jest, Vitest, and other testing frameworks**
- ✨ **🔄 **CI/CD Ready** - GitHub Actions, GitLab CI, and other CI providers supported with semantic versioning**
- ✨ **🛠️ **Developer Experience** - Extensive TypeScript support with strict type checking and intelligent auto-fixes**

## 🛠 Installation
```bash
# Using npm
npm install --save-dev @elsikora/eslint-config eslint

# Using yarn
yarn add --dev @elsikora/eslint-config eslint

# Using pnpm
pnpm add -D @elsikora/eslint-config eslint

# Using bun
bun add -d @elsikora/eslint-config eslint

# Quick setup with all recommended plugins
npx @elsikora/eslint-config init

# Manual setup - create eslint.config.js
echo "import { createConfig } from '@elsikora/eslint-config';

export default await createConfig({
  withJavascript: true,
  withTypescript: true,
  withPrettier: true
});" > eslint.config.js
```

## 💡 Usage
## 🚀 Basic Usage

Create an `eslint.config.js` file in your project root:

```javascript
import { createConfig } from '@elsikora/eslint-config';

export default await createConfig({
  withJavascript: true,
  withTypescript: true,
  withPrettier: true
});
```

## 📋 Configuration Examples

### React + TypeScript Project

```javascript
import { createConfig } from '@elsikora/eslint-config';

const config = {
  ignores: ['dist', 'coverage', '.next']
};

export default [
  config,
  ...(await createConfig({
    withTypescript: true,
    withReact: true,
    withJsx: true,
    withTailwindCss: true,
    withPrettier: true,
    withSonar: true,
    withUnicorn: true
  }))
];
```

### Next.js Full-Stack Application

```javascript
import { createConfig } from '@elsikora/eslint-config';

export default await createConfig({
  withTypescript: true,
  withReact: true,
  withNext: true,
  withNode: true,
  withTailwindCss: true,
  withI18next: true,
  withNoSecrets: true,
  withPrettier: true
});
```

### NestJS Backend API

```javascript
import { createConfig } from '@elsikora/eslint-config';

export default await createConfig({
  withTypescript: true,
  withNest: true,
  withNode: true,
  withTypeorm: true,
  withSonar: true,
  withNoSecrets: true,
  withPrettier: true
});
```

### Feature-Sliced Design Architecture

```javascript
import { createConfig } from '@elsikora/eslint-config';

export default await createConfig({
  withTypescript: true,
  withReact: true,
  withFsd: true,
  withPerfectionist: true,
  withCheckFile: true,
  withPrettier: true
});
```

## 🔧 Advanced Configuration

### Custom Rule Overrides

```javascript
import { createConfig } from '@elsikora/eslint-config';

const baseConfig = await createConfig({
  withTypescript: true,
  withReact: true
});

const customRules = {
  rules: {
    // Override specific rules
    'no-console': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/prop-types': 'off'
  }
};

export default [...baseConfig, customRules];
```

### Environment-Specific Configuration

```javascript
import { createConfig } from '@elsikora/eslint-config';

const isDevelopment = process.env.NODE_ENV === 'development';

export default await createConfig({
  withTypescript: true,
  withReact: true,
  withNoSecrets: !isDevelopment, // Disable in development
  withSonar: !isDevelopment,
  withPrettier: true
});
```

## 📝 Configuration Options Reference

```typescript
interface ConfigOptions {
  // Language Support
  withJavascript?: boolean;      // JavaScript ES2022+ rules
  withTypescript?: boolean;      // TypeScript with type checking
  withTypescriptStrict?: boolean; // Strict TypeScript rules
  
  // Framework Support
  withReact?: boolean;           // React best practices
  withNext?: boolean;            // Next.js specific rules
  withNest?: boolean;            // NestJS decorators & patterns
  
  // Code Quality
  withSonar?: boolean;           // SonarJS code quality rules
  withUnicorn?: boolean;         // Unicorn best practices
  withPerfectionist?: boolean;   // Import/export sorting
  withRegexp?: boolean;          // RegExp optimization
  
  // Security
  withNoSecrets?: boolean;       // Detect hardcoded secrets
  
  // Styling
  withPrettier?: boolean;        // Prettier integration
  withStylistic?: boolean;       // Code style rules
  withTailwindCss?: boolean;     // TailwindCSS class sorting
  
  // Architecture
  withFsd?: boolean;             // Feature-Sliced Design
  withCheckFile?: boolean;       // File naming conventions
  
  // Documentation
  withJsDoc?: boolean;           // JSDoc validation
  withMarkdown?: boolean;        // Markdown linting
  
  // Testing
  withStorybook?: boolean;       // Storybook best practices
  
  // Other
  withNode?: boolean;            // Node.js environment
  withI18next?: boolean;         // i18n enforcement
  withJson?: boolean;            // JSON file linting
  withYaml?: boolean;            // YAML file linting
  withPackageJson?: boolean;     // package.json sorting
  withTanstack?: boolean;        // TanStack Query/Router
  withTypeorm?: boolean;         // TypeORM entities
  withJsx?: boolean;             // JSX accessibility
  withCss?: boolean;             // CSS file linting
}
```

## 🎯 CLI Commands

```bash
# Run linting
eslint .

# Auto-fix issues
eslint . --fix

# Lint specific files
eslint "src/**/*.{js,ts,jsx,tsx}"

# Show only errors (no warnings)
eslint . --quiet

# Output results as JSON
eslint . --format json -o eslint-report.json

# Check if files are ignored
eslint . --debug
```

## 🔌 IDE Integration

### VS Code

Add to `.vscode/settings.json`:

```json
{
  "eslint.experimental.useFlatConfig": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "json",
    "jsonc",
    "yaml",
    "markdown"
  ]
}
```

### WebStorm / IntelliJ IDEA

1. Go to Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
2. Select "Automatic ESLint configuration"
3. Check "Run eslint --fix on save"

## 🛣 Roadmap
| Task / Feature | Status |
|----------------|--------|
| Core ESLint flat config support | ✅ Done |
| TypeScript strict mode configuration | ✅ Done |
| React 18+ hooks and patterns | ✅ Done |
| Next.js 14+ App Router support | ✅ Done |
| Vue.js 3 Composition API | 🚧 In Progress |
| NestJS decorators and patterns | ✅ Done |
| Feature-Sliced Design architecture | ✅ Done |
| Secret detection with AI patterns | ✅ Done |
| i18next translation enforcement | ✅ Done |
| Storybook 7+ CSF3 format | ✅ Done |
| TanStack Query v5 patterns | ✅ Done |
| Monorepo configuration support | 🚧 In Progress |
| Auto-fix suggestions with AI | 🚧 In Progress |
| Visual config builder UI | 🚧 In Progress |
| Performance profiling rules | 🚧 In Progress |
| GraphQL schema linting | 🚧 In Progress |
| Docker and container files | 🚧 In Progress |
| Svelte/SvelteKit support | 🚧 In Progress |
| Astro framework integration | 🚧 In Progress |
| Bun runtime specific rules | 🚧 In Progress |

## ❓ FAQ
## ❓ Frequently Asked Questions

### Why use flat config instead of .eslintrc?

ESLint flat config (eslint.config.js) is the future of ESLint configuration. It provides better performance through lazy loading, improved TypeScript support with full type checking, and more explicit configuration that's easier to debug. All new ESLint features are being developed exclusively for flat config.

### How do I migrate from an existing .eslintrc configuration?

First, install this package and create a new `eslint.config.js` file. Start with a minimal configuration and gradually enable features that match your existing setup. You can run both configurations side-by-side during migration by using different file patterns. The modular nature of this config makes migration straightforward.

### Why are there so many peer dependencies?

This configuration system supports 27+ different plugins, but you only install what you actually use. Each plugin is marked as an optional peer dependency, so npm/yarn/pnpm will only prompt you to install the ones you've enabled in your configuration. This keeps your node_modules lean while providing maximum flexibility.

### How do I handle conflicts between Prettier and ESLint?

Simply enable `withPrettier: true` in your configuration. This automatically includes `eslint-config-prettier` which disables all ESLint rules that would conflict with Prettier formatting. You should run Prettier first, then ESLint, which is typically handled by your IDE or git hooks.

### Can I use this with Create React App or Next.js?

Yes! For Next.js, use `withNext: true` which includes all Next.js specific rules. For Create React App, you'll need to eject or use a tool like CRACO to customize the ESLint configuration, as CRA doesn't support flat config natively yet.

### How does secret detection work?

The `withNoSecrets` option enables pattern matching for common secret formats (API keys, passwords, tokens) and high-entropy string detection. It scans your code for patterns like `apiKey = 'abc123'` and strings that look like tokens. You can customize the patterns and sensitivity in the configuration.

### What's Feature-Sliced Design (FSD)?

FSD is an architectural pattern for frontend applications that enforces strict boundaries between features, shared code, and different layers of your application. When you enable `withFsd: true`, the linter ensures imports follow FSD rules, preventing architectural violations.

### How do I debug which rules are causing issues?

Run ESLint with the `--debug` flag to see which config files and rules are being loaded. You can also use `--print-config path/to/file.js` to see the exact configuration being applied to a specific file. Each rule error includes the rule name, making it easy to disable or modify specific rules.

### Can I use this in a monorepo?

Absolutely! Create a root `eslint.config.js` that uses `createConfig()` with your base settings, then extend it in each package with additional package-specific rules. The flat config system makes monorepo setups much cleaner than the old cascade configuration.

### Is this configuration performant for large codebases?

Yes, the flat config system with lazy loading means only the necessary plugins are loaded when needed. The configuration also excludes common directories like `node_modules`, `dist`, and `coverage` by default. For very large codebases, you can further optimize by limiting the file patterns each plugin processes.

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
