export interface IInvalidRuntimeConfiguration {
	readonly enabled: boolean;
}

export class InvalidRuntimeConfiguration {
	public static readonly retryLimit: string = "five";
}
