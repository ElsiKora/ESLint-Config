import type { IConfigOptions } from "@domain/interface";
import type { IConfigProvider, IConfigProviderRegistry } from "@domain/port";

import { ConfigOptionPolicy } from "@domain/policy";

export class ConfigSelectionService {
	constructor(private readonly registry: IConfigProviderRegistry) {}

	select(options: IConfigOptions): Array<IConfigProvider> {
		const moduleIds = ConfigOptionPolicy.resolveEnabledModuleIds(options);
		const providers = this.registry.getProviders();
		const providerById = new Map(providers.map((provider) => [provider.id, provider]));

		return moduleIds.map((moduleId) => providerById.get(moduleId)).filter((provider): provider is IConfigProvider => Boolean(provider));
	}
}
