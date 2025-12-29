import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

// auth/guards/jwt-auth.guard.ts (versão com logs)
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Verifica se o endpoint é público
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    
    if (isPublic) {
      return true; // Permite acesso sem token
    }

    
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    
    console.log('Token recebido:', token ? 'SIM' : 'NÃO');
    
    if (!token) {
      console.log('Token não fornecido');
      throw new UnauthorizedException('Token não fornecido');
    }

    try {
      console.log('Verificando token...');
      const payload = await this.jwtService.verifyAsync(token);
      console.log('Payload decodificado:', payload);
      request.user = payload;
      
    } catch (error) {
      console.error('Erro na verificação do token:', error.message);
      console.error('Token completo:', token);
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    // Verificação de roles
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    
    console.log('Roles requeridas:', requiredRoles);
    console.log('Usuário do token:', request.user);

    if (!requiredRoles || requiredRoles.length === 0) {
      console.log('Nenhuma role requerida - acesso permitido');
      return true;
    }

    const user = request.user;
    const temAcesso = requiredRoles.includes(user.role);
    
    console.log('FONTE: jwt-auth.guards.ts' );
    console.log('Usuário tem acesso?', temAcesso);
    console.log('Role do usuário:', user.role);
    
    if (!temAcesso) {
      console.log(`Acesso negado. Usuário precisa de uma das roles: ${requiredRoles.join(', ')}`);
      throw new UnauthorizedException('Acesso não autorizado para este perfil');
    }

    return temAcesso;
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      console.log('Cabeçalho Authorization não encontrado');
      return null;
    }
    
    const [type, token] = authHeader.split(' ');
    console.log('Tipo de token:', type);
    return type === 'Bearer' ? token : null;
  }
}