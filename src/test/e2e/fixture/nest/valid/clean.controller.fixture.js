import { Controller, Get } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
@ApiTags("items")
@Controller("items")
export class ItemController {
    @ApiResponse({ description: "List of items", status: 200 })
    @Get()
    getItems() {
        return ["item1", "item2"];
    }
}
