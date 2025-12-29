import { Module } from '@nestjs/common';
import { GestaoService } from './gestao.service';
import { GestaoController } from './gestao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Veiculo } from './entities/veiculo.entity';
import { Historico } from './entities/historico.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Veiculo, Historico])
  ],
  controllers: [GestaoController],
  providers: [GestaoService]
})
export class GestaoModule {}
