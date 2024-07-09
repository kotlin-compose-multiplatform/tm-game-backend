import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import GameAssets from './game-assets.entity';
import ServerEntity from 'src/modules/server/entity/server.entity';
import CategoryEntity from 'src/modules/category/entity/category.entity';

@Entity()
export default class GameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title_tm: string;

  @Column()
  title_en: string;

  @Column()
  title_ru: string;

  @Column()
  desc_tm: string;

  @Column()
  desc_en: string;

  @Column()
  desc_ru: string;

  @OneToMany(() => GameAssets, (assets) => assets.game, {
    onDelete: 'CASCADE',
  })
  assets?: GameAssets[];

  @Column()
  site_url: string;

  @Column()
  star: number;

  @Column()
  steam_id: string;

  @ManyToMany(() => ServerEntity, (server) => server.game)
  server?: ServerEntity[];

  @ManyToOne(() => CategoryEntity, (category) => category.game)
  category?: CategoryEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
