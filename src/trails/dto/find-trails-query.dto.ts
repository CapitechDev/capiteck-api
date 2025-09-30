import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max, IsString, MaxLength } from 'class-validator';

export class FindTrailsQueryDto {
  @ApiPropertyOptional({
    description: 'Número de trilhas a retornar',
    minimum: 1,
    maximum: 100,
    default: 10,
    example: 10
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O limite deve ser um número inteiro' })
  @Min(1, { message: 'O limite deve ser pelo menos 1' })
  @Max(100, { message: 'O limite não pode exceder 100' })
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Número de trilhas a pular para paginação',
    minimum: 0,
    default: 0,
    example: 0
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Skip deve ser um número inteiro' })
  @Min(0, { message: 'Skip não pode ser negativo' })
  skip?: number = 0;

  @ApiPropertyOptional({
    description: 'Buscar trilhas por nome, subtítulo ou descrição',
    maxLength: 100,
    example: 'react'
  })
  @IsOptional()
  @IsString({ message: 'A busca deve ser uma string' })
  @MaxLength(100, { message: 'O termo de busca não pode exceder 100 caracteres' })
  search?: string;
}