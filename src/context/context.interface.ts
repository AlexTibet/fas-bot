import { Context, Scenes } from 'telegraf';
import type { User } from 'telegraf/types';
import { IAddExpensesSceneData } from '../scenes/add-expenses/add-expenses.constants';

interface ISceneSession extends Scenes.SceneSessionData {
  // will be available under `ctx.scene.session.mySceneSessionProp`
  messageIds: number[];
  leaveText: string;
}

export interface ISessionData extends Scenes.SceneSession<ISceneSession> {
  user: User | undefined;
  currency?: string;
  sceneData: {
    addExpenses: IAddExpensesSceneData;
  };
}

export interface IBotContext extends Context {
  session: ISessionData;
  scene: Scenes.SceneContextScene<IBotContext, ISceneSession>;
}
