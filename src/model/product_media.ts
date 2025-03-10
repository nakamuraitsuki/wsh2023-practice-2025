import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, type Relation } from 'typeorm';

import { MediaFile } from './media_file';
import { Product } from './product';

@Entity()
export class ProductMedia {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @ManyToOne(() => Product)
  product!: Relation<Product>;

  @Index()
  @ManyToOne(() => MediaFile)
  file!: Relation<MediaFile>;

  @Column()
  isThumbnail!: boolean;
}
