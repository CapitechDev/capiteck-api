import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Put,
  Param,
  HttpCode,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { RegisterAdminUserDto } from './dto/register-admin-user.dto';
import { RegisterMobileUserDto } from './dto/register-mobile-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterOrUpdateUserResponseDto } from './dto/users-response.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { FindUserParamDto } from './dto/find-user-param.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { PlatformAccessGuard } from 'src/guards/user-type.guard';
import { Public } from 'src/decorators/public.decorator';
import { AdminWebOnly, MobileOnly } from 'src/decorators/roles.decorator';

@ApiTags('Usuários')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard, PlatformAccessGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  @Public()
  @ApiOperation({
    summary: 'Registrar novo usuário administrador',
    description:
      'Cria uma nova conta de administrador no sistema. Requer código de admin válido.',
  })
  @ApiBody({ type: RegisterAdminUserDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário administrador criado com sucesso',
    type: RegisterOrUpdateUserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Dados inválidos, usuário já existe ou código de admin incorreto',
  })
  @ApiResponse({ status: 401, description: 'Código de administrador inválido' })
  async registerAdminUser(
    @Body() registerAdminUserDto: RegisterAdminUserDto,
  ): Promise<RegisterOrUpdateUserResponseDto> {
    return this.usersService.createAdminUser(registerAdminUserDto);
  }

  @Post('mobile')
  @HttpCode(201)
  @Public()
  @ApiOperation({
    summary: 'Registrar novo usuário mobile',
    description:
      'Cria uma nova conta de usuário para acesso mobile. Role padrão é USER.',
  })
  @ApiBody({ type: RegisterMobileUserDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário mobile criado com sucesso',
    type: RegisterOrUpdateUserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou usuário já existe',
  })
  async registerMobileUser(
    @Body() registerMobileUserDto: RegisterMobileUserDto,
  ): Promise<RegisterOrUpdateUserResponseDto> {
    return this.usersService.createMobileUser(registerMobileUserDto);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar usuário administrador',
    description: 'Atualiza os dados de um usuário administrador existente',
  })
  @ApiBody({ type: UpdateAdminUserDto })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    type: RegisterOrUpdateUserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'ID inválido ou dados inválidos' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
  @ApiResponse({ status: 403, description: 'Sem permissão para esta ação' })
  async updateAdminUser(
    @Param() params: FindUserParamDto,
    @Body() updateAdminUserDto: UpdateAdminUserDto,
  ): Promise<RegisterOrUpdateUserResponseDto> {
    const { id } = params;
    return this.usersService.updateAdminUser(id, updateAdminUserDto);
  }

  @Get('all')
  @AdminWebOnly()
  @ApiOperation({
    summary: 'Listar todos os usuários',
    description:
      'Retorna a lista completa de usuários do sistema. Acesso restrito a administradores.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
    type: [UserProfileResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
  @ApiResponse({
    status: 403,
    description: 'Acesso restrito a administradores',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('mobile/profile')
  @MobileOnly()
  @ApiOperation({
    summary: 'Obter perfil do usuário mobile',
    description:
      'Retorna o perfil do usuário mobile autenticado. Acesso restrito a usuários mobile.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário retornado com sucesso',
    type: UserProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
  @ApiResponse({
    status: 403,
    description: 'Acesso restrito a usuários mobile',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async getMobileProfile(@Request() req) {
    return this.usersService.findOneById(req.user.userId);
  }
}
