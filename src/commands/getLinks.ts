import { Context } from 'telegraf';
import { selectCategories } from '../selectCategories';

export const get_links = async (ctx: Context) => {
  const userId = ctx?.message?.from.id;
  await selectCategories(userId ? userId : 0, '_get', ctx);
  // 1. Вибір категорії з якої хочемо посилання
};
