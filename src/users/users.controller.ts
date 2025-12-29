// src/users/users.controller.ts
import { Controller, Get, Query, UseGuards, Req, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('usuario')
//@UseGuards(JwtAuthGuard) // Protege TODAS as rotas deste controller
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req) {
    // req.user vem do JwtStrategy.validate()
    return this.usersService.getMe(req.user.id);
  }

  @Get('minhas-denuncias')
  @Roles('cidadao') // role que o usuário deve ter
  async getMinhasDenuncias(
    @Req() req,
    @Query('pagina') pagina: number = 1,
    @Query('limite') limite: number = 10,
  ) {

    // Use req.user.sub (não req.user.id)
    console.log('🔑 Usuário na requisição:', req.user);
    console.log('🆔 ID do usuário (sub):', req.user.sub);

    return this.usersService.buscarDenunciasDoUsuario(
      req.user.sub,
      Number(pagina),
      Number(limite),
    );
  }

  @Patch('apagar/:id')
  @Roles('cidadao') // role que o usuário deve ter
async apagarDenuncia(
  @Param('id') id: number,
  @Req() req
) {
  const denuncia = await this.usersService.marcarComoApagada( req.user.sub ,id);
  return { mensagem: 'Denúncia marcada como apagada', denuncia };
}

}