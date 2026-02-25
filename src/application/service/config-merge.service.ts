import type { Linter } from "eslint";

export class ConfigMergeService {
	merge(configSets: Array<Array<Linter.Config>>): Array<Linter.Config> {
		return configSets.flat();
	}
}
