import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Upload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tipo: string; // 'foto', 'video', 'audio'

  @Column()
  nomeArquivo: string; // nome do arquivo salvo no servidor

  @Column()
  caminho: string; // caminho completo ou URL do arquivo

  @CreateDateColumn()
  criadoEm: Date;
}
