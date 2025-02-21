import { Entity, ManyToOne, PrimaryGeneratedColumn, Index, type Relation } from 'typeorm';

import { FeatureSection } from './feature_section';
import { Product } from './product';

@Entity()
export class FeatureItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @ManyToOne(() => FeatureSection)
  section!: Relation<FeatureSection>;

  @Index()
  @ManyToOne(() => Product)
  product!: Relation<Product>;
}
