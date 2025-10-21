import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  MOBILE_ONLY_KEY,
  ADMIN_WEB_ONLY_KEY,
  Role,
} from '../decorators/roles.decorator';

@Injectable()
export class PlatformAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isMobileOnly = this.reflector.getAllAndOverride<boolean>(
      MOBILE_ONLY_KEY,
      [context.getHandler(), context.getClass()],
    );

    const isAdminWebOnly = this.reflector.getAllAndOverride<boolean>(
      ADMIN_WEB_ONLY_KEY,
      [context.getHandler(), context.getClass()],
    );

    const { user } = context.switchToHttp().getRequest();

    // Se a rota é só para mobile e o usuário não é USER (mobile)
    if (isMobileOnly && user.role !== Role.USER) {
      throw new ForbiddenException('Acesso restrito a usuários mobile');
    }

    // Se a rota é só para admin web e o usuário não é ADMIN
    if (isAdminWebOnly && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Acesso restrito a administradores');
    }

    // ADMIN pode acessar qualquer coisa
    // USER só pode acessar rotas mobile ou rotas sem restrição
    return true;
  }
}
