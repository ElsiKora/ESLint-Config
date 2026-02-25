import type { ConfigMergeService, ConfigSelectionService } from "@application/service";
import type { IConfigOptions } from "@domain/interface";
import type { IConfigProvider } from "@domain/port";
import type { Linter } from "eslint";

export class CreateEslintConfigUseCase {
	constructor(
		private readonly selectionService: ConfigSelectionService,
		private readonly mergeService: ConfigMergeService,
	) {}

	async execute(options: IConfigOptions): Promise<Array<Linter.Config>> {
		const providers: Array<IConfigProvider> = this.selectionService.select(options);
		const configSets: Array<Array<Linter.Config>> = await Promise.all(providers.map((provider: IConfigProvider) => provider.load(options)));

		return this.mergeService.merge(configSets);
	}
}
