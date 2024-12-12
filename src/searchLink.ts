import { decrypt } from './crypto';
import linksModel from './models/linkModel';
import { IGlobalFuncProps } from './types/functions';

function levenshteinDistance(s1: string, s2: string) {
  const len1 = s1.length;
  const len2 = s2.length;
  const matrix = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[len1][len2];
}
function findClosestMatch(input: string, words: any) {
  let minDistance = Infinity;
  let closestWord = null;

  for (let word of words) {
    const distance = levenshteinDistance(input, word);
    if (distance < minDistance) {
      minDistance = distance;
      closestWord = word;
    }
  }
  return closestWord;
}

export const searchLink: IGlobalFuncProps = async (
  userId,
  userMessage,
  ctx,
) => {
  const allMsg = userMessage.split(' ');
  const desc = allMsg.slice(1).join(' ');
  const data = await linksModel.find({ owner: userId });

  const parse_links = data?.map((item: any) =>
    String(decrypt(item.short_desc)),
  );

  const closestMatch = findClosestMatch(desc, parse_links);

  if (closestMatch) {
    const link = data.find(
      (item: any) => decrypt(item.short_desc) === closestMatch,
    );
    ctx.reply(
      `Короткий опис: ${decrypt(link?.short_desc)} \n \nКатегорія: ${link?.category} \n \nПосилання: ${decrypt(link?.link)}`,
    );
    // console.log(`Можливо, ви шукаєте "${link}".`);
  } else {
    ctx.reply('Немає збігів.');
  }
  return;
};
