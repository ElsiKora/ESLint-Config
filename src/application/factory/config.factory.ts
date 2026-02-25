import type { IConfigOptions } from "@domain/interface";
import type { Linter } from "eslint";

import { CONFIG_OPTION_MODULE_MAP } from "@domain/model";
import { createConfigFromApi } from "@presentation/api";

export class ConfigFactory {
	static readonly OPTIONS_TO_CONFIG_MAP: Record<keyof IConfigOptions, string> = CONFIG_OPTION_MODULE_MAP;

	static createConfig(options: IConfigOptions): Promise<Array<Linter.Config>> {
		return createConfigFromApi(options);
	}
}
