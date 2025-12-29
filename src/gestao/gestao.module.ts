// src/gestao/gestao.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GestaoController } from './gestao.controller';
import { GestaoService } from './gestao.service'; // Corrigido caminho

// Importar todas as entidades necessárias
import { Denuncia } from '../denuncias/entities/denuncia.entity';
import { Usuario, Pessoa } from '../auth/entities/geral.entity'; 

@Module({
  imports: [
    // Adicione todas as entidades usadas no GestaoService
    TypeOrmModule.forFeature([
      Denuncia, 
      Usuario, 
      Pessoa, 
    ]),
  ],
  controllers: [GestaoController],
  providers: [GestaoService],
  exports: [GestaoService],
})
export class GestaoModule {}