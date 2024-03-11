import { injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';

import {
  IExpense,
  IExpenseType,
  IPrismaService,
  IUser,
} from './prisma.interface';

import container from '../inversify/inversify.config';

import { ILogger } from '../utils/logger/logger.interface';
import UTILS_TYPES from '../utils/utils.types';

@injectable()
export class PrismaService implements IPrismaService {
  private readonly _client: PrismaClient;
  private readonly _logger: ILogger;

  constructor() {
    this._logger = container.get<ILogger>(UTILS_TYPES.ILogger);
    this._client = new PrismaClient();
    this._client.$connect().catch((e) => {
      this._logger.error('[PrismaService]: Error: ', e);
    });
  }

  get client(): PrismaClient {
    return this._client;
  }

  /** User methods */
  async findOrCreateUser(tId: number, name: string): Promise<IUser> {
    return this._client.user.upsert({
      where: {
        tId,
      },
      update: {
        name,
      },
      create: {
        tId,
        name,
        expenseTypes: {
          create: [
            { name: 'Еда' },
            { name: 'Транспорт' },
            { name: 'Развлечения' },
            { name: 'Жильё' },
            { name: 'Прочее' },
          ],
        },
      },
      include: {
        expenseTypes: true,
      },
    });
  }

  async findUserById(id: string): Promise<IUser | null> {
    return this._client.user.findUnique({
      where: { id },
      include: { expenseTypes: true },
    });
  }

  async findUserByTId(tId: number): Promise<IUser | null> {
    return this._client.user.findUnique({
      where: { tId },
      include: { expenseTypes: true },
    });
  }

  /** Expense types methods */
  async createExpenseType(userId: string, name: string): Promise<IExpenseType> {
    return this._client.expenseType.create({
      data: {
        userId,
        name,
      },
    });
  }

  async findExpenseTypeById(id: string): Promise<IExpenseType | null> {
    return this._client.expenseType.findUnique({ where: { id } });
  }

  async findExpenseTypeByName(
    userId: string,
    name: string,
  ): Promise<IExpenseType | null> {
    return this._client.expenseType.findFirst({
      where: { name, userId },
    });
  }

  async findExpenseTypes(userId: string): Promise<IExpenseType[]> {
    return this._client.expenseType.findMany({ where: { userId } });
  }

  /** Expenses methods */
  async createExpense(
    value: number,
    userId: string,
    typeId: string,
    date: Date,
    comment?: string,
  ): Promise<IExpense> {
    return this._client.expense.create({
      data: {
        value,
        userId,
        typeId,
        comment,
        date,
      },
    });
  }

  async findExpense(id: string): Promise<IExpense | null> {
    return this._client.expense.findUnique({ where: { id } });
  }

  async findExpenses(userId: string): Promise<IExpense[]> {
    return this._client.expense.findMany({ where: { userId } });
  }
}
