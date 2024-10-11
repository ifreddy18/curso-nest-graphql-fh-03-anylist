import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CommonModule } from 'src/common'
import { User } from './entities'
import { UsersResolver } from './users.resolver'
import { UsersService } from './users.service'
import { ItemsModule } from 'src/items/items.module'
import { ListsModule } from 'src/lists/lists.module'

@Module({
	providers: [UsersResolver, UsersService],
	imports: [
		TypeOrmModule.forFeature([User]),
		CommonModule,
		ItemsModule,
		ListsModule,
	],
	exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
