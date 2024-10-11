import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { EncryptAdapter } from 'src/common'
import { User } from '../users/entities'
import { UsersService } from '../users/users.service'

import { LoginInput, SignupInput } from './dtos'
import { AuthResponse } from './types'

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
		private readonly encrypt: EncryptAdapter,
	) {}

	async signup(signupInput: SignupInput): Promise<AuthResponse> {
		// Create user
		const user: User = await this.usersService.create(signupInput)
		// Generate token
		const token = this.getJwtToken(user)

		return {
			token,
			user,
		}
	}
	async login(loginInput: LoginInput): Promise<AuthResponse> {
		const { email, password } = loginInput
		const user: User = await this.usersService.findOneByEmail(email)

		if (!this.encrypt.compareSync(password, user.password)) {
			throw new BadRequestException('Email / password do not match')
		}

		const token = this.getJwtToken(user)

		return {
			token,
			user,
		}
	}

	revalidateUserToken(user: User): AuthResponse {
		const token = this.getJwtToken(user)
		return {
			token,
			user,
		}
	}

	async validateUser(id: string): Promise<User> {
		const user = await this.usersService.findOneById(id)
		if (!user.isActive)
			throw new UnauthorizedException('User is inactive, talk with admin')

		delete user.password
		return user
	}

	private getJwtToken(user: User): string {
		return this.jwtService.sign({ id: user.id })
	}
}
