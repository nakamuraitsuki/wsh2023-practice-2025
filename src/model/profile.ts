import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Index, type Relation } from 'typeorm';

import { MediaFile } from './media_file';
import { User } from './user';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => User)
  @JoinColumn()
  user!: Relation<User>;

  @Column()
  name!: string;

  @Index()
  @ManyToOne(() => MediaFile)
  avatar!: Relation<MediaFile>;
}
