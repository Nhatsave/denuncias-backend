import { Controller, Get, Query, Param, Put, Body, UseGuards } from '@nestjs/common';
import { GestaoService } from './gestao.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('gestao')
export class GestaoController {
  constructor(private readonly gestaoService: GestaoService) {}

  // Só quem estiver autenticado pode acessar
  @UseGuards(JwtAuthGuard)
  @Roles('monitor')
  //@Get('pendentes')
  @Get('denuncias/pendentes')
  async buscarDenunciasPendentes(
    @Query('pagina') pagina: number = 1,
    @Query('limite') limite: number = 10
  ) {
    return await this.gestaoService.buscarDenunciasPendentes(pagina, limite);
  }
 
   @Get()
  findAll() {
    return this.gestaoService.findAll();
  }
  
}