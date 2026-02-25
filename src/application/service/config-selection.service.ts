import type { IConfigOptions } from "@domain/interface";
import type { TConfigModuleId } from "@domain/model";
import type { IConfigProvider, IConfigProviderRegistry } from "@domain/port";

import { ConfigOptionPolicy } from "@domain/policy";

export class ConfigSelectionService {
	constructor(private readonly registry: IConfigProviderRegistry) {}

	select(options: IConfigOptions): Array<IConfigProvider> {
		const moduleIds: Array<TConfigModuleId> = ConfigOptionPolicy.resolveEnabledModuleIds(options);
		const providers: Array<IConfigProvider> = this.registry.getProviders();

		const providerById: Map<TConfigModuleId, IConfigProvider> = new Map<TConfigModuleId, IConfigProvider>(providers.map((provider: IConfigProvider): [TConfigModuleId, IConfigProvider] => [provider.id, provider]));

		return moduleIds.map((moduleId: TConfigModuleId) => providerById.get(moduleId)).filter((provider: IConfigProvider | undefined): provider is IConfigProvider => provider !== undefined);
	}
}
