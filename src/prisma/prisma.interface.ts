import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface IPrismaService {
  client: PrismaClient;

  /** User methods */
  findOrCreateUser(tId: number, name: string): Promise<IUser>;
  findUserByTId(tId: number): Promise<IUser | null>;
  findUserById(id: string): Promise<IUser | null>;

  /** Expense types methods */
  createExpenseType(userId: string, name: string): Promise<IExpenseType>;
  findExpenseTypeById(id: string): Promise<IExpenseType | null>;
  findExpenseTypeByName(
    userId: string,
    name: string,
  ): Promise<IExpenseType | null>;
  findExpenseTypes(userId: string): Promise<IExpenseType[]>;

  /** Expenses methods */
  createExpense(
    value: number,
    userId: string,
    typeId: string,
    date: Date,
    comment?: string,
  ): Promise<IExpense>;
  findExpense(id: string): Promise<IExpense | null>;
  findExpenses(userId: string): Promise<IExpense[]>;
}

export interface IUser {
  id: string;
  tId: number;
  name: string | null;

  createdAt: Date;
  updatedAt: Date;

  expenseTypes: IExpenseType[];
  expenses?: IExpense[];
}

export interface IExpenseType {
  id: string;
  name: string;
  userId: string;

  createdAt: Date;
  updatedAt: Date;

  user?: IUser;
  expenses?: IExpense[];
}

export interface IExpense {
  id: string;
  value: Decimal;
  comment: string | null;
  date: Date;
  typeId: string;

  createdAt: Date;
  updatedAt: Date;

  type?: IExpenseType;
}
