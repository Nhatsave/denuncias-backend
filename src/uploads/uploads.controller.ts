import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadsService } from './uploads.service';
import { extname } from 'path';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('arquivo')
  @UseInterceptors(
    FileInterceptor('arquivo', {
      storage: diskStorage({
        destination: './uploads', // pasta onde os arquivos serão salvos
        filename: (req, file, cb) => {
          const nome = `${Date.now()}${extname(file.originalname)}`;
          cb(null, nome);
        },
      }),
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    }),
  )
  async uploadArquivo(@UploadedFile() file: Express.Multer.File) {
    const tipo = file.mimetype.startsWith('image')
      ? 'foto'
      : file.mimetype.startsWith('video')
      ? 'video'
      : 'audio';

    const upload = await this.uploadsService.criarUpload(tipo, file.originalname, file.path);
    return upload;
  }
}
