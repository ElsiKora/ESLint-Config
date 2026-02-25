import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity {
	@Column({ nullable: false, type: "varchar" })
	name!: string;

	@PrimaryGeneratedColumn()
	id!: number;
}
