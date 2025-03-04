import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
@ApiTags("products")
@Controller("products")
export class ProductController {
    @Get()
    getProducts() {
        return ["product1", "product2"];
    }
}
