import type { Linter } from "eslint";
import { ESLint } from "eslint";
import createConfig, { IConfigOptions } from "../../../dist/esm/index";

export async function createEsLintInstance(options: IConfigOptions): Promise<ESLint> {
	const config: Array<Linter.Config> = await createConfig(options);

	return new ESLint({
		baseConfig: config,
		overrideConfigFile: true,
	});
}
