import { session, Telegraf } from 'telegraf';

import { IBotContext, ISessionData } from './context/context.interface';

import { ICommand } from './commands/command.interface';
import { StartCommand } from './commands/start/start.command';

import CONFIG_TYPES from './config/config.types';
import { IConfigService } from './config/config.service.interface';

import SESSION_TYPES from './session/session.types';
import { ISessionStoreService } from './session/session.store.service.interface';

import UTILS_TYPES from './utils/utils.types';
import { ILogger } from './utils/logger/logger.interface';

import container from './inversify/inversify.config';
import { AddExpensesStage } from './scenes/add-expenses/add.expenses.stage';

class App {
  private readonly _configService: IConfigService;
  private readonly _storeService: ISessionStoreService;
  private readonly _loggerService: ILogger;

  constructor() {
    this._configService = container.get<IConfigService>(
      CONFIG_TYPES.IConfigService,
    );
    this._storeService = container.get<ISessionStoreService>(
      SESSION_TYPES.ISessionStoreService,
    );
    this._loggerService = container.get<ILogger>(UTILS_TYPES.ILogger);
  }

  public async init(): Promise<void> {
    this._loggerService.info('INIT');
    const bot = new Telegraf<IBotContext>(
      this._configService.get('TELEGRAM_API_KEY'),
    );

    bot.use(
      session<ISessionData, IBotContext, 'session'>({
        store: this._storeService.getStore(),
      }),
    );

    const stage = new AddExpensesStage();

    bot.use(stage.middleware());

    const commands: ICommand[] = [new StartCommand(bot)];

    for (const command of commands) {
      command.handle();
      this._loggerService.info(`Add command: ${command.name}`);
    }

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));

    try {
      this._loggerService.info('Bot launch');
      await bot.launch();
    } catch (e) {
      this._loggerService.error('Error', { e });

      throw e;
    }
  }
}

const app = new App();

(async function (): Promise<void> {
  try {
    await app.init();
  } catch (e) {
    console.error(e);
  }
})();
