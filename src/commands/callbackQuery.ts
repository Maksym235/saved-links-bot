import { Context } from 'telegraf';
import {
  addLinks,
  deleteLinkCallback,
  getAllLinks,
  getRandomLink,
} from '../callbackFunctions';

export const callback_query = async (ctx: Context) => {
  //@ts-ignore
  const cbData: string = ctx.callbackQuery.data;
  //@ts-ignore
  const userMessage = ctx?.message?.text;
  const userId = ctx.message?.from.id;
  const selectedCategory = cbData.slice(0, cbData.length - 4);
  const method = cbData.slice(cbData.length - 4);
  console.log(ctx);
  switch (method) {
    case '_add':
      await addLinks(userId ? userId : 0, userMessage, ctx, selectedCategory);
      ctx.answerCbQuery();
      break;
    case '_rnd':
      await getRandomLink(
        userId ? userId : 0,
        userMessage,
        ctx,
        selectedCategory,
      );
      ctx.answerCbQuery();
      break;
    case '_get':
      await getAllLinks(
        userId ? userId : 0,
        userMessage,
        ctx,
        selectedCategory,
      );
      ctx.answerCbQuery();
      break;
    case '_dlt':
      await deleteLinkCallback(ctx);
      break;
  }
};
