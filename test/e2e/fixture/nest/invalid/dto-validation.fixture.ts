import { Controller, Get, Param, Provider, ValidationPipe } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, ValidateNested } from "class-validator";

enum EStatus {
	ACTIVE = "ACTIVE",
}

class ChildDto {
	@IsString()
	public name!: string;
}

export class CreateUserDto {
	@IsString()
	public name!: string;

	public missingDecorator!: string;

	@ApiProperty()
	public optionalName?: string;

	@ApiPropertyOptional()
	public requiredName!: string;

	@ApiProperty()
	public tags!: Array<string>;

	@ValidateNested()
	public children!: Array<ChildDto>;

	@IsString()
	public child!: ChildDto;

	@ApiProperty({ enum: EStatus, type: String })
	public status!: EStatus;
}

@Controller("users")
@Controller("members")
export class DuplicateController {
	@Get(":id")
	public getUser(@Param("userId") id: string): string {
		return id;
	}
}

export const USER_PROVIDER: Provider = {
	inject: [String],
	provide: "USER",
	useFactory: (): string => "value",
};

export const validationPipe: ValidationPipe = new ValidationPipe({ transform: true });
