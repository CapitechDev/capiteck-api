import { ApiProperty } from '@nestjs/swagger';
import { Trail } from '@prisma/client';

export class TrailsResponseMetaDto {
  @ApiProperty({
    description: 'Número total de trilhas que atendem aos critérios',
    example: 150
  })
  total: number;

  @ApiProperty({
    description: 'Número de trilhas retornadas nesta resposta',
    example: 10
  })
  limit: number;

  @ApiProperty({
    description: 'Número de trilhas puladas',
    example: 0
  })
  skip: number;

  @ApiProperty({
    description: 'Se há mais trilhas disponíveis',
    example: true
  })
  hasMore: boolean;
}

export class FindTrailsResponseDto {
  @ApiProperty({
    description: 'Array de objetos de trilha',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        name: { type: 'string', example: 'Fundamentos do React' },
        subtitle: { type: 'string', example: 'Aprenda o básico do React' },
        description: { type: 'string', example: 'Guia completo dos fundamentos do React' },
        video_title: { type: 'string', example: 'Introdução ao React' },
        video_description: { type: 'string', example: 'Este vídeo aborda...' },
        references: { type: 'string', example: 'https://react.dev' },
        iframe_references: { type: 'string', example: 'https://codesandbox.io/...' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  data: Trail[];

  @ApiProperty({
    description: 'Metadados sobre a resposta',
    type: TrailsResponseMetaDto
  })
  meta: TrailsResponseMetaDto;
}

export class FindTrailResponseDto implements Trail {
  @ApiProperty({
    description: 'ID da trilha',
    example: '507f1f77bcf86cd799439011'
  })
  id: string;

  @ApiProperty({
    description: 'Nome da trilha',
    example: 'Fundamentos do React',
    nullable: true
  })
  name: string;

  @ApiProperty({
    description: 'Subtítulo da trilha',
    example: 'Aprenda o básico do React',
    nullable: true
  })
  subtitle: string;

  @ApiProperty({
    description: 'Descrição da trilha',
    example: 'Guia completo dos fundamentos do React'
  })
  description: string;

  @ApiProperty({
    description: 'Título do vídeo',
    example: 'Introdução ao React'
  })
  video_title: string | null;

  @ApiProperty({
    description: 'Descrição do vídeo',
    example: 'Este vídeo aborda os fundamentos do React',
    nullable: true
  })
  video_description: string | null;

  @ApiProperty({
    description: 'Referências da trilha',
    example: 'https://react.dev',
    nullable: true
  })
  references: string | null;

  @ApiProperty({
    description: 'Referências do IFrame',
    example: 'https://codesandbox.io/embed/react-example',
    nullable: true
  })
  iframe_references: string | null;

  @ApiProperty({
    description: 'Data de criação',
    example: '2023-01-01T00:00:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2023-01-01T00:00:00.000Z'
  })
  updatedAt: Date;
}