import { Document, HydratedDocument, Model, Schema, model } from "mongoose";

import { Password } from '../services/password'

interface User {
  email: string;
  password: string;
}

interface UserDocument extends Document, User {
  createdAt: Date;
  updatedAt: Date;
}

interface UserModel extends Model<UserDocument> {
  build(user: User): HydratedDocument<UserDocument>
}

const userSchema = new Schema<UserDocument, UserModel>(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true
    }
  },
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashedPassword = await Password.toHash(this.get('password'));
    this.set('password', hashedPassword)
  }
  done();
})

const build: UserModel['build'] = (user) => new UserModel(user);
userSchema.static('build', build);

export const UserModel = model<UserDocument, UserModel>('User', userSchema);

