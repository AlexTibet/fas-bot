import { MiddlewareFn, Scenes } from 'telegraf';

import { IBotContext } from '../context/context.interface';

import { IStage } from './stage.interface';

import { AddValueScene } from './add-expenses/add-value.scene';
import { SelectTypeScene } from './add-expenses/select-type.scene';
import { SelectDateScene } from './add-expenses/select-date.scene';
import { AddCommentScene } from './add-expenses/add-comment.scene';

import { GetExpensesScene } from './get-expenses/get-expenses.scene';

export class Stage implements IStage {
  private readonly _middleware: MiddlewareFn<IBotContext>;

  constructor() {
    /** Add Expenses */
    const addValue = new AddValueScene();
    const selectType = new SelectTypeScene();
    const selectDate = new SelectDateScene();
    const addComment = new AddCommentScene();

    /** Get Expenses */
    const getExpenses = new GetExpensesScene();

    const stage = new Scenes.Stage<IBotContext>(
      [
        /** Add Expenses */
        addValue.scene,
        selectType.scene,
        selectDate.scene,
        addComment.scene,

        /** Get Expenses */
        getExpenses.scene,
      ],
      { ttl: 100 },
    );

    this._middleware = stage.middleware();
  }

  middleware(): MiddlewareFn<IBotContext> {
    return this._middleware;
  }
}
