import { ObjectType, Field, ID } from '@nestjs/graphql'
import { ListItem } from 'src/list-item/entities/list-item.entity'
import { User } from 'src/users/entities'
import {
	Column,
	Entity,
	Index,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({ name: 'lists' })
@ObjectType()
export class List {
	@Field(() => ID)
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Field(() => String)
	@Column()
	name: string

	@Field(() => User)
	@ManyToOne(() => User, user => user.lists, { nullable: false, lazy: true })
	@Index('userId-list-index')
	user: User

	// @Field(() => [ListItem])
	@OneToMany(() => ListItem, listItem => listItem.list, { lazy: true })
	listItem: ListItem[]
}
