import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Scene {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  time: string;

  @Column()
  name: string;

  @Column()
  prompt: string;

  @Column()
  img: string;
}
