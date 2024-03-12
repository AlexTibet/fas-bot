import { IExpenseType } from '../../prisma/prisma.interface';

export enum AddExpensesSceneNames {
  ADD_VALUE = 'add-expenses:add-value',
  SELECT_TYPE = 'add-expenses:select-type',
  SELECT_DATE = 'add-expenses:select-date',
  ADD_COMMENT = 'add-expenses:add-comment',
}

export interface IAddExpensesSceneData {
  value?: number;
  type?: IExpenseType;
  date?: Date;
  comment?: string;
}
