import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import GameEntity from './game.entity';

export enum AssetsType {
  IMAGE = 'image',
  VIDEO = 'video',
}

@Entity()
export default class GameAssets {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({
    type: 'enum',
    enum: AssetsType,
    default: AssetsType.IMAGE,
  })
  type: AssetsType;

  @ManyToOne(() => GameEntity, (game) => game.assets)
  game: GameEntity;
}
