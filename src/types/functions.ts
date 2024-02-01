import { Context } from 'telegraf';

export type IGlobalFuncProps = (
  supabase: any,
  userId: number,
  userMessage: string,
  ctx: Context,
  selectedCategory?: string,
) => any;
