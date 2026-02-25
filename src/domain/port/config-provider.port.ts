import type { IConfigOptions } from "@domain/interface";
import type { TConfigModuleId } from "@domain/model";
import type { Linter } from "eslint";

export interface IConfigProvider {
	readonly id: TConfigModuleId;
	readonly optionKey: keyof IConfigOptions;
	readonly requiredDependencies: Array<string>;
	isEnabled(options: IConfigOptions): boolean;
	load(options: IConfigOptions): Promise<Array<Linter.Config>>;
}
