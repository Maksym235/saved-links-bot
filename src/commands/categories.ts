import categoriesModel from '../models/categoryModel';

export const categoriesCmd = async (ctx: any) => {
  const userId = ctx.message.from.id;

  const resp = (await categoriesModel.find({ owner: userId })) as any;
  const allCategories = `- ` + resp?.map((ctg: any) => ctg.name).join('\n-');
  await ctx.reply(allCategories, {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Додати нову', callback_data: 'category_add' }],
      ],
    },
  });
};
