import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersRepository, SafeUser } from './users.repository';
import { RegisterAdminUserDto } from './dto/register-admin-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private configService: ConfigService,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findOneById(id: string): Promise<SafeUser | null> {
    return this.usersRepository.findById(id);
  }

  async findAll(): Promise<SafeUser[]> {
    return this.usersRepository.findAll();
  }

  async createAdminUser(adminUserDto: RegisterAdminUserDto): Promise<SafeUser> {
    const { adminCode, email, password, name } = adminUserDto;

    const adminCodeFromEnv = this.configService.get<string>('ADMIN_CODE');
    if (!adminCode || !adminCodeFromEnv || adminCode !== adminCodeFromEnv) {
      throw new UnauthorizedException('Usuário não autorizado.');
    }

    const userExists = await this.usersRepository.existsByEmail(email);
    if (userExists) {
      throw new BadRequestException('Usuário já cadastrado.');
    }

    const hashedPassword = await this.hashPassword(password);

    return this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      role: 'ADMIN',
    });
  }

  async updateAdminUser(id: string, updateAdminUserDto: UpdateAdminUserDto) {
    const userExists = await this.usersRepository.existsById(id);
    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const { name, email, password } = updateAdminUserDto;

    let newHashPassword: string | undefined = undefined;
    if (password) newHashPassword = await this.hashPassword(password);

    return this.usersRepository.update(id, {
      name,
      email,
      password: newHashPassword,
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async updateResetToken(
    id: string,
    resetToken: string,
    resetTokenExpires: Date,
  ) {
    return this.usersRepository.update(id, {
      resetToken,
      resetTokenExpires,
    });
  }

  async findByResetToken(token: string) {
    return this.usersRepository.findByResetToken(token);
  }

  async updatePasswordAndClearToken(id: string, hashedPassword: string) {
    return this.usersRepository.update(id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null,
    });
  }
}
