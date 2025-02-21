import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Index, type Relation } from 'typeorm';

import { ShoppingCartItem } from './shopping_cart_item';
import { User } from './user';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => ShoppingCartItem, (item) => item.order)
  items!: Relation<ShoppingCartItem>[];

  @Index()
  @ManyToOne(() => User)
  user!: Relation<User>;

  @Column()
  zipCode!: string;

  @Column()
  address!: string;

  @Column()
  isOrdered!: boolean;
}
