import { join } from 'path'

import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'

import { ItemsModule } from './items/items.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { CommonModule } from './common/common.module'
import { SeedModule } from './seed/seed.module'
import { ListsModule } from './lists/lists.module'
import { ListItemModule } from './list-item/list-item.module'

@Module({
	imports: [
		ConfigModule.forRoot(),

		//? Forma sincrona
		// GraphQLModule.forRoot<ApolloDriverConfig>({
		// 	driver: ApolloDriver,
		// 	// debug: false,
		// 	autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
		// 	playground: false,
		// 	plugins: [ApolloServerPluginLandingPageLocalDefault()],
		// }),

		//? Forma asyncrona
		GraphQLModule.forRootAsync<ApolloDriverConfig>({
			driver: ApolloDriver,
			imports: [
				AuthModule,
				// ConfigModule,
			],
			inject: [JwtService], // Injecta servicios
			useFactory: async (
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				jwtService: JwtService,
				// configService: ConfigService,
			) => ({
				autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
				playground: false,
				plugins: [ApolloServerPluginLandingPageLocalDefault()],
				// Alternative 1 - to introspection
				// context({ req }) {
				// 	const token = req.headers.authorization?.replace('Bearer ', '')
				// 	if (!token) throw new Error('Token needed')

				// 	const payload = jwtService.decode(token)
				// 	if (!payload) throw new Error('Token not valid')

				// 	console.log({ payload, jwtService })
				// },
				// Alternative 2 - to context but with .env var - Need set imports: [ConfigModule]
				introspection: true,
				// introspection: configService.getOrThrow<boolean>(
				// 	'GRAPHQL_INTROSPECTION',
				// ), // Generally false for production
			}),
		}),

		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST,
			port: +process.env.DB_PORT,
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			synchronize: true, // For DEV
			// synchronize: false, // For PROD
			autoLoadEntities: true,
		}),

		ItemsModule,

		UsersModule,

		AuthModule,

		CommonModule,

		SeedModule,

		ListsModule,

		ListItemModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
