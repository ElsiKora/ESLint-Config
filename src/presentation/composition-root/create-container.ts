import { ConfigMergeService, ConfigSelectionService } from "@application/service";
import { CreateEslintConfigUseCase } from "@application/use-case";
import { createDIContainer, EDependencyLifecycle } from "@elsikora/cladi";
import { ConfigProviderRegistry } from "@infrastructure/registry";
import {
	CONFIG_MERGE_SERVICE_TOKEN,
	CONFIG_PROVIDER_REGISTRY_TOKEN,
	CONFIG_SELECTION_SERVICE_TOKEN,
	CREATE_ESLINT_CONFIG_USE_CASE_TOKEN,
} from "@presentation/token";

export function createContainer() {
	const container = createDIContainer();
	const registry = new ConfigProviderRegistry();
	const selectionService = new ConfigSelectionService(registry);
	const mergeService = new ConfigMergeService();
	const useCase = new CreateEslintConfigUseCase(selectionService, mergeService);

	container.register([
		{
			lifecycle: EDependencyLifecycle.SINGLETON,
			provide: CONFIG_PROVIDER_REGISTRY_TOKEN,
			useValue: registry,
		},
		{
			lifecycle: EDependencyLifecycle.SINGLETON,
			provide: CONFIG_SELECTION_SERVICE_TOKEN,
			useValue: selectionService,
		},
		{
			lifecycle: EDependencyLifecycle.SINGLETON,
			provide: CONFIG_MERGE_SERVICE_TOKEN,
			useValue: mergeService,
		},
		{
			lifecycle: EDependencyLifecycle.SINGLETON,
			provide: CREATE_ESLINT_CONFIG_USE_CASE_TOKEN,
			useValue: useCase,
		},
	]);

	container.validate();

	return container;
}
