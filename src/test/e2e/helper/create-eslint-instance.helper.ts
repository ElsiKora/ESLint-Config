import type { Linter } from "eslint";

import type { IConfigOptions } from "../../../domain/interface/config-options.interface";

import { ESLint } from "eslint";

import createConfig from "../../../../dist/esm/index";

export async function createEsLintInstance(options: IConfigOptions): Promise<ESLint> {
	const config: Array<Linter.Config> = await createConfig(options);

	return new ESLint({
		baseConfig: config,
		overrideConfigFile: true,
	});
}
