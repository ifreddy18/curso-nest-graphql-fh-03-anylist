import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnvKeys } from '../common/constants'
import { InjectRepository } from '@nestjs/typeorm'
import { Item } from 'src/items/entities'
import { Repository } from 'typeorm'
import { User } from 'src/users/entities'
import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data'
import { UsersService } from 'src/users/users.service'
import { ItemsService } from 'src/items/items.service'
import { List } from 'src/lists/entities/list.entity'
import { ListsService } from 'src/lists/lists.service'
import { ListItemService } from 'src/list-item/list-item.service'
import { ListItem } from 'src/list-item/entities/list-item.entity'

@Injectable()
export class SeedService {
	private isProd: boolean

	constructor(
		configService: ConfigService,
		private readonly itemsService: ItemsService,
		private readonly listsService: ListsService,
		private readonly listItemsService: ListItemService,
		private readonly usersService: UsersService,
		@InjectRepository(Item)
		private readonly itemsRepository: Repository<Item>,
		@InjectRepository(List)
		private readonly listsRepository: Repository<List>,
		@InjectRepository(ListItem)
		private readonly listItemsRepository: Repository<ListItem>,
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {
		this.isProd = configService.get(EnvKeys.state) === 'prod'
	}

	async executeSeed(): Promise<boolean> {
		if (this.isProd)
			throw new UnauthorizedException('You cannot run SEED on PROD')

		// Limpiar base de datos
		await this.deleteDatabase()

		// Cargar usuarios
		const user = await this.loadUsers()

		// Cargar listas
		const list = await this.loadLists(user)

		// Cargar items
		await this.loadItems(user)

		// Cargar listItems
		const items = await this.itemsService.findAll(
			user,
			{ limit: 10, offset: 0 },
			{},
		)
		await this.loadListItems(list, items)

		return true
	}

	private async deleteDatabase() {
		// Delete listItems
		await this.listItemsRepository
			.createQueryBuilder()
			.delete()
			.where({})
			.execute()

		// Delete items
		await this.itemsRepository.createQueryBuilder().delete().where({}).execute()

		// Delete Lists
		await this.listsRepository.createQueryBuilder().delete().where({}).execute()

		// Delete users
		await this.usersRepository.createQueryBuilder().delete().where({}).execute()
	}

	private async loadUsers(): Promise<User> {
		const users = []
		for (const user of SEED_USERS) {
			users.push(await this.usersService.create(user))
		}

		return users[0]
	}

	private async loadLists(user: User): Promise<List> {
		const lists = []

		for (const list of SEED_LISTS) {
			lists.push(await this.listsService.create(list, user))
		}

		return lists[0]
	}

	private async loadItems(user: User): Promise<void> {
		const itemsPromises = []

		for (const item of SEED_ITEMS) {
			itemsPromises.push(this.itemsService.create(item, user))
		}

		await Promise.all(itemsPromises)
	}

	private async loadListItems(list: List, items: Item[]): Promise<void> {
		for (const item of items) {
			await this.listItemsService.create({
				quantity: Math.round(Math.random() * 10),
				completed: Math.round(Math.random() * 1) === 1,
				listId: list.id,
				itemId: item.id,
			})
		}
	}
}
