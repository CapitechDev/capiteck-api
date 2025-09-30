import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsValidObjectId } from 'src/validators/object-id.validator';

export class FindTrailParamDto {
  @ApiProperty({
    description: 'ID da trilha (ObjectID válido do MongoDB)',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty({ message: 'ID é obrigatório' })
  @IsString({ message: 'ID deve ser uma string' })
  @Validate(IsValidObjectId)
  id: string;
}
