import { Field, ObjectType } from '@nestjs/graphql'
import {
	Column,
	Entity,
	Index,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm'

import { User } from '../../users/entities'
import { ListItem } from 'src/list-item/entities/list-item.entity'

@Entity({ name: 'items' })
@ObjectType()
export class Item {
	@Field(() => String)
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Field(() => String)
	@Column()
	name: string

	// @Field(() => Int)
	// @Column()
	// quantity: number

	@Field(() => String, { nullable: true })
	@Column({ nullable: true })
	quantityUnits?: string

	@Field(() => User)
	@ManyToOne(() => User, user => user.items, { nullable: false, lazy: true })
	@Index('userId-index') // Para que al buscar items lo haga por el userId y sea más rapido
	user: User

	@Field(() => [ListItem])
	@OneToMany(() => ListItem, listItem => listItem.item, { lazy: true })
	listItem: ListItem[]
}
