import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTrailDto {
  @ApiProperty({
    description: 'Nome da trilha',
    example: 'Fundamentos do React',
    nullable: true
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(60)
  name: string;

  @ApiProperty({
    description: 'Subtítulo da trilha',
    example: 'Aprenda o básico do React',
    nullable: true
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(60)
  subtitle: string;

  @ApiProperty({
    description: 'Descrição da trilha',
    example: 'Guia completo dos fundamentos do React'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(20)
  description: string;

  @ApiPropertyOptional({
    description: 'Título do vídeo',
    example: 'Introdução ao React'
  })
  @IsOptional()
  @IsString()
  video_title?: string;

  @ApiPropertyOptional({
    description: 'Descrição do vídeo',
    example: 'Este vídeo aborda os fundamentos do React',
  })
  @IsOptional()
  @IsString()
  video_description?: string;

  @ApiPropertyOptional({
    description: 'Referências da trilha',
    example: 'https://react.dev',
  })
  @IsOptional()
  @IsString()
  references?: string;

  @ApiPropertyOptional({
    description: 'Referências do IFrame',
    example: 'https://codesandbox.io/embed/react-example',
  })
  @IsOptional()
  @IsString()
  iframe_references?: string;
}