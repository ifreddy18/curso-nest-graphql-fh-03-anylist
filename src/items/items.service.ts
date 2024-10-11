import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../users/entities'
import { PaginationArgs, SearchArgs } from 'src/common/dto'
import { CreateItemInput, UpdateItemInput } from './dto'
import { Item } from './entities'

@Injectable()
export class ItemsService {
	constructor(
		@InjectRepository(Item)
		private readonly itemRepository: Repository<Item>,
	) {}

	async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
		const newItem = this.itemRepository.create({ ...createItemInput, user })
		return await this.itemRepository.save(newItem)
	}

	async findAll(
		user: User,
		paginationArgs: PaginationArgs,
		searchArgs: SearchArgs,
	): Promise<Item[]> {
		const { limit, offset } = paginationArgs
		const { search } = searchArgs

		const queryBuilder = this.itemRepository
			.createQueryBuilder()
			.take(limit)
			.skip(offset)
			.where(`"userId" = :userId`, { userId: user.id })

		if (search) {
			queryBuilder.andWhere('LOWER(name) like :name', {
				name: `%${search.toLowerCase()}%`,
			})
		}

		return queryBuilder.getMany()

		// return await this.itemRepository.findBy({ user }) // Alternative 1 - user
		// return await this.itemRepository.find({ // Alternative 1 - Search
		// 	take: limit,
		// 	skip: offset,
		// 	where: {
		// 		// Alternative 2 - user
		// 		user: {
		// 			id: user.id,
		// 		},
		// 		name: Like(`%${search}%`),
		// 	},
		// })
	}

	async findOne(id: string, user: User): Promise<Item> {
		const item = await this.itemRepository.findOneBy({
			id,
			user: {
				id: user.id,
			},
		})
		if (!item) throw new NotFoundException(`Item with id '${id}' not found`)
		return item
	}

	async update(
		id: string,
		updateItemInput: UpdateItemInput,
		user: User,
	): Promise<Item> {
		// Validate if item exists for the user, in case doesn't, throw exception
		await this.findOne(id, user)

		//? const item = await this.itemRepository.preload({...updateItemInput, user}) // Without lazy
		const item = await this.itemRepository.preload(updateItemInput) // With lazy

		if (!item) throw new NotFoundException(`Item with id '${id}' not found`)
		return this.itemRepository.save(item)
	}

	async remove(id: string, user: User): Promise<Item> {
		// TODO: Soft delete, integridad referencial
		const item = await this.findOne(id, user)
		await this.itemRepository.remove(item)
		return { ...item, id }
	}

	async itemCountByUser(user: User): Promise<number> {
		return this.itemRepository.count({
			where: {
				user: {
					id: user.id,
				},
			},
		})
	}
}
