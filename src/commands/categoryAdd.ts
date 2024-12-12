import { Context } from 'telegraf';

export const category_add = async (ctx: Context) => {
  ctx.reply(
    `Вкажіть назву категорії з приставкою -c(Англійська). Приклад: "-c Фільми"`,
  );
  ctx.answerCbQuery();
};
