import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DenunciasModule } from './denuncias/denuncias.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';
import { Upload } from './uploads/entities/upload.entity';
import { AuthModule } from './auth/auth.module';
import { Denuncia } from './denuncias/entities/denuncia.entity';
import { ConfigModule } from '@nestjs/config';
import { UserGestaoModule } from './user-gestao/user-gestao.module';
import { UserGestao } from './user-gestao/entities/gestao.entity';
import { GestaoModule } from './gestao/gestao.module';
import { CodigoValidacao, Funcionario, Pessoa, Usuario } from './auth/entities/geral.entity';
import { HistoricoModule } from './historico/historico.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD, Reflector } from '@nestjs/core'; 
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true ,  envFilePath: '.env'}),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',// 'mysql-denuncias.alwaysdata.net', //'localhost',
      port: Number(process.env.DB_PORT || 3306),//3306,
      username:  process.env.DB_USER || 'root', // 'denuncias',//'root',
      password: process.env.DB_PASS || 'Nhatsa90', //'Kelinha@2311', //'Nhatsa90',
      database:  process.env.DB_NAME || 'alotransito', //, 'alotransito',
      entities: [Usuario, Upload, Denuncia, UserGestao, Pessoa, Funcionario, CodigoValidacao],
      synchronize: true,
    }),
    UsersModule,
    DenunciasModule,
    UploadsModule,
    AuthModule,
    UserGestaoModule,
    GestaoModule,
    HistoricoModule, 
    JwtModule.register({ 
      secret: process.env.JWT_SECRET || 'SUA_CHAVE_SECRETA',
      signOptions: { expiresIn: '1h' } 
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Reflector, // ✅ Adicione o Reflector como provider
    {
      provide: APP_GUARD,
      useFactory: (jwtService: JwtService, reflector: Reflector) => {
        return new JwtAuthGuard(jwtService, reflector);
      },
      inject: [JwtService, Reflector],
    },
  ],
})
export class AppModule {}