import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, type Relation } from 'typeorm';

import { FeatureItem } from './feature_item';

@Entity()
export class FeatureSection {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Index()
  @OneToMany(() => FeatureItem, (item) => item.section, {eager: true})
  items!: Relation<FeatureItem[]>;
}
