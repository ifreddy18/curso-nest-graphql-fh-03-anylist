import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import { ExtractJwt, Strategy } from 'passport-jwt'

import { EnvKeys } from 'src/common'
import { User } from '../../users/entities'

import { JwtPayload } from '../interfaces'
import { AuthService } from '../auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly authService: AuthService,
		configService: ConfigService,
	) {
		super({
			secretOrKey: configService.get(EnvKeys.jwtSecret),
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		})
	}

	async validate(payload: JwtPayload): Promise<User> {
		const { id } = payload
		const user = await this.authService.validateUser(id)
		return user
	}
}
