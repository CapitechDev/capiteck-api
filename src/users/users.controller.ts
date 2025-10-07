import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Put,
  Param,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { RegisterAdminUserDto } from './dto/register-admin-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterOrUpdateUserResponseDto } from './dto/users-response.dto';
import { FindUserParamDto } from './dto/find-user-param.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Public } from 'src/decorators/public.decorator';

@ApiTags('Usuários')
@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Registrar novo usuário administrador' })
  @ApiBody({ type: RegisterAdminUserDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: RegisterOrUpdateUserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou usuário já existe',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async registerAdminUser(
    @Body() registerAdminUserDto: RegisterAdminUserDto,
  ): Promise<RegisterOrUpdateUserResponseDto> {
    return this.usersService.createAdminUser(registerAdminUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar usuário administrador' })
  @ApiBody({ type: UpdateAdminUserDto })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    type: RegisterOrUpdateUserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'ID inválido ou dados inválidos' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async updateAdminUser(
    @Param() params: FindUserParamDto,
    @Body() updateAdminUserDto: UpdateAdminUserDto,
  ): Promise<RegisterOrUpdateUserResponseDto> {
    const { id } = params;
    return this.usersService.updateAdminUser(id, updateAdminUserDto);
  }

  @Public()
  @Get('all')
  findAll() {
    return this.usersService.findAll();
  }
}
