import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  UseInterceptors, 
  UploadedFiles, 
  Req 
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DenunciasService } from './denuncias.service';
import { CriarDenunciaDto } from './dto/criar-denuncia.dto';

@Controller('denuncias')
export class DenunciasController {
  constructor(private readonly denunciasService: DenunciasService) {}

  @Post('criar')
  @UseGuards(JwtAuthGuard) // ← AQUI no controller!
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'anexos', maxCount: 5 }
  ]))
  async criar(
    @UploadedFiles() files: { anexos?: Express.Multer.File[] },
    @Body() dto: CriarDenunciaDto,
    @Req() req: Request,
  ) {
    // O user vem do JWT após validação
    const user = (req as any).user;
    
    console.log('=== DEBUG CONTROLLER ===');
    console.log('User do JWT:', user);
    
    // Extrai caminhos dos arquivos
    const caminhos = files?.anexos?.map(file => file.filename) || [];
    
    // Chama o SERVICE (sem decoradores!)
    return this.denunciasService.criar(dto, caminhos, user);
  }
}


/*import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  Req
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DenunciasService } from './denuncias.service';
import { diskStorage } from 'multer';

@Controller('denuncias')
export class DenunciasController {
  constructor(private readonly denunciasService: DenunciasService) {}
/*
  @Post('criar')
  @UseInterceptors(FilesInterceptor('anexos'))
  async criar(
    @Body() dto: any,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any
  ) {
    // Converte os caminhos dos anexos
    const caminhos = files?.map((f) => f.path) || [];

    // Extrai token do header
    const token = req.headers['authorization']?.replace('Bearer ', '');

    return this.denunciasService.criar(dto, caminhos, token);
  }
/

  
  @Post('criar')
  @UseInterceptors(
    FilesInterceptor('anexos', 5, { // ← Configuração SIMPLES do upload
      storage: diskStorage({
        destination: './uploads', // ← Pasta onde salvar
        filename: (req, file, cb) => {
          // Nome único: timestamp-nomeOriginal
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async criar(
    @Body() dto: any,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any // ← Agora tem req.user
  ) {
    // Caminhos dos arquivos (agora files[0].path existe!)
    const caminhos = files?.map((f) => f.filename) || [];
    
    // Passa o USUÁRIO (não o token!)
    return this.denunciasService.criar(dto, caminhos, req.user);
  }
 

}
*/

