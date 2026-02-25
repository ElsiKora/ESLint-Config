import type { IConfigOptions } from "@domain/interface";
import type { TConfigModuleId } from "@domain/model";

import { InvalidConfigOptionError } from "@domain/error";
import { CONFIG_OPTION_MODULE_MAP } from "@domain/model";

export class ConfigOptionPolicy {
	private static readonly ALLOWED_OPTION_KEYS: Set<string> = new Set(Object.keys(CONFIG_OPTION_MODULE_MAP));

	static validate(options: IConfigOptions): void {
		for (const key of Object.keys(options)) {
			if (!this.ALLOWED_OPTION_KEYS.has(key)) {
				throw new InvalidConfigOptionError(key);
			}
		}
	}

	static resolveEnabledModuleIds(options: IConfigOptions): Array<TConfigModuleId> {
		this.validate(options);

		const result: Array<TConfigModuleId> = [];

		for (const [key, value] of Object.entries(options)) {
			if (value !== true) {
				continue;
			}

			const moduleId: TConfigModuleId = CONFIG_OPTION_MODULE_MAP[key as keyof IConfigOptions];
			result.push(moduleId);
		}

		return result;
	}
}
