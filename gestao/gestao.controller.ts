import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { GestaoService } from './gestao.service';

@Controller('gestao')
export class GestaoController {
  constructor(private readonly service: GestaoService) {}

  // GET /gestao/veiculos
  @Get('veiculos')
  findAll() {
    return this.service.findAllVeiculos();
  }

  // GET /gestao/veiculos/10
  @Get('veiculos/:id')
  findOne(@Param('id') id: string) {
    return this.service.findVeiculoById(+id);
  }

  // POST /gestao/veiculos
  @Post('veiculos')
  save(@Body() data) {
    return this.service.saveVeiculo(data);
  }

  // DELETE /gestao/veiculos/10
  @Delete('veiculos/:id')
  remove(@Param('id') id: string) {
    return this.service.removeVeiculo(+id);
  }

  // Histórico
  @Get('historico/:id')
  historico(@Param('id') id: string) {
    return this.service.getHistorico(+id);
  }
}
