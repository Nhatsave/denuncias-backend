import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Veiculo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  matricula: string;

  @Column()
  marca: string;

  @Column()
  modelo: string;

  @Column({ default: true })
  ativo: boolean;
}
