export interface IRuntimeConfiguration {
	readonly isEnabled: boolean;
	readonly MAXIMUM_RETRIES: string;
	readonly serviceName: string;
}

export class RuntimeConfiguration {
	public static readonly MAXIMUM_RETRIES: string = "five";
}
