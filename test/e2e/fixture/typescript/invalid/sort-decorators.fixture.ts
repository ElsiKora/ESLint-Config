function A(): ClassDecorator {
	return () => undefined;
}

function B(): ClassDecorator {
	return () => undefined;
}

@B()
@A()
export class Example {}
