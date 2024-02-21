import { MiddlewareFn, Scenes } from 'telegraf';
import { IBotContext } from '../../context/context.interface';
import { AddValueScene } from './add-value.scene';
import { SelectTypeScene } from './select-type.scene';
import { IStage } from '../stage.interface';

export class AddExpensesStage implements IStage {
  private readonly _stage: Scenes.Stage<IBotContext>;
  constructor() {
    const addValue = new AddValueScene();
    const selectType = new SelectTypeScene();

    this._stage = new Scenes.Stage<IBotContext>(
      [addValue.scene, selectType.scene],
      { ttl: 10 },
    );
  }

  public middleware(): MiddlewareFn<IBotContext> {
    return this._stage.middleware();
  }
}
