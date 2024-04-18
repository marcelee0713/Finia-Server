export interface IEmailService {
  sendEmail(uid: string, emailToSend: string): Promise<void>;
}
