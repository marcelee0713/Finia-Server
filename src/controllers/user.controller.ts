import { Request, Response } from "express";
import { IUserServiceInteractor } from "../interfaces/user.interface";
import { handleError } from "../utils/error-handler";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils";
import { IEmailService } from "../interfaces/nodemailer.interface";

@injectable()
export class UserController {
  private interactor: IUserServiceInteractor;
  private emailService: IEmailService;

  constructor(
    @inject(INTERFACE_TYPE.UserService) interactor: IUserServiceInteractor,
    @inject(INTERFACE_TYPE.EmailServices) emailService: IEmailService
  ) {
    this.interactor = interactor;
    this.emailService = emailService;
  }

  async onCreateUser(req: Request, res: Response) {
    try {
      const username = req.body.username;
      const email = req.body.email;
      const password = req.body.password;

      const uid = await this.interactor.createUser(username, email, password);

      await this.emailService.sendEmail(uid, email);

      return res.status(200).json(uid);
    } catch (err) {
      if (err instanceof Error) {
        const errObj = handleError(err);

        return res.status(errObj.status).json({ error: errObj.message });
      }

      return res.status(500).json({ error: "Internal server error." });
    }
  }

  async onLogin(req: Request, res: Response) {
    try {
      const username = req.body.username;
      const password = req.body.password;

      const accessToken = await this.interactor.logInUser(username, password);

      return res
        .cookie("token", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 2592000000,
        })
        .status(200)
        .json({ token: accessToken });
    } catch (err) {
      if (err instanceof Error) {
        const errObj = handleError(err);

        return res.status(errObj.status).json({ error: errObj.message });
      }

      return res.status(500).json({ error: "Internal server error." });
    }
  }

  async onVerifyEmail(req: Request, res: Response) {
    try {
      const uid = req.body.uid;
      const email = req.body.email;

      await this.interactor.verifyEmailAddress(uid, email);

      return res.status(200).json({ res: "Successfully verified your email address!" });
    } catch (err) {
      if (err instanceof Error) {
        const errObj = handleError(err);
        return res.status(errObj.status).json({ error: errObj.message });
      }

      console.log(err);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
}
