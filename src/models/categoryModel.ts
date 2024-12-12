import { Schema, model } from 'mongoose';
import { mongooseError } from '../helpers/MongooseError';

const categories = new Schema(
  {
    name: {
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

categories.post('save', mongooseError);

const categoriesModel = model('categories', categories);

export default categoriesModel;
