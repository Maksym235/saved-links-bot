import { decrypt, encrypt } from './crypto';
import { IAllLinks } from './types/allLinks';
import { IGlobalFuncProps } from './types/functions';

export const addLinks: IGlobalFuncProps = async (
  supabase,
  user_Id,
  user_message,
  ctx,
  selectedCategory,
) => {
  const messageArr = user_message.split(' ');
  if (!messageArr[0].includes('http') || !messageArr[0].includes('https')) {
    ctx.reply('посилання не вірного формату');
    await ctx.answerCbQuery();
    return;
  }
  const desc = messageArr.slice(1).join(' ');
  const { error } = await supabase.from('links').insert({
    link: encrypt(messageArr[0]),
    short_desc: encrypt(desc),
    user_id: user_Id,
    category: selectedCategory,
  });
  if (error) {
    console.log(error.message);
  }
  await ctx.reply('все супер, зберіг');
  await ctx.answerCbQuery();
};

export const getRandomLink: IGlobalFuncProps = async (
  supabase,
  user_Id,
  user_message,
  ctx,
  selectedCategory,
) => {
  const { data, error }: any = await supabase
    .from('links')
    .select('*')
    .eq('user_id', user_Id)
    .eq('category', selectedCategory);
  if (error) {
    console.log(error);
  }
  // Вибираємо рандомний індекс
  if (!data.length) {
    ctx.reply('В цій категорії немає збережених посилань');
    await ctx.answerCbQuery();
    return;
  }
  const randomIndex = Math.floor(Math.random() * data.length);
  const parseData = data[randomIndex];
  await ctx.reply(
    `короткий опис: ${decrypt(parseData.short_desc)} \n \n посилання: ${decrypt(parseData.link)}`,
  );
  await ctx.answerCbQuery();
};

export const getAllLinks: IGlobalFuncProps = async (
  supabase,
  user_Id,
  user_message,
  ctx,
  selectedCategory,
) => {
  const { data, error }: any = await supabase
    .from('links')
    .select('*')
    .eq('user_id', user_Id)
    .eq('category', selectedCategory);
  if (error) {
    console.log(error.message);
  }
  // if (!data.length) {
  //   ctx.reply('В цій категорії немає збережених посилань');
  //   await ctx.answerCbQuery();
  //   return;
  // }
  const allLinks =
    `- ` +
    data
      ?.map(
        (ctg: IAllLinks) =>
          `[${decrypt(ctg.short_desc)}](${decrypt(ctg.link)})`,
      )
      .join('\n- ');
  ctx.reply(allLinks, { parse_mode: 'Markdown' });
};
