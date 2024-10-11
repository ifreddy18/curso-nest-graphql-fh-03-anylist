import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User } from 'src/users/entities'
import { PaginationArgs, SearchArgs } from 'src/common/dto'

import { CreateListInput } from './dto/create-list.input'
import { UpdateListInput } from './dto/update-list.input'
import { List } from './entities/list.entity'

@Injectable()
export class ListsService {
	constructor(
		@InjectRepository(List)
		private readonly listsRepository: Repository<List>,
	) {}

	async create(createListInput: CreateListInput, user: User): Promise<List> {
		const newList = this.listsRepository.create({ ...createListInput, user })
		return await this.listsRepository.save(newList)
	}

	async findAll(
		user: User,
		paginationArgs: PaginationArgs,
		searchArgs: SearchArgs,
	): Promise<List[]> {
		const { limit, offset } = paginationArgs
		const { search } = searchArgs

		const queryBuilder = this.listsRepository
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
	}

	async findOne(id: string, user: User): Promise<List> {
		const list = await this.listsRepository.findOneBy({
			id,
			user: {
				id: user.id,
			},
		})
		if (!list) throw new NotFoundException(`List with id '${id}' not found`)
		return list
	}

	async update(
		id: string,
		updateListInput: UpdateListInput,
		user: User,
	): Promise<List> {
		// Validate if list exists for the user, in case doesn't, throw exception
		await this.findOne(id, user)

		const list = await this.listsRepository.preload({
			...updateListInput,
			user,
		}) // Without lazy

		if (!list) throw new NotFoundException(`List with id '${id}' not found`)
		return this.listsRepository.save(list)
	}

	async remove(id: string, user: User): Promise<List> {
		const item = await this.findOne(id, user)
		await this.listsRepository.remove(item)
		return { ...item, id }
	}

	async listCountByUser(user: User): Promise<number> {
		return this.listsRepository.count({
			where: {
				user: {
					id: user.id,
				},
			},
		})
	}
}
