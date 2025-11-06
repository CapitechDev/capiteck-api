import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles) => SetMetadata(ROLES_KEY, roles);

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

// Decorator para marcar rotas que só admins podem acessar na web
export const ADMIN_WEB_ONLY_KEY = 'adminWebOnly';
export const AdminWebOnly = () => SetMetadata(ADMIN_WEB_ONLY_KEY, true);

// Decorator para marcar rotas que só usuários mobile podem acessar
export const MOBILE_ONLY_KEY = 'mobileOnly';
export const MobileOnly = () => SetMetadata(MOBILE_ONLY_KEY, true);
