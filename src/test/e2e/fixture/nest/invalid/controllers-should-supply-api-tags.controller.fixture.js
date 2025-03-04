import { Controller, Get } from "@nestjs/common";
@Controller("users")
export class UserController {
    @Get()
    getUsers() {
        return ["user1", "user2"];
    }
}
