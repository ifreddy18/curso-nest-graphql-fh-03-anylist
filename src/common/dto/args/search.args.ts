import { ArgsType, Field } from '@nestjs/graphql'
import { IsOptional, IsString, MinLength } from 'class-validator'

@ArgsType()
export class SearchArgs {
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MinLength(2)
	search?: string
}
