import { Context } from 'telegraf';
import { searchLink } from '../searchLink';
import { addCategory } from '../addCategory';
import { deleteLink } from '../deleteLink';
import { selectCategories } from '../selectCategories';

export const on_text = async (ctx: Context) => {
  // Визначаю повідомлення і id користувача
  //@ts-ignore
  const userMessage = ctx?.message?.text;
  const userId = ctx.message?.from.id;
  const method = userMessage.slice(0, 2);

  switch (method) {
    case '-s':
      await searchLink(userId ? userId : 0, userMessage, ctx);
      break;
    case '-c':
      await addCategory(userId ? userId : 0, userMessage, ctx);
      break;
    case '-d':
      await deleteLink(userId ? userId : 0, userMessage, ctx);
      break;
    default:
      await selectCategories(userId ? userId : 0, '_add', ctx);
  }
};
