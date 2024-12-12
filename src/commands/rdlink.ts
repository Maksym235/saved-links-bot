import { Context } from 'telegraf';
import { selectCategories } from '../selectCategories';

export const rdlink = async (ctx: Context) => {
  const userId = ctx?.message?.from.id;

  await selectCategories(userId ? userId : 0, '_rnd', ctx);
};
