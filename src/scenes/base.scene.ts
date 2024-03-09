import { Scenes } from 'telegraf';

import { IBotContext } from '../context/context.interface';

import container from '../inversify/inversify.config';

import { ILogger } from '../utils/logger/logger.interface';
import UTILS_TYPES from '../utils/utils.types';

export abstract class BaseScene {
  protected readonly _scene: Scenes.BaseScene<IBotContext>;
  protected readonly _logger: ILogger;

  protected constructor(name: string) {
    this._scene = new Scenes.BaseScene<IBotContext>(name);
    this._logger = container.get<ILogger>(UTILS_TYPES.ILogger);
  }

  protected abstract init(): void;

  public get scene(): Scenes.BaseScene<IBotContext> {
    return this._scene;
  }

  protected async enter(ctx: IBotContext): Promise<void> {
    this._logger.log(
      `[Scenes]: ${this._scene.id} - enter(), ${JSON.stringify(ctx.session)}`,
    );
    ctx.scene.session.messageIds = [];
  }

  protected async leave(ctx: IBotContext): Promise<void> {
    for await (const id of ctx.scene.session.messageIds) {
      await ctx.deleteMessage(id);
    }

    this._logger.log(
      `[Scenes]: ${this._scene.id} - leave(), ${JSON.stringify(
        ctx.session.sceneData,
      )}`,
    );
  }

  protected addMsgId(ctx: IBotContext, id: number): void {
    ctx.scene.session.messageIds.push(id);
  }
}
