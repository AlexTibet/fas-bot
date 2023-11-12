import { session, Telegraf } from 'telegraf';

import { IBotContext } from './context/context.interface';

import { ICommand } from './commands/command.interface';
import { StartCommand } from './commands/start.command';

import CONFIG_TYPES from './config/config.types';
import { IConfigService } from './config/config.service.interface';

import SESSION_TYPES from './session/session.types';
import { ISessionStoreService } from './session/session.store.service.interface';

import UTILS_TYPES from './utils/utils.types';
import { ILogger } from './utils/logger/logger.interface';

import container from './inversify/inversify.config';

class App {
  private readonly bot: Telegraf<IBotContext>;
  private readonly commands: ICommand[];
  private readonly logger: ILogger;

  constructor() {
    const configService = container.get<IConfigService>(
      CONFIG_TYPES.IConfigService,
    );

    this.bot = new Telegraf<IBotContext>(
      configService.get('TELEGRAMM_API_KEY'),
    );

    this.commands = [new StartCommand(this.bot)];

    const storeService = container.get<ISessionStoreService>(
      SESSION_TYPES.ISessionStoreService,
    );

    this.bot.use(session({ store: storeService.getStore() }));

    this.logger = container.get<ILogger>(UTILS_TYPES.ILogger);
  }

  public async init(): Promise<void> {
    this.logger.info('INIT');

    for (const command of this.commands) {
      command.handle();
      this.logger.info(`Add command: ${command.name}`);
      this.logger.error('Test');
    }

    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));

    try {
      this.logger.info('Bot launch');
      await this.bot.launch();
    } catch (e) {
      this.logger.error('Error', { e });

      throw e;
    }
  }
}

const app = new App();

(async function (): Promise<void> {
  try {
    await app.init();
  } catch (e) {
    console.log(e);
  }
})();
