import { Transporter, createTransport } from "nodemailer";
import { IEmailService } from "../interfaces/nodemailer.interface";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { DEFAULT_EMAIL_CONTENT, INTERFACE_TYPE } from "../utils";
import { inject, injectable } from "inversify";
import { IJWTService } from "../interfaces/jwt.interface";
import { handleError } from "../utils/error-handler";

@injectable()
export class EmailServices implements IEmailService {
  private jwtService: IJWTService;
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;
  private readonly emailAddress: string;
  private url: string;
  constructor(@inject(INTERFACE_TYPE.JWTServices) jwtService: IJWTService) {
    this.jwtService = jwtService;
    const emailPassKey = process.env.SECRET_EMAIL_PASSWORD as string;
    const userEmail = process.env.SECRET_EMAIL as string;
    const protocol = process.env.SECRET_PROTOCOL as string;
    const domain = process.env.SECRET_DOMAIN as string;
    const authRoute = process.env.SECRET_LOGIN_ROUTE as string;

    this.transporter = createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: userEmail,
        pass: emailPassKey,
      },
    });

    this.emailAddress = `${userEmail}@gmail.com`;
    this.url = `${protocol}${domain}${authRoute}?token=`;
  }

  async sendEmail(uid: string, emailToSend: string): Promise<void> {
    try {
      const token = this.jwtService.createToken({
        uid: uid,
        email: emailToSend,
        tokenType: "EMAIL",
      });

      this.url = `${this.url}${token}`;

      await this.transporter.sendMail({
        to: emailToSend,
        from: { name: DEFAULT_EMAIL_CONTENT.Name, address: this.emailAddress },
        subject: DEFAULT_EMAIL_CONTENT.Subject,
        text: DEFAULT_EMAIL_CONTENT.Text,
        html: `<h1>Email Verification</h1><br><a href=${this.url}>Confirm Email and Sign in</a><br><p>This will expire in one day. <strong>DO NOT SHARE THIS LINK!</strong></p>`,
      });
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }

      throw new Error("email-service-error");
    }
  }
}
