declare function acquire(): Disposable & { read(): string };

export function openResource(): Disposable {
	using resource = acquire();

	return resource;
}
