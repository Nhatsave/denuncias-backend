import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Denuncia } from './entities/denuncia.entity';
import { Usuario } from 'src/auth/entities/geral.entity';
import { GeocodingService } from 'src/common/geocoding/geocoding.service';

@Injectable()
export class DenunciasService {
  constructor(
    @InjectRepository(Denuncia)
    private readonly denunciaRepository: Repository<Denuncia>,

    @InjectRepository(Usuario)
    private readonly cidadaoRepository: Repository<Usuario>,

    private readonly geocodingService: GeocodingService,
  ) {}
 
  async criar(dto: any, caminhos: string[], user: any) {
    // 1. Extrair email do JWT
    const email = user.email; // ← Corrigido: user.email

    console.log('=== DEBUG SERVICE CRIAR ===');
    console.log('Email do user:', email);
    console.log('User completo:', user);

    // 2. Buscar usuário no banco
    const cidadao = await this.cidadaoRepository.findOne({
      where: { email },
    });

    if (!cidadao) {
      throw new NotFoundException('Nenhum cidadão encontrado com esse email');
    }

    console.log('Cidadão encontrado:', cidadao);

    const localizacao = await this.geocodingService.obterEnderecoPorCoordenadas({
        latitude: dto.latitude,
        longitude: dto.longitude,
      });

    // AGORA você tem a STRING no campo 'endereco' do objeto
      console.log('Localização objeto:', localizacao);
      console.log('Endereço (string):', localizacao.endereco); // ← Esta é a string!

      // Extrai as partes como strings
    const enderecoCompleto = localizacao.endereco; // ← JÁ É STRING
    const  bairro = localizacao.bairro || null;
    const  cidade = localizacao.cidade || null;
    const  provincia = localizacao.provincia || null;
    const localProximo =  provincia + ' ' + cidade + ' ' +  bairro + ' ' + enderecoCompleto
    // 3. Criar denúncia
    const denuncia = this.denunciaRepository.create({
      ...dto,
      anexos: caminhos,
      localizacao: localProximo,
      id_usuario: cidadao.id_usuario,
      status: 'pendente',
      apagado: 'Nao',
      data_denuncia: new Date(),
    });

    return await this.denunciaRepository.save(denuncia);
  }
}


/*import {
  Injectable,
  NotFoundException,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Denuncia } from './entities/denuncia.entity';
import { Usuario } from 'src/auth/entities/geral.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Injectable()
export class DenunciasService {
  constructor(
    @InjectRepository(Denuncia)
    private readonly denunciaRepository: Repository<Denuncia>,

    @InjectRepository(Usuario)
    private readonly cidadaoRepository: Repository<Usuario>,
  ) {}
 
  @Post('criar')
  @UseGuards(JwtAuthGuard) // ← DEVE estar presente
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'anexos', maxCount: 5 }
  ]))
  
  async criar(dto: any, caminhos: string[], user: any) {
    // user vem do JwtStrategy.validate()
    const email = user// user.email;

    const cidadao = await this.cidadaoRepository.findOne({
      where: { email },
    });

    if (!cidadao) {
      throw new NotFoundException('Nenhum cidadão encontrado com esse email');
    }

    const denuncia = this.denunciaRepository.create({
      ...dto,
      anexos: caminhos,
      id_usuario: cidadao.id_usuario,
      status: 'pendente',
    });

    return await this.denunciaRepository.save(denuncia);
  } 

  // denuncias.service.ts
  /*
async criar(dto: any, caminhos: string[], user: any) {
  // user = { sub: 123, email: 'x@x.com' } (do token)
  const userId = user.sub; // ID do usuário
  
  // Busca usuário REAL no banco
  const usuario = await this.cidadaoRepository.findOne({
    where: { id_usuario: userId }
  });
  
  // Cria denúncia com ID real
  const denuncia = this.denunciaRepository.create({
    ...dto,
    anexos: caminhos,
    id_usuario: usuario.id_usuario, // ← ID real do banco
    criado_por: usuario.email,      // ← Email para auditoria
  });
  
  return this.denunciaRepository.save(denuncia);
}/
}
*/