export interface IEmailService {
  sendEmail(uid: string, emailToSend: string): Promise<void>;
  sendResetPassword(token: string): Promise<void>;
}
