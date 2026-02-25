import type { TConfigModuleId } from "@domain/model";

export class ConfigProviderLoadError extends Error {
	constructor(moduleId: TConfigModuleId, options: { cause?: unknown; requiredDependencies: Array<string> }) {
		super(
			`Failed to load config module "${moduleId}". Required dependencies: ${options.requiredDependencies.join(", ") || "none"}.`,
			{ cause: options.cause },
		);
		this.name = "ConfigProviderLoadError";
	}
}
