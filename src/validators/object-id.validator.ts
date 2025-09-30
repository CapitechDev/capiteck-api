import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { isValidObjectId } from '../utils/mongodb-validation';

@ValidatorConstraint({ name: 'isValidObjectId', async: false })
export class IsValidObjectId implements ValidatorConstraintInterface {
  validate(id: string): boolean {
    return isValidObjectId(id);
  }

  defaultMessage(): string {
    return 'ID inválido para operação.';
  }
}