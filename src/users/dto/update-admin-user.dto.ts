import { ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '@prisma/client';
import {
  IsEmail, IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';

export class UpdateAdminUserDto {
  @ApiPropertyOptional({ 
    description: 'Nome do usuário admin',
    example: 'João Silva'
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({ 
    description: 'Email do usuário admin',
    example: 'joao@example.com'
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ 
    description: 'Nova senha do usuário admin',
    example: 'novaSenha123'
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password?: string;
}
