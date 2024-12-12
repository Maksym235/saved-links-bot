import { Schema, model } from 'mongoose';
import { mongooseError } from '../helpers/MongooseError';

const links = new Schema(
  {
    link: {
      type: String,
      required: true,
    },
    short_desc: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    owner: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false, timestamps: false },
);

links.post('save', mongooseError);

const linksModel = model('links', links);

export default linksModel;
