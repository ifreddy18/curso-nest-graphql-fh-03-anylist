import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql'
import { ParseUUIDPipe, UseGuards } from '@nestjs/common'

import { PaginationArgs, SearchArgs } from 'src/common/dto'
import { JwtAuthGuard } from '../auth/guards'
import { CurrentUser } from '../auth/decorators'
import { User } from '../users/entities'

import { ItemsService } from './items.service'
import { Item } from './entities'
import { CreateItemInput, UpdateItemInput } from './dto'

@Resolver(() => Item)
@UseGuards(JwtAuthGuard)
export class ItemsResolver {
	constructor(private readonly itemsService: ItemsService) {}

	@Mutation(() => Item, { name: 'createItem' })
	async createItem(
		@Args('createItemInput') createItemInput: CreateItemInput,
		@CurrentUser() user: User,
	): Promise<Item> {
		return this.itemsService.create(createItemInput, user)
	}

	@Query(() => [Item], { name: 'items' })
	async findAll(
		@CurrentUser() user: User,
		@Args() paginationArgs: PaginationArgs,
		@Args() searchArgs: SearchArgs,
	): Promise<Item[]> {
		return this.itemsService.findAll(user, paginationArgs, searchArgs)
	}

	@Query(() => Item, { name: 'item' })
	async findOne(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
		@CurrentUser() user: User,
	): Promise<Item> {
		return this.itemsService.findOne(id, user)
	}

	@Mutation(() => Item, { name: 'updateItem' })
	async updateItem(
		@Args('updateItemInput') updateItemInput: UpdateItemInput,
		@CurrentUser() user: User,
	): Promise<Item> {
		return this.itemsService.update(updateItemInput.id, updateItemInput, user)
	}

	@Mutation(() => Item, { name: 'removeItem' })
	async removeItem(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
		@CurrentUser() user: User,
	): Promise<Item> {
		return this.itemsService.remove(id, user)
	}
}
