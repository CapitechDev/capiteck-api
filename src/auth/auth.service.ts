import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/email/email.service';
import * as bcrypt from 'bcrypt';
import { generateRandomToken } from 'src/utils/generate-token';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Omit<User, 'password'>) {
    const payload = {
      username: user.name,
      sub: user.id,
      role: user.role,
    };
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const resetToken = generateRandomToken(6);
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 1 hora

    // Salvar token no banco
    await this.usersService.updateResetToken(
      user.id,
      resetToken,
      resetTokenExpires,
    );

    // Enviar email
    await this.emailService.sendResetToken(user, resetToken);

    return { message: 'Reset token sent to email' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);
    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    // Verificar se o token não expirou
    if (
      !user.resetTokenExpires ||
      new Date() > new Date(user.resetTokenExpires)
    ) {
      throw new Error('Reset token has expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar senha e limpar token
    await this.usersService.updatePasswordAndClearToken(
      user.id,
      hashedPassword,
    );

    return { message: 'Password reset successfully' };
  }
}
