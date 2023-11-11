import { session, Telegraf } from 'telegraf';

import { IBotContext } from './context/context.interface';

import { ICommand } from './commands/command.interface';
import { StartCommand } from './commands/start.command';

import CONFIG_TYPES from './config/config.types';
import { IConfigService } from './config/config.service.interface';

import SESSION_TYPES from './session/session.types';
import { ISessionStoreService } from './session/session.store.service.interface';

import container from './inversify/inversify.config';

class App {
  private readonly bot: Telegraf<IBotContext>;
  private readonly commands: ICommand[];

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
  }

  public async init(): Promise<void> {
    for (const command of this.commands) {
      command.handle();
    }

    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));

    await this.bot.launch();
  }
}

const app = new App();

(async function (): Promise<void> {
  try {
    console.log('Init app');
    await app.init();
  } catch (e) {
    console.log(e);
  }
})();
