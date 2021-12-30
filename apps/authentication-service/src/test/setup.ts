import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

let mongo: undefined | MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_SIGNATURE = 'test_signature';
  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

declare global {
  namespace NodeJS {
    interface Global {
      signin: (user: { email: string; id: string }) => Promise<Array<string>>;
    }
  }
}

global.signin = async (user) => {
  const userJWT = jwt.sign(user, process.env.JWT_SIGNATURE);
  const cookieValue = Buffer.from(JSON.stringify({ jwt: userJWT })).toString(
    'base64'
  );
  const cookies = [`session=${cookieValue}; path=/; httponly`];

  return Promise.resolve(cookies);
};
