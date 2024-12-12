import linksModel from './models/linkModel';
import { IGlobalFuncProps } from './types/functions';

export const deleteLink: IGlobalFuncProps = async (
  user_Id,
  user_message,
  ctx,
) => {
  const link_id = user_message.slice(2).trim();
  const data = await linksModel.findById(link_id);

  if (!data) {
    ctx.reply(`Посилання не знайдено, перевірте id`);
    return;
  }
  await linksModel.findByIdAndDelete(link_id);

  ctx.reply('Посилання видалено');
  return;
};
