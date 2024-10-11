import { ArgsType, Field } from '@nestjs/graphql'
import { IsArray } from 'class-validator'
import { ValidRoles } from 'src/auth/enums'

@ArgsType()
export class FindAllArgs {
	@Field(() => [ValidRoles], { nullable: true })
	@IsArray()
	roles: ValidRoles[] = []
}
