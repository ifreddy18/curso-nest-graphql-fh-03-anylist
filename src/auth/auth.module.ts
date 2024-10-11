import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { CommonModule, EnvKeys } from 'src/common'
import { UsersModule } from '../users/users.module'

import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { JwtStrategy } from './strategies'

@Module({
	providers: [AuthResolver, AuthService, JwtStrategy],
	exports: [JwtStrategy, PassportModule, JwtModule],
	imports: [
		ConfigModule,

		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get(EnvKeys.jwtSecret),
				signOptions: {
					expiresIn: '4h',
				},
			}),
		}),

		CommonModule,
		UsersModule,
	],
})
export class AuthModule {}
