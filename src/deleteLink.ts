import { IGlobalFuncProps } from './types/functions';

export const deleteLink: IGlobalFuncProps = async (
  supabase,
  user_Id,
  user_message,
  ctx,
) => {
  const link_id = user_message.slice(2).trim();
  const { data, error } = await supabase
    .from('links')
    .select()
    .eq('user_id', user_Id)
    .eq('id', link_id);

  if (error) {
    ctx.reply(`Помилка при видаленні, перевірте дані та спробуйте ще раз`);
    return;
  }
  if (data.length === 0) {
    ctx.reply(`Посилання не знайдено, перевірте id`);
    return;
  }
  data.forEach(async (el: any) => {
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('user_id', user_Id)
      .eq('id', link_id);
    if (error) {
      ctx.reply(`Помилка при видаленні, перевірте дані та спробуйте ще раз`);
      return;
    }
  });
  ctx.reply('Посилання видалено');
  return;
};
