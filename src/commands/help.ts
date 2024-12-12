import { Context } from 'telegraf';

export const helpCmd = (ctx: Context) => {
  ctx.reply(
    `[Посилання на документацію](https://github.com/Maksym235/saved-links-bot#readme)`,
    { parse_mode: 'Markdown' },
  );
};
