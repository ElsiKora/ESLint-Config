import type { IConfigOptions } from "@domain/interface";
import type { Linter } from "eslint";

import { createContainer } from "@presentation/composition-root/create-container";
import { CREATE_ESLINT_CONFIG_USE_CASE_TOKEN } from "@presentation/token";

let cachedContainer: ReturnType<typeof createContainer> | null = null;

function getContainer(): ReturnType<typeof createContainer> {
	if (cachedContainer) {
		return cachedContainer;
	}

	cachedContainer = createContainer();
	return cachedContainer;
}

export async function createConfigFromApi(options: IConfigOptions): Promise<Array<Linter.Config>> {
	const useCase = getContainer().resolve(CREATE_ESLINT_CONFIG_USE_CASE_TOKEN);
	return useCase.execute(options);
}

export function resetConfigContainerForTests(): void {
	cachedContainer = null;
}
