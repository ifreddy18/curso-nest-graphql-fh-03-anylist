import {
	ExecutionContext,
	ForbiddenException,
	InternalServerErrorException,
	createParamDecorator,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { User } from '../../users/entities'

import { ValidRoles } from '../enums'

export const CurrentUser = createParamDecorator(
	(roles: ValidRoles[] = [], context: ExecutionContext) => {
		const ctx = GqlExecutionContext.create(context)
		const user: User = ctx.getContext().req.user

		if (!user)
			throw new InternalServerErrorException(
				'No user inside the request - make sure that we use the AuthGuard or JwtAuthGuard',
			)

		// If don't need a user with specific role
		if (roles.length === 0) return user

		for (const role of user.roles) {
			if (roles.includes(role as ValidRoles)) return user
		}

		throw new ForbiddenException(
			`User ${user.fullName} need a valid role: [${roles}]`,
		)
	},
)
