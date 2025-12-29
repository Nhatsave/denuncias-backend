import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upload } from './entities/upload.entity';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Upload)
    private uploadRepository: Repository<Upload>,
  ) {}

  async criarUpload(tipo: string, nomeArquivo: string, caminho: string): Promise<Upload> {
    const upload = this.uploadRepository.create({ tipo, nomeArquivo, caminho });
    return this.uploadRepository.save(upload);
  }

  async listarUploads(): Promise<Upload[]> {
    return this.uploadRepository.find();
  }
}
