import type { IConfigProvider } from "./config-provider.port";

export interface IConfigProviderRegistry {
	getProviders(): Array<IConfigProvider>;
}
