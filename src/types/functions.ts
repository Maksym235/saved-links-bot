import { Context } from 'telegraf';

export type IGlobalFuncProps = (
  userId: number,
  userMessage: string,
  ctx: Context,
  selectedCategory?: string,
) => any;
