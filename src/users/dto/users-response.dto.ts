import { ApiProperty } from '@nestjs/swagger';

export class RegisterOrUpdateUserResponseDto {
  @ApiProperty({
    description: 'ID do usuário',
    type: 'string',
    example: '507f1f77bcf86cd799439011'
  })
  id: string;

  @ApiProperty({
    description: 'Nome do usuário',
    type: 'string',
    example: 'João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    type: 'string',
    example: 'joao@example.com',
  })
  email: string;

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
