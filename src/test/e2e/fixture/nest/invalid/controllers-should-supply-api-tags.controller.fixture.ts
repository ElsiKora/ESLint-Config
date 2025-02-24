import { Controller, Get } from "@nestjs/common";

@Controller("users")
export class UserController {
	@Get()
	public getUsers(): Array<string> {
		return ["user1", "user2"];
	}
}
