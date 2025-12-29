import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Historico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  veiculoId: number;

  @Column()
  descricao: string;

  @Column()
  data: Date;
}
