import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common'
import { IError } from './interfaces'
import { ErrorsCodes } from './constants'

@Injectable()
export class CommonService {
	constructor() {}

	handleDBErrors(error: IError, context: string): never {
		// Duplicate key
		if (error.code === ErrorsCodes.duplicateKey)
			throw new BadRequestException(error.detail)
		// Email not found
		if (error.code === ErrorsCodes.emailNotFound)
			throw new NotFoundException(`Email '${error.key}' not found`)
		if (error.code === ErrorsCodes.userIdNotFound)
			throw new NotFoundException(`User with id '${error.key}' not found`)

		const logger = new Logger(context)
		logger.error(error)

		throw new InternalServerErrorException('Check server logs')
	}
}
