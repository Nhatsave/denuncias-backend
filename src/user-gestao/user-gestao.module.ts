import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGestao } from './entities/gestao.entity';
import { UserGestaoService } from './user-gestao.service';
import { UserGestaoController } from './user-gestao.controller';
import { Usuario } from 'src/auth/entities/geral.entity';
import { Denuncia } from 'src/denuncias/entities/denuncia.entity';
 
@Module({
  imports: [TypeOrmModule.forFeature([UserGestao, Usuario, Denuncia])], // <-- importante
  providers: [UserGestaoService],
  controllers: [UserGestaoController],
  exports: [UserGestaoService], // se quiser usar em outros módulos
})
export class UserGestaoModule {}
