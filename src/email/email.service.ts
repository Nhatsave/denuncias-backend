import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async enviarEmail(destinatario: string, assunto: string, mensagem: string) {
    await this.mailerService.sendMail({
      to: destinatario,
      subject: assunto,
      text: mensagem,
      // html: '<b>Mensagem em HTML</b>', // opcional
    });
  }
}
