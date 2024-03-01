export enum AddExpensesSceneNames {
  ADD_VALUE = 'add-expenses:add-value',
  SELECT_TYPE = 'add-expenses:select-type',
  ADD_COMMENT = 'add-expenses:add-comment',
}

export interface IAddExpensesSceneData {
  value?: number;
  type?: string;
  comment?: string;
}
