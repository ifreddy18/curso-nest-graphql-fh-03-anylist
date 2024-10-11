import { ObjectType, Field, ID } from '@nestjs/graphql'
import {
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	// Unique,
} from 'typeorm'

import { Item } from 'src/items/entities'
import { List } from 'src/lists/entities/list.entity'

@Entity({ name: 'listItems' })
// @Unique('listItem-item', ['list', 'item'])
@ObjectType()
export class ListItem {
	@Field(() => ID)
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Field(() => Number)
	@Column({ type: 'numeric' })
	quantity: number

	@Field(() => Boolean)
	@Column({ type: 'boolean' })
	completed: boolean

	// Relations

	@Field(() => List)
	@ManyToOne(() => List, list => list.listItem, { lazy: true })
	list: List

	@Field(() => Item)
	@ManyToOne(() => Item, item => item.listItem, { lazy: true })
	item: Item
}
