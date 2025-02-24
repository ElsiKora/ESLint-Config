export class userService {
	private readonly Name: string;

	constructor(name: string) {
		this.Name = name;
	}

	public GetName() {
		return this.Name;
	}
}
