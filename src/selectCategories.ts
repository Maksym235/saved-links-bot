import categoriesModel from './models/categoryModel';
import { IGlobalFuncProps } from './types/functions';
function splitIntoArrays(objectArray: any, maxItems: any) {
  let arrayOfArrays = [];
  for (let i = 0; i < objectArray.length; i += maxItems) {
    arrayOfArrays.push(objectArray.slice(i, i + maxItems));
  }
  return arrayOfArrays;
}

export const selectCategories: IGlobalFuncProps = async (
  userId,
  method,
  ctx,
) => {
  console.log(userId, method, ctx);
  const categories = await categoriesModel.find({ owner: userId });

  const changedData = categories?.map((item: any) => {
    return {
      text: item.name,
      callback_data: item.name + method,
    };
  });
  let arrayOfArrays = splitIntoArrays(changedData, 3);

  await ctx.reply('Виберіть категорію', {
    reply_markup: {
      inline_keyboard: arrayOfArrays,
    },
  });
};
