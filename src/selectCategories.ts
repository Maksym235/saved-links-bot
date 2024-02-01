import { IGlobalFuncProps } from './types/functions';
function splitIntoArrays(objectArray: any, maxItems: any) {
  let arrayOfArrays = [];
  for (let i = 0; i < objectArray.length; i += maxItems) {
    arrayOfArrays.push(objectArray.slice(i, i + maxItems));
  }
  return arrayOfArrays;
}

export const selectCategories: IGlobalFuncProps = async (
  supabase,
  userId,
  method,
  ctx,
) => {
  const { data: ctgs, error: ctgsErr } = await supabase
    .from('categories')
    .select('category_name')
    .eq('user_id', userId);
  if (ctgsErr) {
    console.log(ctgsErr);
  }

  const changedData = ctgs?.map((item: any) => {
    return {
      text: item.category_name,
      callback_data: item.category_name + method,
    };
  });
  let arrayOfArrays = splitIntoArrays(changedData, 3);

  await ctx.reply('Виберіть категорію', {
    reply_markup: {
      inline_keyboard: arrayOfArrays,
    },
  });
};
