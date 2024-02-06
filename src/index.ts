import { Telegraf } from 'telegraf';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { message } from 'telegraf/filters';
import { createClient } from '@supabase/supabase-js';
import { development, production } from './core';
import { Database } from './types/database';
import 'dotenv/config';
import { selectCategories } from './selectCategories';
import { searchLink } from './searchLink';
import { addCategory } from './addCategory';
import { addLinks, getAllLinks, getRandomLink } from './callbackFunctions';
const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);

const bot = new Telegraf(BOT_TOKEN, {
  handlerTimeout: Infinity,
});

let user_message: string;
let user_Id: number;

bot.command('start', async (ctx) => {
  const { id, username } = ctx.message.from;
  await ctx.reply('Welcome');
  const { error } = await supabase.from('users').insert({
    username,
    tg_id: id,
  });
  if (error) {
    console.log(error.message);
  }
});

bot.command('help', (ctx) => {
  ctx.reply(
    `
  # Довідник по командам

# /start
Команда яка запускає бота

# /help
Команда допомоги 

# /categories 
Команда для перегляду всіх категорій і додавання нових

# /get_links
Команда для перегляду всіх посилань в певній категорій 

#/rdlink 
Команда яка повертає рандомне посилання в певній категорії 

#/search_link 
Команда для пошуку посилань по короткому опису
==============================================

# Приклад використання

1. **Додаємо нову категорію** з допомогою команди  /comands => Додати нову категорію => тут вказуємо назву нової категорії з префіксом  -с (Англійська).\nПриклад: -c Фільми

2. **Відправляємо наше посилання**. ***Рекомендовано*** додати короткий опис. У форматі <Посилання> <Пробіл> <Короткий опис>. Та вибираємо категорію в яку додаємо посилання.\nПриклад: https://google.com посилання на гугл => Фільми 


`,
    { parse_mode: 'Markdown' },
  );
});

// Команда category
// Показую весь список категорій і вставляю кнопку для додавання нової категорії
bot.command('categories', async (ctx) => {
  const userId = ctx.message.from.id;
  // Фетчим всі категорії юзера
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId);
  if (error) {
    ctx.reply(`Something went wrong`);
    return;
  }
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

bot.command('search_link', async (ctx) => {
  ctx.reply(
    `для пошуку певного посилання ми можете відправити короткий опис з приставкою -d. \nПриклад: -d Короткий опис`,
  );
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
  user_Id = userId;
  await selectCategories(supabase, userId, '_rnd', ctx);
});

bot.command('get_links', async (ctx) => {
  const userId = ctx.message.from.id;
  user_Id = userId;
  await selectCategories(supabase, userId, '_get', ctx);
  // 1. Вибір категорії з якої хочемо посилання
});

bot.on(message('text'), async (ctx) => {
  // Визначаю повідомлення і id користувача
  const userMessage = ctx.message.text;
  const userId = ctx.message.from.id;
  // Перевірка чи повідомлення відноситься до створення категорій
  //===========================================================
  if (userMessage.includes('-d')) {
    await searchLink(supabase, userId, userMessage, ctx);
    return;
  }

  if (userMessage.includes('-c')) {
    await addCategory(supabase, userId, userMessage, ctx);
    return;
  }
  //========================================================
  // Відправляю користувачу клавіатуру для вибору в яку категорію додавати посилання

  user_message = userMessage;
  user_Id = userId;
  await selectCategories(supabase, user_Id, '_add', ctx);
  //=========================================================
});
//===============================================================

// Обробка вибраної категорії
bot.on('callback_query', async (ctx) => {
  //@ts-ignore
  const cbData: string = ctx.callbackQuery.data;
  const selectedCategory = cbData.slice(0, cbData.length - 4);
  const method = cbData.slice(cbData.length - 4);
  switch (method) {
    case '_add':
      await addLinks(supabase, user_Id, user_message, ctx, selectedCategory);
      ctx.answerCbQuery();
      break;
    case '_rnd':
      await getRandomLink(
        supabase,
        user_Id,
        user_message,
        ctx,
        selectedCategory,
      );
      ctx.answerCbQuery();
      break;
    case '_get':
      await getAllLinks(supabase, user_Id, user_message, ctx, selectedCategory);
      ctx.answerCbQuery();
      break;
  }
});

////////////////////////////////////////////////////////////////
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
