import { applyDecorators } from '@nestjs/common';
import {
  ApiSecurity,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

export function ApiAdminOnly() {
  return applyDecorators(
    ApiSecurity('bearer'),
    ApiUnauthorizedResponse({ description: 'Token JWT inválido ou expirado' }),
    ApiForbiddenResponse({ description: 'Acesso restrito a administradores' }),
  );
}

export function ApiMobileOnly() {
  return applyDecorators(
    ApiSecurity('bearer'),
    ApiUnauthorizedResponse({ description: 'Token JWT inválido ou expirado' }),
    ApiForbiddenResponse({ description: 'Acesso restrito a usuários mobile' }),
  );
}

export function ApiAuthRequired() {
  return applyDecorators(
    ApiSecurity('bearer'),
    ApiUnauthorizedResponse({ description: 'Token JWT inválido ou expirado' }),
  );
}
