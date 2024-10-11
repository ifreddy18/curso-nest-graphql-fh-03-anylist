import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

@InputType()
export class CreateItemInput {
	@Field(() => String)
	@IsNotEmpty()
	@IsString()
	name: string

	// @Field(() => Float)
	// @Min(0)
	// quantity: number

	@Field(() => String, { nullable: true })
	@IsNotEmpty()
	@IsString()
	@IsOptional()
	quantityUnits?: string
}
