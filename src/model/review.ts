import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, type Relation } from 'typeorm';

import { Product } from './product';
import { User } from './user';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  postedAt!: string;

  @Index()
  @ManyToOne(() => Product, (product) => product.reviews)
  product!: Relation<Product>;

  @Index()
  @ManyToOne(() => User, (user) => user.reviews)
  user!: Relation<User>;

  @Column()
  comment!: string;
}
