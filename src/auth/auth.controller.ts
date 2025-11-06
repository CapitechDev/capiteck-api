import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';
import {
  LoginRequestDto,
  LoginResponseDto,
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
  ResetPasswordRequestDto,
  ResetPasswordResponseDto,
} from './dto/auth-response.dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Fazer login do usuário',
    description:
      'Autentica o usuário com email e senha, retornando um token JWT',
  })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos' })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter perfil do usuário autenticado',
    description: 'Retorna os dados do usuário atualmente autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil recuperado com sucesso',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
        username: { type: 'string', example: 'João Silva' },
        email: { type: 'string', example: 'joao@example.com' },
        role: { type: 'string', example: 'USER' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('forgot-password')
  @Public()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Solicitar recuperação de senha',
    description:
      'Envia um token de 6 dígitos para o email do usuário para recuperação de senha',
  })
  @ApiBody({ type: ForgotPasswordRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Token de recuperação enviado com sucesso',
    type: ForgotPasswordResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 400, description: 'Email inválido' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordRequestDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @Public()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Redefinir senha',
    description:
      'Redefine a senha do usuário usando o token recebido por email',
  })
  @ApiBody({ type: ResetPasswordRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Senha redefinida com sucesso',
    type: ResetPasswordResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Token inválido ou expirado' })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordRequestDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }
}
