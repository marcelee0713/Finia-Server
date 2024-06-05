import { inject, injectable } from "inversify";
import { ISchedulerService } from "../interfaces/cron.interface";
import { IUserRepository } from "../interfaces/user.interface";
import { CRON_TIME, INTERFACE_TYPE } from "../utils";
import cronParser from "cron-parser";

@injectable()
export class SchedulerServices implements ISchedulerService {
  private repo: IUserRepository;

  constructor(@inject(INTERFACE_TYPE.UserRepository) repo: IUserRepository) {
    this.repo = repo;
  }

  async execute(): Promise<void> {
    await this.scheduleRemoveUnverifiedUsers();
    await this.scheduleRemoveExpiredTokens();
  }

  async scheduleRemoveUnverifiedUsers(): Promise<void> {
    await this.scheduleTask(CRON_TIME.EveryWeek, this.repo.removeUnverifiedUsers);
  }

  async scheduleRemoveExpiredTokens(): Promise<void> {
    await this.scheduleTask(CRON_TIME.EveryDay, this.repo.removeExpiredTokens);
  }

  async scheduleTask(cronTime: string, task: () => Promise<void>): Promise<void> {
    try {
      const interval = cronParser.parseExpression(cronTime, {
        tz: CRON_TIME.Timezone,
      });

      const nextRun = interval.next().toDate();

      const delay = nextRun.getTime() - Date.now();

      setTimeout(async () => {
        await task();
        await this.scheduleTask(cronTime, task);
      }, delay);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error("Internal Server Error");
    }
  }
}
