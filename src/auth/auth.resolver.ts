import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { User } from '../users/entities'

import { AuthService } from './auth.service'
import { LoginInput, SignupInput } from './dtos'
import { AuthResponse } from './types'
import { JwtAuthGuard } from './guards'
import { CurrentUser } from './decorators'

@Resolver(() => AuthResponse)
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Mutation(() => AuthResponse, { name: 'signup' })
	async signup(
		@Args('signupInput') signupInput: SignupInput,
	): Promise<AuthResponse> {
		return this.authService.signup(signupInput)
	}

	@Mutation(() => AuthResponse, { name: 'login' })
	async login(
		@Args('loginInput') loginInput: LoginInput,
	): Promise<AuthResponse> {
		return this.authService.login(loginInput)
	}

	@Query(() => AuthResponse, { name: 'revalidate' })
	@UseGuards(JwtAuthGuard)
	revalidateToken(
		@CurrentUser([
			/*ValidRoles.admin*/
		])
		user: User,
	): AuthResponse {
		return this.authService.revalidateUserToken(user)
	}
}
