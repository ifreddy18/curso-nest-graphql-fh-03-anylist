import { ArgsType, Field, ID } from '@nestjs/graphql'
import { IsUUID } from 'class-validator'

@ArgsType()
export class ItemArgs {
	@Field(() => ID)
	@IsUUID()
	id: string

	// @Field(() => Boolean, { nullable: true, description: 'Todos done status' })
	// @IsBoolean()
	// @IsOptional()
	// status?: boolean

	// @Field(() => Boolean, { nullable: true, description: 'Todos done status' })
	// @IsBoolean()
	// @IsOptional()
	// test?: boolean
}
