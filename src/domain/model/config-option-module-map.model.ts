import type { IConfigOptions } from "@domain/interface";

import type { TConfigModuleId } from "./config-module-id.model";

export const CONFIG_OPTION_MODULE_MAP: Record<keyof IConfigOptions, TConfigModuleId> = {
	withCheckFile: "check-file",
	withCss: "css",
	withFsd: "fsd",
	withI18next: "i18next",
	withJavascript: "javascript",
	withJsDoc: "jsdoc",
	withJson: "json",
	withJsx: "jsx",
	withMarkdown: "markdown",
	withNest: "nest",
	withNext: "next",
	withNode: "node",
	withNoSecrets: "no-secrets",
	withPackageJson: "package-json",
	withPerfectionist: "perfectionist",
	withPrettier: "prettier",
	withReact: "react",
	withRegexp: "regexp",
	withSonar: "sonar",
	withStorybook: "storybook",
	withStylistic: "stylistic",
	withTailwindCss: "tailwind-css",
	withTanstack: "tanstack",
	withTypeorm: "typeorm",
	withTypescript: "typescript",
	withTypescriptStrict: "typescript-strict",
	withUnicorn: "unicorn",
	withYaml: "yaml",
};
