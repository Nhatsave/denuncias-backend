import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Denuncia } from 'src/denuncias/entities/denuncia.entity'; // Assumindo a entidade Denuncia
import { Pessoa, Usuario } from 'src/auth/entities/geral.entity';
import { DenunciaPendenteDto } from './dto/denunciaPendente.dto';

@Injectable()
export class GestaoService {
  private readonly logger = new Logger('Bootstrap');
  cidadaoRepository: any;

  constructor(
    @InjectRepository(Denuncia)
    private denunciaRepository: Repository<Denuncia>,

       @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>
    
  ) {}

  async buscarDenunciasPendentes(
  pagina: number,
  limite: number,
): Promise<{ results: DenunciaPendenteDto[]; total: number }> {

  const skip = (pagina - 1) * limite;

  const [results, total] = await this.denunciaRepository.findAndCount({
    where: { status: 'pendente' },
    relations: {
      usuario: {
        pessoa: true,
      },
    },
    take: limite,
    skip,
  });

  const mappedResults: DenunciaPendenteDto[] = results.map(d => ({
    id_denuncia: d.id_denuncia,
    descricao: d.descricao,
    status: d.status,
    data_criacao: d.data_denuncia,
    nome: d.usuario.pessoa.nome,
    apelido: d.usuario.pessoa.apelido,
    contacto: d.usuario.pessoa.contacto,
    localizacao: d.localizacao
  }));

  return { results: mappedResults, total };
}

 
  async denunciasEmProcesso(dto: any, caminhos: string[], user: any) {
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

    // 3. Criar denúncia
    const denuncia = this.denunciaRepository.create({
      ...dto,
      anexos: caminhos,
      id_usuario: cidadao.id_usuario,
      status: 'pendente',
      data_criacao: new Date(),
    });

    return await this.denunciaRepository.save(denuncia);
  }

 
 
async buscarDadosUsuarioComPessoa(idUsuario: number): Promise<any> {
    console.log(`\n=== DEBUG buscarDadosUsuarioComPessoa ===`);
    console.log(`Buscando usuário com ID: ${idUsuario}`);
    
    try {
      const usuario = await this.usuarioRepository.findOne({
        where: { id_usuario: idUsuario },
        relations: ['pessoa'],
      });
      
      console.log(`Usuário encontrado: ${usuario ? 'SIM' : 'NÃO'}`);
      
      if (!usuario) {
        console.log('Usuário não encontrado, retornando valores nulos');
        return {
          email: null,
          contacto: null,
          nome_completo: null,
          nome: null,
          apelido: null,
          genero: null,
          data_nascimento: null,
          local_nascimento: null,
        };
      }
      
      console.log(`Email do usuário: ${usuario.email}`);
      console.log(`Pessoa relacionada: ${usuario.pessoa ? 'SIM' : 'NÃO'}`);
      
      if (usuario.pessoa) {
        console.log(`Nome da pessoa: ${usuario.pessoa.nome} ${usuario.pessoa.apelido}`);
        console.log(`Contacto: ${usuario.pessoa.contacto}`);
      }
      
      return {
        email: usuario.email,
        contacto: usuario.pessoa?.contacto || null,
        nome_completo: usuario.pessoa ? `${usuario.pessoa.nome} ${usuario.pessoa.apelido}` : null,
        nome: usuario.pessoa?.nome || null,
        apelido: usuario.pessoa?.apelido || null,
        genero: usuario.pessoa?.genero || null,
        data_nascimento: usuario.pessoa?.data_nascimento || null,
        local_nascimento: usuario.pessoa?.local_nascimento || null,
      };
    } catch (error) {
      console.error('Erro em buscarDadosUsuarioComPessoa:', error);
      throw error;
    }
}

    
  async findAll() {
  const data = await this.denunciaRepository.query('SELECT * FROM denuncia');
  console.log(data);
  return data;
  }

  }