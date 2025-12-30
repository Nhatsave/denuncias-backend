import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { Usuario } from 'src/auth/entities/geral.entity';
import { Denuncia } from 'src/denuncias/entities/denuncia.entity';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Denuncia]), AuthModule, CommonModule],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
  controllers: [UsersController]
})
export class UsersModule {}
