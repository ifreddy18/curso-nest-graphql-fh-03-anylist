import {
	Resolver,
	Query,
	Args,
	ID,
	Mutation,
	Int,
	Parent,
	ResolveField,
} from '@nestjs/graphql'
import { ParseUUIDPipe, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from 'src/auth/guards'
import { ValidRoles } from 'src/auth/enums'
import { CurrentUser } from 'src/auth/decorators'
import { ItemsService } from 'src/items/items.service'
import { Item } from 'src/items/entities'
import { PaginationArgs, SearchArgs } from 'src/common/dto'

import { UsersService } from './users.service'
import { User } from './entities/user.entity'
import { FindAllArgs, UpdateUserInput } from './dtos'
import { ListsService } from 'src/lists/lists.service'
import { List } from 'src/lists/entities/list.entity'

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
	constructor(
		private readonly usersService: UsersService,
		private readonly itemsService: ItemsService,
		private readonly listsService: ListsService,
	) {}

	@Query(() => [User], { name: 'users' })
	async findAll(
		@Args() findAllArgs: FindAllArgs,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		@CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
	): Promise<User[]> {
		return this.usersService.findAll(findAllArgs.roles)
	}

	@Query(() => User, { name: 'user' })
	async findOne(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		@CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User, // Just for validate role
	): Promise<User> {
		return this.usersService.findOneById(id)
	}

	@Mutation(() => User, { name: 'updateUser' })
	async updateUser(
		@Args('updateUserInput') updateUserInput: UpdateUserInput,
		@CurrentUser([ValidRoles.admin]) user: User,
	): Promise<User> {
		return this.usersService.update(updateUserInput.id, updateUserInput, user)
	}

	@Mutation(() => User, { name: 'blockUser' })
	async blockUser(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
		@CurrentUser([ValidRoles.admin]) user: User,
	): Promise<User> {
		return this.usersService.block(id, user)
	}

	/* Items */

	@ResolveField(() => Int, { name: 'itemCount' })
	async itemCount(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		@CurrentUser([ValidRoles.admin]) admin: User, // Just for validate role
		@Parent() user: User,
	): Promise<number> {
		return this.itemsService.itemCountByUser(user)
	}

	@ResolveField(() => [Item], { name: 'items' })
	async getItemsByUser(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		@CurrentUser([ValidRoles.admin]) admin: User, // Just for validate role
		@Parent() user: User,
		@Args() paginationArgs: PaginationArgs,
		@Args() searchArgs: SearchArgs,
	): Promise<Item[]> {
		return this.itemsService.findAll(user, paginationArgs, searchArgs)
	}

	/* Lists */

	@ResolveField(() => Int, { name: 'listCount' })
	async listCount(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		@CurrentUser([ValidRoles.admin]) admin: User, // Just for validate role
		@Parent() user: User,
	): Promise<number> {
		return this.listsService.listCountByUser(user)
	}

	@ResolveField(() => [Item], { name: 'lists' })
	async getListsByUser(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		@CurrentUser([ValidRoles.admin]) admin: User, // Just for validate role
		@Parent() user: User,
		@Args() paginationArgs: PaginationArgs,
		@Args() searchArgs: SearchArgs,
	): Promise<List[]> {
		return this.listsService.findAll(user, paginationArgs, searchArgs)
	}
}
