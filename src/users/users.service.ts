import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { CommonService, EncryptAdapter, ErrorsCodes, IError } from 'src/common'
import { SignupInput } from 'src/auth/dtos'

import { User } from './entities/user.entity'
import { ValidRoles } from 'src/auth/enums'
import { UpdateUserInput } from './dtos'

@Injectable()
export class UsersService {
	private context: string = 'UsersService'

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly commonService: CommonService,
		private readonly encrypt: EncryptAdapter,
	) {}

	async create(signupInput: SignupInput): Promise<User> {
		try {
			const newUser = this.userRepository.create({
				...signupInput,
				password: this.encrypt.hashSync(signupInput.password),
			})
			return await this.userRepository.save(newUser)
		} catch (error) {
			this.handleDBErrors(error)
		}
	}

	async findAll(roles: ValidRoles[]): Promise<User[]> {
		if (roles.length === 0)
			return this.userRepository.find({
				// To load relations // Used lazy in entity instead
				// relations: {
				// 	lastUpdateBy: true,
				// },
			})

		return await this.userRepository
			.createQueryBuilder()
			.andWhere('ARRAY[roles] && ARRAY[:...roles]')
			.setParameter('roles', roles)
			.getMany()
		// Postgres documentation for explanined condition in 'andWhere'
		// https://www.postgresql.org/docs/9.6/functions-array.html
	}

	async findOneByEmail(email: string): Promise<User> {
		try {
			return await this.userRepository.findOneByOrFail({ email })
		} catch (error) {
			this.handleDBErrors({
				code: ErrorsCodes.emailNotFound,
				key: email,
			})
		}
	}

	async findOneById(id: string): Promise<User> {
		try {
			return await this.userRepository.findOneByOrFail({ id })
		} catch (error) {
			this.handleDBErrors({
				code: ErrorsCodes.userIdNotFound,
				key: id,
			})
		}
	}

	async update(
		id: string,
		updateUserInput: UpdateUserInput,
		updatedBy: User,
	): Promise<User> {
		try {
			const user = await this.userRepository.preload({
				...updateUserInput,
				id,
			})
			if (!user) throw new NotFoundException(`User with id '${id}' not found`)

			user.lastUpdateBy = updatedBy

			return this.userRepository.save(user)
		} catch (error) {
			this.handleDBErrors({
				code: ErrorsCodes.userIdNotFound,
				key: id,
			})
		}
	}

	async block(id: string, user: User): Promise<User> {
		const userToBlock = await this.findOneById(id)
		userToBlock.isActive = false
		userToBlock.lastUpdateBy = user
		return await this.userRepository.save(userToBlock)
	}

	private handleDBErrors(error: IError): never {
		this.commonService.handleDBErrors(error, this.context)
	}
}
