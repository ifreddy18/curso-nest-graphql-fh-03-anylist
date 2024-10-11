import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@Injectable()
export class EncryptAdapter {
	/**
	 * Encrypt the password
	 * @param password
	 * @returns encrypted password
	 */
	hashSync(password: string): string {
		const saltOrRounds: string | number = 10
		return bcrypt.hashSync(password, saltOrRounds)
	}

	/**
	 * Return true if password has the same value as the real value of the
	 * encrypted password
	 * @param password
	 * @param encryptedPassword
	 * @returns true if are the same
	 */
	compareSync(password: string, encryptedPassword: string): boolean {
		return bcrypt.compareSync(password, encryptedPassword)
	}
}
