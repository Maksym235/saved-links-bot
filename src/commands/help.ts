export const helpCmd = (ctx: any) => {
  ctx.reply(
    `[Посилання на документацію](https://github.com/Maksym235/saved-links-bot#readme)`,
    { parse_mode: 'Markdown' },
  );
};
