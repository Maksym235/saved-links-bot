// Nodejs encryption with CTR
import * as bcrypt from 'bcrypt';
import * as crypto from 'node:crypto';
// const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
const salt = 10;
export function encrypt(text: any) {
  return Buffer.from(text).toString('base64');
  // return bcrypt.hashSync(text, salt);

  // let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  // let encrypted = cipher.update(text);
  // encrypted = Buffer.concat([encrypted, cipher.final()]);
  // return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

export function decrypt(text: any) {
  return Buffer.from(text, 'base64').toString();

  // let iv = Buffer.from(text.iv, 'hex');
  // let encryptedText = Buffer.from(text.encryptedData, 'hex');
  // let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  // let decrypted = decipher.update(encryptedText);
  // decrypted = Buffer.concat([decrypted, decipher.final()]);
  // return decrypted.toString();
}
