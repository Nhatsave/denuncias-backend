import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserGestao {
  @PrimaryGeneratedColumn()
  id: number; // ID numérico

  @Column()
  nome: string;

  @Column()
  apelido: string;

  @Column()
  nip: string;

  @Column()
  categoria: string;

  @Column()
  contacto: string;

  @Column()
  departamento: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 'cidadão' })
  perfil: string;

  @Column()
  senha: string;
}
