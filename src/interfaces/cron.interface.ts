export interface ISchedulerService {
  execute(): Promise<void>;
  scheduleRemoveUnverifiedUsers(): Promise<void>;
  scheduleRemoveExpiredTokens(): Promise<void>;
  scheduleTask(cronTime: string, task: () => Promise<void>): Promise<void>;
}
