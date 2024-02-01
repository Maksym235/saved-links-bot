import { IGlobalFuncProps } from './types/functions';

export const addCategory: IGlobalFuncProps = async (
  supabase,
  userId,
  userMessage,
  ctx,
) => {
  const allMsg = userMessage.split(' ');
  const category_name = allMsg.slice(1).join(' ');
  // Перевірка чи є вже така категорія в базі
  const { data: ctgs } = await supabase
    .from('categories')
    .select('*')
    .eq('category_name', category_name);

  if (ctgs?.length) {
    ctx.reply('Така категорія вже існує');
    return;
  }
  // Додоавання категорії
  const { error } = await supabase.from('categories').insert({
    category_name,
    user_id: userId,
  });
  if (error) {
    ctx.reply(`Error, please try again`);
    console.log(error.message);
    return;
  }
  ctx.reply('Категорія додана');
  return;
};
