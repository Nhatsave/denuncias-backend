import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRoot({
  transport: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'frp.nhatsa@gmail.com',
      pass: 'icdoscqnuhcacroy ', // senha de app do Gmail
    },
    tls: {
      rejectUnauthorized: false, // ignora certificados autoassinados
    },
  },
  defaults: {
    from: '"No Reply" <enhatsave@gmail.com>',
  },
})
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
