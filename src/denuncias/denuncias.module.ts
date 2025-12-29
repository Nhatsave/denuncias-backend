import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DenunciasService } from './denuncias.service';
import { DenunciasController } from './denuncias.controller';
import { Denuncia } from './entities/denuncia.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { Usuario } from 'src/auth/entities/geral.entity';
import { GeocodingModule } from 'src/common/geocoding/geocoding.module';

@Module({
  imports: [TypeOrmModule.forFeature([Denuncia, Usuario]), GeocodingModule,AuthModule, UsersModule], // <-- aqui
  controllers: [DenunciasController],
  providers: [DenunciasService],
})
export class DenunciasModule {}
