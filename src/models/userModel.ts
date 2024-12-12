import { Schema, model } from 'mongoose';
import { mongooseError } from '../helpers/MongooseError';

const users = new Schema(
  {
    first_name: {
      type: String,
      // required: true,
    },
    username: {
      type: String,
      // required: true,
    },
    tg_id: {
      type: Number,
      // required: true,
    },
  },
  { versionKey: false, timestamps: true },
);
users.post('save', mongooseError);
const usersModel = model('users', users);

export default usersModel;
