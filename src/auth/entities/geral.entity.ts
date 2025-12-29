// pessoa.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity('pessoa')
export class Pessoa {
  @PrimaryGeneratedColumn()
  id_pessoa: number;

  @Column()
  nome: string;

  @Column()
  apelido: string;

  @Column()
  local_nascimento: string;

  @Column({ type: 'date' })
  data_nascimento: Date;

  @Column()
  genero: string;

  @Column()
  contacto: string;
}

 

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @OneToOne(() => Pessoa, { cascade: true })
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: Pessoa;

  @Column({ unique: true })
  email: string;
  
    @Column()
  residenciaActual: string
  
  @Column()
  senha: string;
  
}

 
@Entity('funcionario')
export class Funcionario {
  @PrimaryGeneratedColumn()
  id_funcionario: number;

  @OneToOne(() => Pessoa, { cascade: true })
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: Pessoa;

  @Column({ unique: true })
  email: string;

  @Column()
  nip: string;

  @Column()
  categoria: string;

  @Column()
  senha: string;

  @Column()
  departamento: string;

@Column({ type: 'varchar', length: 50, default: 'funcionario' })
perfil: 'admin' | 'monitor' | 'agente' | 'funcionario';

  
 
}
