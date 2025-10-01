import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TrailsService } from './trails.service';
import { FindTrailsQueryDto } from './dto/find-trails-query.dto';
import {
  FindTrailsResponseDto,
  FindTrailResponseDto,
} from './dto/trails-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FindTrailParamDto } from './dto/find-trail-param.dto';
import { CreateTrailDto } from './dto/create-trail.dto';
import { UpdateTrailDto } from './dto/update-trail.dto';

@ApiTags('Trilhas')
@Controller('trails')
export class TrailsController {
  constructor(private readonly trailsService: TrailsService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Obter todas as trilhas com paginação',
  })
  @ApiResponse({
    status: 200,
    description: 'Trilhas recuperadas com sucesso',
    type: FindTrailsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros de consulta inválidos',
  })
  async findAll(
    @Query() query: FindTrailsQueryDto,
  ): Promise<FindTrailsResponseDto> {
    const { limit = 10, skip = 0, search } = query;
    return this.trailsService.findAll(limit, skip, search);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter uma trilha específica por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Trilha recuperada com sucesso',
    type: FindTrailResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Trilha não encontrada',
  })
  async findOne(
    @Param() params: FindTrailParamDto,
  ): Promise<FindTrailResponseDto> {
    const { id } = params;
    return this.trailsService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Criar nova trilha',
  })
  @ApiResponse({
    status: 201,
    description: 'Trilha criada com sucesso',
    type: FindTrailResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou trilha já existe com esse subtítulo',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async create(
    @Body() createTrailDto: CreateTrailDto,
  ): Promise<FindTrailResponseDto> {
    return this.trailsService.create(createTrailDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar trilha existente',
  })
  @ApiResponse({
    status: 200,
    description: 'Trilha atualizada com sucesso',
    type: FindTrailResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Trilha não encontrada',
  })
  async update(
    @Param() params: FindTrailParamDto,
    @Body() updateTrailDto: UpdateTrailDto,
  ): Promise<FindTrailResponseDto> {
    const { id } = params;
    return this.trailsService.update(id, updateTrailDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir trilha existente',
  })
  @ApiResponse({
    status: 204,
    description: 'Trilha excluída com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Trilha não encontrada',
  })
  async delete(@Param() params: FindTrailParamDto): Promise<void> {
    const { id } = params;
    return this.trailsService.delete(id);
  }
}
