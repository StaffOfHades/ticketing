/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import mongoose from 'mongoose';
import process from 'process';

import { app } from './app';

const port = process.env.port || 3000;

const start = async () => {
  if (!process.env.JWT_SIGNATURE) {
    throw new Error('JWT_SIGNATURE env variable not defined');
  }

  try {
    await mongoose.connect('mongodb://authentication-mongo-clusterip-srv:27017/authentication');
    console.log('MongoDB connection to authentication ready');
  } catch (error) {
    console.error(error);
  }

  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });

  server.on('error', console.error);
};

process.on('SIGINT', () => {
  console.info('Process interrupted');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.info('Process terminated');
  process.exit(0);
});

start();
