import usersModel from '../models/userModel';

export const startCmd = async (ctx: any) => {
  const { id, first_name, username } = ctx.message.from;
  const user = await usersModel.findOne({ tg_id: id });
  if (user) {
    await ctx.reply('Welcome');
    return;
  }
  await usersModel.create({
    first_name: first_name,
    username: username,
    tg_id: id,
  });
  await ctx.reply('Welcome');
};
