import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

  async sendResetToken(
    user: { email: string; name: string },
    resetToken: string,
  ) {
    const mailOptions = {
      from: process.env.GOOGLE_EMAIL,
      to: user.email,
      subject: 'Recuperação de Senha - Capitech',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color:#25059b;">Olá, ${user.name}.</h2>
          <p>Você solicitou a recuperação de sua senha.</p>
          <p>Use o seguinte token para redefinir sua senha:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; background: #f4f4f4; padding: 10px 20px; border-radius: 5px; color:#25059b;">${resetToken}</span>
          </div>
          <p><strong>Importante:</strong> Este token é válido por 15 minutos.</p>
          <p>Se você não solicitou a recuperação de senha, por favor, ignore este email.</p>
          <br>
          <p>Atenciosamente,</p>
          <p><strong>Equipe Capitech</strong></p>
        </div>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
