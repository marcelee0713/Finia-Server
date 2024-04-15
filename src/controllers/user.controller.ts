import { Request, Response } from "express";
import { IUserServiceInteractor } from "../interfaces/user.interface";
import { handleError } from "../utils/error-handler";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils";

@injectable()
export class UserController {
  private interactor: IUserServiceInteractor;

  constructor(@inject(INTERFACE_TYPE.UserService) interactor: IUserServiceInteractor) {
    this.interactor = interactor;
  }

  async onCreateUser(req: Request, res: Response) {
    try {
      const username = req.body.username;
      const email = req.body.email;
      const password = req.body.password;

      const data = await this.interactor.createUser(username, email, password);

      return res.status(200).json(data);
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
          maxAge: 600000,
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
}
