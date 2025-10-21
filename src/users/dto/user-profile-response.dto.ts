import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponseDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID único do usuário',
  })
  id: string;

  @ApiProperty({
    example: 'joao@example.com',
    description: 'Email do usuário',
  })
  email: string;

  @ApiProperty({
    example: 'João Silva',
    description: 'Nome do usuário',
  })
  name: string;

  @ApiProperty({
    example: 'USER',
    description: 'Papel do usuário no sistema',
    enum: ['USER', 'ADMIN'],
  })
  role: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Data de criação da conta',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Data da última atualização',
  })
  updatedAt: Date;
}

export class UsersListResponseDto {
  @ApiProperty({
    type: [UserProfileResponseDto],
    description: 'Lista de usuários',
  })
  users: UserProfileResponseDto[];

  @ApiProperty({
    example: 10,
    description: 'Total de usuários encontrados',
  })
  total: number;
}
