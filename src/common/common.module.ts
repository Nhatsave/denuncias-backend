import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/auth/entities/geral.entity';
import { Servicos } from './common.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [Servicos],
  exports: [Servicos],   // <-- IMPORTANTE
})
export class CommonModule {}
