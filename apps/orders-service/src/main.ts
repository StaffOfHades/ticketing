/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import mongoose from 'mongoose';
import process from 'process';

import { app } from './app';
import { client } from './app/nats/client';

const port = process.env.port || 3003;

const start = async () => {
  if (!process.env.JWT_SIGNATURE) {
    throw new Error('JWT_SIGNATURE env variable not defined');
  }

  if (process.env.NODE_ENV === 'production' && !process.env.MONGO_URI) {
    throw new Error('MONGO_URI env variable not defined');
  }

  if (
    process.env.NODE_ENV === 'production' &&
    (!process.env.NATS_CLUSTER_ID || !process.env.NATS_CLIENT_ID || !process.env.NATS_URL)
  ) {
    throw new Error(
      'One of [NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL] env variables where not defined'
    );
  }

  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://orders-mongo-clusterip-srv:27017/orders'
    );
    console.log('MongoDB connection to orders ready');
  } catch (error) {
    console.error(error);
  }

  try {
    await client.connect(
      process.env.NATS_CLUSTER_ID || 'ticketing',
      process.env.NATS_CLIENT_ID || new mongoose.Types.ObjectId().toHexString(),
      process.env.NATS_URL || 'http://nats-clusterip-srv:4222'
    );
    console.log('NATS connection established');
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

  const promises: Array<Promise<unknown>> = [];

  try {
    promises.push(
      mongoose.connection.close().then(() => console.log('MongoDB connection closed'))
    );
  } catch (error) {
    console.log(error.message);
  }

  try {
    promises.push(client.close().then(() => console.log('NATS connection closed')));
  } catch (error) {
    console.log(error.message);
  }

  Promise.allSettled(promises).then(() => process.exit(0));
});

process.on('SIGTERM', () => {
  console.info('Process terminated');

  const promises: Array<Promise<unknown>> = [];

  try {
    promises.push(
      mongoose.connection.close().then(() => console.log('MongoDB connection closed'))
    );
  } catch (error) {
    console.log(error.message);
  }

  try {
    promises.push(client.close().then(() => console.log('NATS connection closed')));
  } catch (error) {
    console.log(error.message);
  }

  Promise.allSettled(promises).then(() => process.exit(0));
});

start();
