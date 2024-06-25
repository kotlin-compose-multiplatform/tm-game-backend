import CategoryEntity from 'src/modules/category/entity/category.entity';
import GameEntity from 'src/modules/game/entity/game.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class ServerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  server_name: string;

  @Column()
  server_port: number;

  @Column()
  server_host: string;

  @Column()
  server_username: string;

  @Column()
  server_password: string;

  @Column()
  display_host: string;

  @Column()
  display_port: string;

  @Column()
  speed: number;

  @ManyToOne(() => CategoryEntity, (category) => category.server)
  category?: CategoryEntity;

  @ManyToMany(() => GameEntity, (game) => game.server)
  game?: GameEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
