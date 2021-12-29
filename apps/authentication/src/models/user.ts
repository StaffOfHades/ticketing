import { Document, HydratedDocument, Model, Schema, model } from "mongoose";

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

const build: UserModel['build'] = (user) => new UserModel(user);
userSchema.static('build', build);

export const UserModel = model<UserDocument, UserModel>('User', userSchema);

