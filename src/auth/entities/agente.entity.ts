// src/auth/entities/usuario.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Pessoa } from './geral.entity';

@Entity('agente')
export class Agente {
  @PrimaryGeneratedColumn()
  idUsuario: number;

  @OneToOne(() => Pessoa, { cascade: true }) // cria automaticamente pessoa relacionada
  @JoinColumn({ name: 'idPessoa' }) // coluna FK no banco
  pessoa: Pessoa;

  @Column({ unique: true })
  email: string;

  @Column()
  senha: string;

  @Column({ default: 'usuario' })
  role: string;

  @Column({ default: true })
  ativo: boolean;
}
