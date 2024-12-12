import { Context } from 'telegraf';

export const search_link = async (ctx: Context) => {
  ctx.reply(
    `для пошуку певного посилання ми можете відправити короткий опис з приставкою -s. \nПриклад: -s Короткий опис`,
  );
};
