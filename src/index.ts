import { Telegraf } from 'telegraf';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { message } from 'telegraf/filters';
import { createClient } from '@supabase/supabase-js';
import { development, production } from './core';
import 'dotenv/config';
const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const bot = new Telegraf(BOT_TOKEN, {
  handlerTimeout: Infinity,
});

bot.command('start', (ctx) => {
  ctx.reply('Welcome');
});

bot.command('rdlink', async (ctx) => {
  const { data, error }: any = await supabase.from('links').select('*');
  if (error) {
    console.log(error);
  }
  supabase.from('links').select();
  const randomIndex = Math.floor(Math.random() * data.length);
  await ctx.reply(
    `короткий опис: ${data[randomIndex].short_desc} \n \n посилання: ${data[randomIndex].link}`,
  );
  // console.log(data[randomIndex]);
});

bot.on(message('text'), async (ctx) => {
  const userMessage = ctx.message.text;
  const messageArr = userMessage.split(' ');
  if (!messageArr[0].includes('http') || !messageArr[0].includes('https')) {
    ctx.reply('Дай норм силку дурик');
    return;
  }

  const desc = messageArr.slice(1).join(' ');
  const { error } = await supabase.from('links').insert({
    link: messageArr[0],
    short_desc: desc,
  });
  if (error) {
    console.log(error.message);
  }
  await ctx.reply('все супер, зберіг');
});
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
