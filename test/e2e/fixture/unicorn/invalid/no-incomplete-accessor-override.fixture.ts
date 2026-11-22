class Base {
	protected stored = "";

	get value(): string {
		return this.stored;
	}
}

export class Child extends Base {
	set value(next: string) {
		this.stored = next;
	}
}
