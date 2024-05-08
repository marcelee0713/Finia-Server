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

        return res.status(parseInt(errObj.status)).json(errObj);
      }

      return res.status(500).json({ error: "Internal server error." });
    }
  }

  async onLogin(req: Request, res: Response) {
    try {
      const isLoggedIn = req.cookies.token;

      if (isLoggedIn) throw new Error("user-already-logged-in");

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

        return res.status(parseInt(errObj.status)).json(errObj);
      }

      return res.status(500).json({ error: "Internal server error." });
    }
  }

  async onLogout(req: Request, res: Response) {
    try {
      const token = res.locals.token;

      if (!token) throw new Error("not-authorized");

      await this.interactor.logOutUser(token);

      return res.clearCookie("token").status(200).json({ res: "Successfully logged out user" });
    } catch (err) {
      if (err instanceof Error) {
        const errObj = handleError(err);

        return res.status(parseInt(errObj.status)).json(errObj);
      }

      return res.status(500).json({ error: "Internal server error." });
    }
  }

  async onEmailVerificationReq(req: Request, res: Response) {
    try {
      const token = req.body.token;
      const username = req.body.username;

      const data = await this.interactor.emailVerificationRequest(username, token);

      await this.emailService.sendEmail(data.uid, data.email);

      res.status(200).json({ res: "Successfully requested an email verification!" });
    } catch (err) {
      if (err instanceof Error) {
        const errObj = handleError(err);

        return res.status(parseInt(errObj.status)).json(errObj);
      }

      return res.status(500).json({ error: "Internal server error." });
    }
  }

  async onVerifyEmail(req: Request, res: Response) {
    try {
      const uid = req.body.uid;
      const email = req.body.email;
      const token = req.body.token;

      await this.interactor.verifyEmailAddress(uid, email, token);

      return res.status(200).json({ res: "Successfully verified your email address!" });
    } catch (err) {
      if (err instanceof Error) {
        const errObj = handleError(err);

        return res.status(parseInt(errObj.status)).json(errObj);
      }

      return res.status(500).json({ error: "Internal server error." });
    }
  }

  async onPasswordResetReq(req: Request, res: Response) {
    try {
      const email = req.body.email;

      const token = await this.interactor.resetPasswordRequest(email);

      await this.emailService.sendResetPassword(token);

      return res.status(200).json({ res: "We have sent a reset password to your email address!" });
    } catch (err) {
      if (err instanceof Error) {
        const errObj = handleError(err);

        return res.status(parseInt(errObj.status)).json(errObj);
      }

      return res.status(500).json({ error: "Internal server error." });
    }
  }

  async onPasswordReset(req: Request, res: Response) {
    try {
      const newPassword = req.body.password;
      const token = req.body.token;

      await this.interactor.resetPassword(newPassword, token);

      return res.status(200).json({ res: "Successfully reset your password!" });
    } catch (err) {
      if (err instanceof Error) {
        const errObj = handleError(err);

        return res.status(parseInt(errObj.status)).json(errObj);
      }

      return res.status(500).json({ error: "Internal server error." });
    }
  }

  async onChangePassword(req: Request, res: Response) {
    try {
      const uid = req.body.uid;
      const newPassword = req.body.newPassword;

      await this.interactor.changePassword(uid, newPassword);

      return res.status(200).json({ res: "Successfully reset your password!" });
    } catch (err) {
      if (err instanceof Error) {
        const errObj = handleError(err);

        return res.status(parseInt(errObj.status)).json(errObj);
      }

      return res.status(500).json({ error: "Internal server error." });
    }
  }

  async onGetPassword(req: Request, res: Response) {
    try {
      const uid = res.locals.uid;

      if (!res.locals.uid) throw new Error("not-authorized");

      const password = await this.interactor.getPassword(uid);

      return res.status(200).json({ res: password });
    } catch (err) {
      if (err instanceof Error) {
        const errObj = handleError(err);

        return res.status(parseInt(errObj.status)).json(errObj);
      }

      return res.status(500).json({ error: "Internal server error." });
    }
  }
}
