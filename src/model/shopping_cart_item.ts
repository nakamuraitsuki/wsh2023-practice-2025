import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, type Relation } from 'typeorm';

import { Order } from './order';
import { Product } from './product';

@Entity()
@Index(['order.id', 'product.id'], { unique: true })
export class ShoppingCartItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @ManyToOne(() => Product)
  product!: Relation<Product>;

  @Index()
  @ManyToOne(() => Order)
  order!: Relation<Order>;

  @Column()
  amount!: number;
}
