function A(): ClassDecorator & MethodDecorator & ParameterDecorator & PropertyDecorator {
	return () => undefined;
}

function B(): ClassDecorator & MethodDecorator & ParameterDecorator & PropertyDecorator {
	return () => undefined;
}

@B()
@A()
export class Example {
	@B()
	@A()
	public readonly name = "decorated";

	@B()
	@A()
	public get label(): string {
		return this.name;
	}

	@B()
	@A()
	public handle(@B() @A() value: string): string {
		return value;
	}
}
