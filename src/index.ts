import { Telegraf, Scenes, Markup, session } from 'telegraf';
import * as St from 'telegraf';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { message } from 'telegraf/filters';
import { createClient } from '@supabase/supabase-js';
import { development, production } from './core';
import { encrypt, decrypt } from './crypto';
import 'dotenv/config';
const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const bot = new Telegraf(BOT_TOKEN, {
  handlerTimeout: Infinity,
});

bot.command('start', async (ctx) => {
  const { id, username } = ctx.message.from;
  ctx.reply('Welcome');
  const { error } = await supabase.from('users').insert({
    username,
    tg_id: id,
  });
  if (error) {
    console.log(error.message);
  }
});
// bot.on('callback_query', async (ctx) => {
//   // Explicit usage
//   await ctx.answerCbQuery();
//   //@ts-ignore
//   console.log(ctx.callbackQuery.data);
//   await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);

//   // Using context shortcut
//   await ctx.answerCbQuery();
// });

// Команда category
// Показую весь список категорій і вставляю кнопку для додавання нової категорії
bot.command('categories', async (ctx) => {
  const userId = ctx.message.from.id;
  // Фетчим всі категорії юзера
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId);

  // переводимо масив об'єктів в рядок для відображення
  const allCategories =
    `-` +
    categories
      ?.map(
        (ctg: { id: number; category_name: string; user_id: number }) =>
          ctg.category_name,
      )
      .join('\n-');

  //Повератаємо користувачу список з кнопкою
  await ctx.reply(allCategories, {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Додати нову', callback_data: 'category_add' }],
      ],
    },
  });
});

// Опрацювання кнопки категорій
// Відправляє користувачу повідомлення в якому фортматі треба квказати нову категорію
bot.action('category_add', async (ctx) => {
  ctx.reply(`Вкажіть назву категорії з приставкою -c. Приклад: "-c Фільми"`);
  ctx.answerCbQuery();
});

// Команда rdlink повертає рандомене посилання
bot.command('rdlink', async (ctx, next) => {
  const userId = ctx.message.from.id;

  // 1. Вибір категорії з якої хочемо посилання
  await ctx.reply('Виберіть категорію', {
    reply_markup: {
      force_reply: true,
    },
  });

  //2. Вибираємо з бази всі посилання
  const { data, error }: any = await supabase
    .from('links')
    .select('*')
    .eq('user_id', userId);
  if (error) {
    console.log(error);
  }
  // Вибираємо рандомний індекс
  const randomIndex = Math.floor(Math.random() * data.length);
  const parseData = data[randomIndex];
  await ctx.reply(
    `короткий опис: ${decrypt(parseData.short_desc)} \n \n посилання: ${decrypt(parseData.link)}`,
  );
});

bot.on(message('text'), async (ctx) => {
  // Визначаю повідомлення і id користувача
  const userMessage = ctx.message.text;
  const userId = ctx.message.from.id;
  // Перевірка чи повідомлення відноситься до створення категорій
  //===========================================================
  if (userMessage.includes('-c')) {
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
  }
  //========================================================
  // Відправляю користувачу клавіатуру для вибору в яку категорію додавати посилання
  await ctx.reply(
    'Виберіть категорію',
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Кіно', callback_data: 'movie_add' },
            { text: 'Книги', callback_data: 'books_add' },
          ],
          [
            { text: 'Button 3', callback_data: 'btn-1' },
            { text: 'Button 4', callback_data: 'btn-2' },
          ],
        ],
      },
    },
    //=========================================================
    // Markup.inlineKeyboard([
    //   Markup.button.callback('Кіно', 'movie_add'),
    //   Markup.button.callback('Книги', 'books_add'),
    //   Markup.button.callback('Робота', 'work_add'),
    //   Markup.button.callback('Навчання', 'study_add'),
    //   Markup.button.callback('Кіно', 'movie_add'),
    //   Markup.button.callback('Книги', 'books_add'),
    //   Markup.button.callback('Робота', 'work_add'),
    //   Markup.button.callback('Навчання', 'study_add'),
    // ]),
  );

  // const messageArr = userMessage.split(' ');
  // if (!messageArr[0].includes('http') || !messageArr[0].includes('https')) {
  //   ctx.reply('Дай норм силку дурик');
  //   return;
  // }

  // const desc = messageArr.slice(1).join(' ');
  // const { error } = await supabase.from('links').insert({
  //   link: encrypt(messageArr[0]),
  //   short_desc: encrypt(desc),
  //   user_id: userId,
  // });
  // if (error) {
  //   console.log(error.message);
  // }
  // await ctx.reply('все супер, зберіг');
});

//===============================================================
// Обробка вибраної категорії
bot.on('callback_query', async (ctx) => {
  //@ts-ignore
  switch (ctx.callbackQuery.data) {
    case 'movie_add':
      await ctx.reply('Додати кіно');
      break;
    case 'books_add':
      await ctx.reply('Додати книгу');
      break;
    case 'work_add':
      await ctx.reply('Додати по роботі');
      break;
    case 'study_add':
      await ctx.reply('Додати по навчанню');
      break;
  }
  await ctx.answerCbQuery();
});

////////////////////////////////////////////////////////////////
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
