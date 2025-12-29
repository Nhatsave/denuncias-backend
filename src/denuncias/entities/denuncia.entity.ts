// denuncia.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Collection } from 'typeorm';
import { Funcionario, Usuario } from 'src/auth/entities/geral.entity';

@Entity('denuncia')
export class Denuncia {
  @PrimaryGeneratedColumn()
  id_denuncia: number;

  @Column('text')
  descricao: string;

  @Column('simple-array', { nullable: true })
  anexos: string[];

  @Column({ default: 'pendente' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_denuncia: Date;

  @Column()
  id_usuario: number;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number | null;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number | null;

  @Column({default: 'mocambique'})
  localizacao: string;

  // Relação Many-to-One com Usuario
  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

                                         //AUMENTADO no dia 24 as 21:29

  // Relação Many-to-One com Usuario
  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_funcionario' })
  funcionario: Funcionario;

 @Column({default: 'Nao'})
 apagado: string;

  @Column({nullable: true})
  observacao: string;

 
}