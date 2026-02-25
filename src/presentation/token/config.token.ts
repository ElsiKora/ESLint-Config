import type { ConfigMergeService, ConfigSelectionService } from "@application/service";
import type { CreateEslintConfigUseCase } from "@application/use-case";
import type { IConfigProviderRegistry } from "@domain/port";

import { createToken } from "@elsikora/cladi";

export const CONFIG_PROVIDER_REGISTRY_TOKEN = createToken<IConfigProviderRegistry>("IConfigProviderRegistry");
export const CONFIG_SELECTION_SERVICE_TOKEN = createToken<ConfigSelectionService>("ConfigSelectionService");
export const CONFIG_MERGE_SERVICE_TOKEN = createToken<ConfigMergeService>("ConfigMergeService");
export const CREATE_ESLINT_CONFIG_USE_CASE_TOKEN = createToken<CreateEslintConfigUseCase>("CreateEslintConfigUseCase");
