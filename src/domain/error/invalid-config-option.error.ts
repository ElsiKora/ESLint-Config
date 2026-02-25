export class InvalidConfigOptionError extends Error {
	constructor(optionKey: string) {
		super(`Unknown config option: "${optionKey}".`);
		this.name = "InvalidConfigOptionError";
	}
}
