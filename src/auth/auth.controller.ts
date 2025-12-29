// src/auth/auth.controller.ts
import { 
  Body, 
  Controller, 
  Post, 
  HttpCode, 
  HttpStatus,
  UseGuards 
} from "@nestjs/common";
import { CreateFuncionarioDto, CreateUserDto } from "./dto/usuarioGeral.dto";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { Public } from "./decorators/public.decorator";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ========== REGISTRO ==========
  
  @Public() // 👈 não precisa de token
  @Post('register-usuario')
  @HttpCode(HttpStatus.CREATED)
  async registerUsuario(@Body() dto: CreateUserDto) {
    return this.authService.createUsuario(dto);
  }

  @Public() // 👈 não precisa de token
  @Post('register-funcionario')
  @HttpCode(HttpStatus.CREATED)
  async registerFuncionario(@Body() dto: CreateFuncionarioDto) {
    return this.authService.createFuncionario(dto);
  }

  // ========== LOGIN ==========
  
  @Post('login')
  @Public() // 👈 não precisa de token
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; senha: string }) {
    return this.authService.login(body.email, body.senha);
  }
  
  @Post('login-funcionario')
  @Public() // 👈 não precisa de token
  @HttpCode(HttpStatus.OK)
  async loginFuncionario(@Body() body: { nip: string; senha: string }) {
    return this.authService.loginFuncionario(body.nip, body.senha);
  }

  // ========== TOKENS ==========
  
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  // ========== ROTAS PROTEGIDAS (TESTE) ==========
  
  @Post('teste-protegido')
  @HttpCode(HttpStatus.OK)
  async testeProtegido(@Body() body: any) {
    return {
      mensagem: "Rota protegida acessada com sucesso!",
      timestamp: new Date().toISOString()
    };
  }

  // ========== DEBUG (OPCIONAL) ==========
  
  @Post('decode-token')
  @HttpCode(HttpStatus.OK)
  async decodeToken(@Body('token') token: string) {
    try {
      // Decodifica sem verificar (apenas para visualização)
      const decoded = this.decodeJwt(token);
      return {
        success: true,
        decoded,
        parts: {
          header: this.base64Decode(token.split('.')[0]),
          payload: this.base64Decode(token.split('.')[1]),
          signature: token.split('.')[2]?.substring(0, 20) + '...'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ========== MÉTODOS PRIVADOS DE DEBUG ==========
  
  private decodeJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  private base64Decode(str: string): string {
    try {
      return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
    } catch {
      return 'Não foi possível decodificar';
    }
  }
}