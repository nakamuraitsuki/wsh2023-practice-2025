import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, type Relation } from 'typeorm';

import { LimitedTimeOffer } from './limited_time_offer';
import { ProductMedia } from './product_media';
import { Review } from './review';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  price!: number;

  @Column()
  description!: string;

  @Index()
  @OneToMany(() => ProductMedia, (media) => media.product)
  media!: Relation<ProductMedia[]>;

  @Index()
  @OneToMany(() => LimitedTimeOffer, (offer) => offer.product)
  offers!: Relation<LimitedTimeOffer[]>;

  @Index()
  @OneToMany(() => Review, (review) => review.product)
  reviews!: Relation<Review[]>;
}
