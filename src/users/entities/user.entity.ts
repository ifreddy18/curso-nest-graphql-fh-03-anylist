import { ObjectType, Field, ID } from '@nestjs/graphql'
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { Item } from '../../items/entities'
import { List } from 'src/lists/entities/list.entity'

@Entity({ name: 'users' })
@ObjectType()
export class User {
	@Field(() => ID)
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Field(() => String)
	@Column()
	fullName: string

	@Field(() => String)
	@Column({ unique: true })
	email: string

	//! @Field(() => String) // Don't must exist queries for password
	@Column()
	password: string

	@Field(() => [String])
	@Column({
		type: 'text',
		array: true,
		default: ['user'],
	})
	roles: string[]

	@Field(() => Boolean)
	@Column({
		type: 'boolean',
		default: true,
	})
	isActive: boolean

	// Relations
	@Field(() => User, { nullable: true })
	@ManyToOne(() => User, user => user.lastUpdateBy, {
		nullable: true,
		lazy: true, // To load relations
	})
	@JoinColumn({ name: 'lastUpdateBy' })
	lastUpdateBy?: User

	// @Field(() => [Item]) //? Use instead ResolveField 'items' in users.resolver.ts
	@OneToMany(() => Item, item => item.user, { lazy: true })
	items: Item[]

	@OneToMany(() => List, list => list.user)
	lists: List[]
}
