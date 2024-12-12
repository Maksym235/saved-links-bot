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
import mongoose from 'mongoose';
import {
  addLinks,
  deleteLinkCallback,
  getAllLinks,
  getRandomLink,
} from './callbackFunctions';
import {
  categoriesCmd,
  category_add,
  get_links,
  helpCmd,
  rdlink,
  search_link,
  startCmd,
} from './commands';
import { deleteLink } from './deleteLink';
const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
const DB_HOST = process.env.DATABASE_URL || '';

mongoose.connect(DB_HOST);
const bot = new Telegraf(BOT_TOKEN, {
  handlerTimeout: Infinity,
});

let user_message: string;
let user_Id: number;

bot.command('start', startCmd);

bot.command('help', helpCmd);

bot.command('categories', categoriesCmd);

bot.command('search_link', search_link);

bot.command('rdlink', rdlink);

bot.command('get_links', get_links);

bot.action('category_add', category_add);
bot.on(message('text'), async (ctx) => {
  // Визначаю повідомлення і id користувача
  const userMessage = ctx.message.text;
  const userId = ctx.message.from.id;
  const method = userMessage.slice(0, 2);

  user_message = userMessage;
  user_Id = userId;

  switch (method) {
    case '-s':
      await searchLink(userId, userMessage, ctx);
      break;
    case '-c':
      await addCategory(userId, userMessage, ctx);
      break;
    case '-d':
      await deleteLink(userId, userMessage, ctx);
      break;
    default:
      await selectCategories(user_Id, '_add', ctx);
  }
});
//===============================================================

// Обробка вибраної категорії
bot.on('callback_query', async (ctx) => {
  //@ts-ignore
  const cbData: string = ctx.callbackQuery.data;
  const selectedCategory = cbData.slice(0, cbData.length - 4);
  const method = cbData.slice(cbData.length - 4);
  console.log(ctx);
  switch (method) {
    case '_add':
      await addLinks(user_Id, user_message, ctx, selectedCategory);
      ctx.answerCbQuery();
      break;
    case '_rnd':
      await getRandomLink(user_Id, user_message, ctx, selectedCategory);
      ctx.answerCbQuery();
      break;
    case '_get':
      await getAllLinks(user_Id, user_message, ctx, selectedCategory);
      ctx.answerCbQuery();
      break;
    case '_dlt':
      await deleteLinkCallback(ctx);
      break;
  }
});

////////////////////////////////////////////////////////////////
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
